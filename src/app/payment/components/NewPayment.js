import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { AddOutlined } from "@material-ui/icons";
import { DropzoneArea } from "material-ui-dropzone";
import { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Controller, useForm } from "react-hook-form";
import { firestore, storage } from "~config/firebase";
import { maybe } from "~utils";
import { useNotify, useOpen } from "~utils/hooks";

const useStyles = makeStyles((theme) => ({
  receiptContainer: {
    marginBottom: theme.spacing(2),
  },
}));

const NewPayment = () => {
  const { isOpen, onOpen, onClose } = useOpen();
  const classes = useStyles();
  const notify = useNotify();
  const [file, setFile] = useState(null);
  const [cashFlow] = useDocumentData(firestore.doc(`/root/cashFlow`));
  const totalOrder = maybe(() => cashFlow.totalOrder, 0);
  const totalPayment = maybe(() => cashFlow.totalPayment, 0);
  const totalDebt = maybe(() => cashFlow.total, 0);

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      totalPay: 0,
    },
  });

  useEffect(() => {
    reset({
      totalPay: totalDebt,
    });
  }, [reset, totalDebt]);

  const onSubmit = async (data) => {
    if (file === null) {
      notify.error("File is required.");
      return;
    }
    const storageRef = storage.ref();
    const uploadTask = await storageRef.child(`receipt/${file.name}`).put(file);
    const downloadUrl = await uploadTask.ref.getDownloadURL();
    await firestore.collection("payments").doc().set({
      date: new Date(),
      receipt: downloadUrl,
      total: data.totalPay,
    });
    await firestore
      .collection("root")
      .doc("cashFlow")
      .update({
        totalPayment: totalPayment + data.totalPay,
        totalOrder: totalOrder,
        total: totalOrder - (totalPayment + data.totalPay),
      });
    notify.success("Payment telah berhasil disimpan.");
    onClose();
  };

  return (
    <>
      <Button variant="contained" color="primary" startIcon={<AddOutlined />} onClick={onOpen}>
        New Payment
      </Button>
      <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent dividers>
          <div className={classes.receiptContainer}>
            <DropzoneArea
              filesLimit={1}
              acceptedFiles={["image/*"]}
              dropzoneText="Drag and drop an receipt here or click"
              onChange={(files) => {
                if (files.length > 0) {
                  setFile(files[0]);
                } else {
                  setFile(null);
                }
              }}
            />
          </div>
          <Controller
            control={control}
            name="totalPay"
            render={({ onChange, value }) => (
              <TextField
                label="Total Bayar"
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.valueAsNumber)}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={onClose} disabled={isSubmitting}>
            Kembali
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewPayment;
