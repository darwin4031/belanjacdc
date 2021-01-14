import { makeStyles } from "@material-ui/core";
import { LocalAtmOutlined, PaymentOutlined, ShoppingCartOutlined } from "@material-ui/icons";
import { useDocumentData } from "react-firebase-hooks/firestore";
import CardPrice from "~components/CardPrice";
import { firestore } from "~config/firebase";
import { maybe } from "~utils";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridGap: theme.spacing(2) + "px",
    gridAutoFlow: "row",
    [theme.breakpoints.up("md")]: {
      gridAutoFlow: "column",
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const [cashFlowRaw] = useDocumentData(firestore.doc(`/root/cashFlow`));
  const { totalPayment, totalOrder, total } = maybe(() => cashFlowRaw, {
    totalPayment: 0,
    totalOrder: 0,
    total: 0,
  });

  return (
    <div className={classes.root}>
      <CardPrice
        icon={<ShoppingCartOutlined />}
        title="Belanjaan"
        number={totalOrder}
        background={"#ffc85c"}
      />
      <CardPrice
        icon={<PaymentOutlined />}
        title="Pembayaran"
        number={totalPayment}
        background={"#5c6e91"}
      />
      <CardPrice
        icon={<LocalAtmOutlined />}
        title="Sisa Hutang"
        number={total}
        background={total > 0 ? "#ec524b" : "#4e8d7c"}
      />
    </div>
  );
};

export default Home;
