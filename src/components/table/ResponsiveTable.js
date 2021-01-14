import { Table } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      "& table": {
        tableLayout: "fixed",
      },
    },
    "& table": {
      tableLayout: "auto",
    },
    overflowX: "auto",
    width: "100%",
  },
}));

const ResponsiveTable = (props) => {
  const { children, className, size = "medium" } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Table className={className} size={size}>
        {children}
      </Table>
    </div>
  );
};

export default ResponsiveTable;
