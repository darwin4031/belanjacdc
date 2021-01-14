import { makeStyles, Paper } from "@material-ui/core";
import { createContext, useContext, useState } from "react";
import { AuthContext } from "~config/auth";
import NewOrders from "./components/NewOrders";
import NewProduct from "./components/NewProduct";
import Orders from "./components/Orders";

export const OrderContext = createContext();

const useStyles = makeStyles((theme) => ({
  root: { display: "grid", gap: theme.spacing(2) + "px" },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
  },
}));

const Order = () => {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();
  const [globalLoading, setGlobalLoading] = useState(false);

  return (
    <OrderContext.Provider value={{ globalLoading, setGlobalLoading }}>
      <div className={classes.root}>
        {currentUser && (
          <div className={classes.buttonContainer}>
            <NewProduct />
            <NewOrders />
          </div>
        )}
        <Paper className={classes.paper}>
          <Orders />
        </Paper>
      </div>
    </OrderContext.Provider>
  );
};

export default Order;
