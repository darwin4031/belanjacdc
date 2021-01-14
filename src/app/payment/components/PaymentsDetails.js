import { Dialog, DialogActions, DialogContent, makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(() => ({
  content: { padding: 0 + "!important" },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

const PaymentsDetails = (props) => {
  const { receipt, isOpen, onClose } = props;
  const classes = useStyles();

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={onClose}>
      <DialogContent dividers className={classes.content}>
        <img src={receipt} alt="receipt" className={classes.image} />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Kembali
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentsDetails;
