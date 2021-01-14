import { LinearProgress, makeStyles } from "@material-ui/core";
import { useContext, useEffect } from "react";
import { BaseContext } from "~config/baseProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    top: 0,
    width: "100%",
  },
}));

export const Progress = () => {
  const { loading } = useContext(BaseContext);
  const classes = useStyles();

  return loading ? <LinearProgress className={classes.root} /> : null;
};

export const ProgressToggle = () => {
  const { setLoading } = useContext(BaseContext);

  useEffect(() => {
    setLoading(true);
    return () => {
      setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
