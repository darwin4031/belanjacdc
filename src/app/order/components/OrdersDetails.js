import {
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ResponsiveTable from "~components/table/ResponsiveTable";
import { firestore } from "~config/firebase";
import { dynamicSort, maybe } from "~utils";

const useStyles = makeStyles((theme) => ({
  content: { padding: 0 + "!important" },
  containerText: {
    display: "flex",
    flexDirection: "column",
  },
  minusMargin: {
    marginTop: theme.spacing(-1),
  },
}));

const ShoppingDetails = (props) => {
  const { dateDetail, isOpen, onClose } = props;
  const classes = useStyles();
  const startDate = useMemo(
    () => (dateDetail ? new Date(dateDetail.setHours(0, 0, 0, 0)) : null),
    [dateDetail]
  );
  const endDate = useMemo(() => (dateDetail ? new Date(dateDetail.setHours(24, 0, 0, 0)) : null), [
    dateDetail,
  ]);

  const detailsRawRef = firestore.collection("orderLine");
  const detailsRef =
    startDate || endDate
      ? detailsRawRef.where("date", ">=", startDate).where("date", "<", endDate)
      : detailsRawRef;
  const [detailsRaw] = useCollectionData(detailsRef, {
    idField: "id",
  });
  const details = dateDetail ? maybe(() => detailsRaw, []) : [];

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={onClose}>
      <DialogContent dividers className={classes.content}>
        <TableContainer>
          <ResponsiveTable size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nama Produk</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.sort(dynamicSort("productName")).map((detail) => {
                return (
                  <TableRow key={detail.id}>
                    <TableCell>
                      {" "}
                      <div className={classes.containerText}>
                        <Typography>{detail.name}</Typography>
                        <Typography
                          className={classes.minusMargin}
                          variant="caption"
                          color="textSecondary"
                        >
                          {detail.option}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <div className={classes.containerText}>
                        <Typography variant="caption" color="textSecondary">
                          {detail.qty} x {detail.price}
                        </Typography>
                        <Typography className={classes.minusMargin}>
                          Rp. {detail.total.toLocaleString()}
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </ResponsiveTable>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Kembali
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShoppingDetails;
