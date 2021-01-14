import { Button, Divider, Drawer, makeStyles, Typography } from "@material-ui/core";
import { AddOutlined } from "@material-ui/icons";
import dayjs from "dayjs";
import { useOpen } from "~utils/hooks";
import NewOrderLine from "./NewOrderLine";
import OrderLineList from "./OrderLineList";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.spacing(40),
    padding: theme.spacing(1),
  },
  body: {
    padding: theme.spacing(1, 0),
    display: "flex",
    flexDirection: "column",
  },
}));

const NewOrders = () => {
  const classes = useStyles();
  const { isOpen, onOpen, onClose } = useOpen();

  return (
    <>
      <Button variant="contained" color="primary" startIcon={<AddOutlined />} onClick={onOpen}>
        New Order
      </Button>
      <Drawer open={isOpen} onClose={onClose} anchor="right">
        <div className={classes.root}>
          <Typography>
            Order Line <strong>{dayjs().format("DD-MM-YYYY")}</strong>
          </Typography>
          <Divider />
          <div className={classes.body}>
            <OrderLineList />
            <Divider />
            <NewOrderLine />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default NewOrders;
