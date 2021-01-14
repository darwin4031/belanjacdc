import { makeStyles, Paper } from "@material-ui/core";
import { createContext, useContext, useState } from "react";
import { AuthContext } from "~config/auth";
import NewPayment from "./components/NewPayment";
import Payments from "./components/Payments";

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
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const [globalLoading, setGlobalLoading] = useState(false);

  return (
    <OrderContext.Provider value={{ globalLoading, setGlobalLoading }}>
      <div className={classes.root}>
        {currentUser && (
          <div className={classes.buttonContainer}>
            <NewPayment />
          </div>
        )}
        <Paper className={classes.paper}>
          <Payments />
        </Paper>
      </div>
    </OrderContext.Provider>
  );
};

export default Order;
