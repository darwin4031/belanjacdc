import { Card, makeStyles, Typography } from "@material-ui/core";
import { cloneElement } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(3.5, 0, 0),
  },
  card: {
    padding: theme.spacing(0, 2),
  },
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  iconRoot: ({ background }) => {
    return {
      padding: theme.spacing(2),
      background: background,
      borderRadius: 3,
      boxShadow: "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(255, 152, 0,.4)",
      marginTop: -20,
    };
  },
  icon: {
    color: "#fff",
    width: theme.spacing(7),
    height: theme.spacing(7),
    fontSize: theme.spacing(4),
  },
  descriptionRoot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  link: {
    margin: theme.spacing(1, 0),
    display: "flex",
    justifyContent: "flex-end",
  },
}));

const CardPrice = (props) => {
  const { icon, title, number, background } = props;
  const classes = useStyles({ background });

  return (
    <div className={classes.container}>
      <Card variant="outlined" className={classes.card}>
        <div className={classes.root}>
          <div className={classes.iconRoot}>{cloneElement(icon, { className: classes.icon })}</div>
          <div className={classes.descriptionRoot}>
            <Typography variant="h6" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h5" color="textSecondary">
              {number.toLocaleString("id")}
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CardPrice;
