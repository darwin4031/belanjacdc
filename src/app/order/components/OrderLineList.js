import { Divider, IconButton, makeStyles, Typography } from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { Fragment, useContext, useMemo, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDebouncedCallback } from "use-debounce";
import { firestore } from "~config/firebase";
import { maybe } from "~utils";
import { useNotify } from "~utils/hooks";
import { OrderContext } from "../index";

const useStyles = makeStyles((theme) => ({
  lineRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1, 0),
  },
  totalRoot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginLeft: "auto",
  },
  priceRoot: {
    display: "flex",
    alignItems: "center",
    "& input": {
      maxWidth: theme.spacing(8),
      marginRight: theme.spacing(1),
    },
  },
  button: {
    marginLeft: theme.spacing(1),
  },
}));

const OrderLine = (props) => {
  const startDate = useMemo(() => new Date(new Date().setHours(0, 0, 0, 0)), []);
  const endDate = useMemo(() => new Date(new Date().setHours(24, 0, 0, 0)), []);

  const classes = useStyles();
  const { line, deleteLine } = props;
  const [qty, setQty] = useState(line.qty);
  const notify = useNotify();
  const { globalLoading, setGlobalLoading } = useContext(OrderContext);

  const changeQty = useDebouncedCallback(async (newQty) => {
    setGlobalLoading(true);
    // get cashFlow
    const cashFlowRef = await firestore.collection("root").doc("cashFlow").get();
    const { totalOrder, totalPayment } = cashFlowRef.data();

    // get order
    const orderRef = await firestore
      .collection("orders")
      .where("date", ">=", startDate)
      .where("date", "<", endDate)
      .get();
    const order = orderRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0];

    // get old orderLine
    const orderLineRef = await firestore.collection("orderLine").doc(line.id).get();
    const oldOrderLine = orderLineRef.data();

    const newLineTotal = line.price * newQty;
    // calculate new orderTotal
    const newOrderTotal = order.total - oldOrderLine.total + newLineTotal;
    // calculate cashFlow
    const newCashFlowOrderTotal = totalOrder - order.total + newOrderTotal;
    const newCashFlowTotal = newCashFlowOrderTotal - totalPayment;

    // update new orderLine
    await firestore
      .collection("orderLine")
      .doc(line.id)
      .update({
        qty: newQty,
        total: line.price * newQty,
      });
    // update order
    await firestore.collection("orders").doc(order.id).update({
      total: newOrderTotal,
    });

    // update cashFlow
    await firestore.collection("root").doc("cashFlow").update({
      totalOrder: newCashFlowOrderTotal,
      total: newCashFlowTotal,
    });

    notify.success(`${line.name}/${line.option} qty update to ${newQty}`);
    setGlobalLoading(false);
  }, 300);

  return (
    <div className={classes.lineRoot}>
      <div>
        <Typography>{line.name}</Typography>
        <Typography variant="caption" color="textSecondary" style={{ marginTop: -6 }}>
          {line.option}
        </Typography>
      </div>
      <div className={classes.totalRoot}>
        <div className={classes.priceRoot}>
          <input
            disabled={globalLoading}
            type="number"
            value={qty}
            onChange={(e) => {
              const newQty = e.target.valueAsNumber;
              setQty(newQty);
              changeQty.callback(newQty);
            }}
          />
          <Typography>x Rp. {line.price.toLocaleString()}</Typography>
        </div>
        <Typography variant="caption" color="textSecondary" style={{ marginTop: -4 }}>
          Rp. {line.total.toLocaleString()}
        </Typography>
      </div>
      <IconButton
        size="small"
        className={classes.button}
        color="secondary"
        disabled={globalLoading}
        onClick={() => {
          deleteLine(line.id);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};
const OrderLineList = () => {
  const startDate = useMemo(() => new Date(new Date().setHours(0, 0, 0, 0)), []);
  const endDate = useMemo(() => new Date(new Date().setHours(24, 0, 0, 0)), []);
  const { setGlobalLoading } = useContext(OrderContext);
  const notify = useNotify();

  const [productsRaw] = useCollectionData(
    firestore.collection("orderLine").where("date", ">=", startDate).where("date", "<", endDate),
    {
      idField: "id",
    }
  );
  const orderLine = maybe(() => productsRaw, []);

  const deleteLine = async (id) => {
    setGlobalLoading(true);
    // get cashFlow
    const cashFlowRef = await firestore.collection("root").doc("cashFlow").get();
    const { totalOrder, totalPayment } = cashFlowRef.data();

    // get order
    const orderRef = await firestore
      .collection("orders")
      .where("date", ">=", startDate)
      .where("date", "<", endDate)
      .get();
    const order = orderRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0];

    // get old orderLine
    const orderLineRef = await firestore.collection("orderLine").doc(id).get();
    const oldOrderLine = orderLineRef.data();

    // calculate new order
    const newOrderTotal = order.total - oldOrderLine.total;
    // calculate new cashflow
    const newCashFlowOrderTotal = totalOrder - oldOrderLine.total;
    const newCashFlowTotal = totalOrder - oldOrderLine.total - totalPayment;

    // update order
    await firestore.collection("orders").doc(order.id).update({
      total: newOrderTotal,
    });

    // update cashFlow
    await firestore.collection("root").doc("cashFlow").update({
      totalOrder: newCashFlowOrderTotal,
      total: newCashFlowTotal,
    });

    //delete order line
    await firestore.collection("orderLine").doc(id).delete();
    notify.success(`${oldOrderLine.name} deleted.`);
    setGlobalLoading(false);
  };

  return (
    <div>
      {orderLine.map((line, idx) => (
        <Fragment key={idx}>
          <OrderLine key={idx} line={line} deleteLine={deleteLine} />
          {idx + 1 !== orderLine.length && <Divider />}
        </Fragment>
      ))}
    </div>
  );
};

export default OrderLineList;
