import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { AddOutlined } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { useContext, useEffect, useMemo, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { firestore } from "~config/firebase";
import { maybe } from "~utils";
import { useNotify, useOpen } from "~utils/hooks";
import { OrderContext } from "../index";

const schema = yup.object().shape({
  name: yup.string().required(),
  option: yup.string().required(),
  price: yup.number(),
  qty: yup.number().required().positive(),
});

const useStyles = makeStyles((theme) => ({
  content: {
    display: "grid",
    gap: theme.spacing(1.5) + "px",
  },
  addButton: {
    marginTop: theme.spacing(1),
  },
}));

const NewOrderLine = () => {
  const startDate = useMemo(() => new Date(new Date().setHours(0, 0, 0, 0)), []);
  const endDate = useMemo(() => new Date(new Date().setHours(24, 0, 0, 0)), []);
  const { globalLoading, setGlobalLoading } = useContext(OrderContext);
  const notify = useNotify();
  const classes = useStyles();
  const { isOpen, onOpen, onClose } = useOpen();
  const [productsRaw, loading] = useCollectionData(firestore.collection("products"));
  const products = maybe(() => productsRaw, []);
  const [product, setProduct] = useState(null);

  const {
    control,
    errors,
    reset,
    setValue,
    register,
    unregister,
    formState: { isDirty, isSubmitting },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "",
      option: "",
      price: 0,
      qty: 0,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    register("name");
    register("price");
    return () => {
      unregister("name");
      unregister("price");
    };
  }, [register, unregister]);

  const onSubmit = async (data) => {
    setGlobalLoading(true);
    // check duplicate
    const duplicateCheckerRef = await firestore
      .collection("orderLine")
      .where("name", "==", data.name)
      .where("option", "==", data.option)
      .where("date", ">=", startDate)
      .where("date", "<", endDate)
      .get();
    const duplicateData = duplicateCheckerRef.docs.map((doc) => doc.data());
    if (duplicateData.length > 0) {
      notify.error("Product already exists.");
      reset();
      onClose();
    } else {
      const total = data.price * data.qty;
      try {
        await firestore.collection("orderLine").add({
          date: new Date(),
          name: data.name,
          price: data.price,
          option: data.option,
          qty: data.qty,
          total: total,
        });
        notify.success("Product added");
        reset();
        onClose();
      } catch (e) {
        console.log(e);
      }

      // Update order instance
      const checkOrderInstanceRef = await firestore
        .collection("orders")
        .where("date", ">=", startDate)
        .where("date", "<", endDate)
        .get();
      const checkOrderInstance = checkOrderInstanceRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      let newOrderTotal;
      if (checkOrderInstance.length > 0) {
        const orderInstance = checkOrderInstance[0];
        const oldTotal = orderInstance.total;
        newOrderTotal = oldTotal + total;
        await firestore.collection("orders").doc(orderInstance.id).update({
          total: newOrderTotal,
        });
      } else {
        newOrderTotal = total;
        await firestore.collection("orders").add({
          date: new Date(),
          total: newOrderTotal,
        });
      }

      //  Update cash flow
      const cashFlowRef = await firestore.collection("root").doc("cashFlow").get();
      const { totalOrder, totalPayment } = cashFlowRef.data();
      const newTotalOrder = totalOrder + total;
      await firestore
        .collection("root")
        .doc("cashFlow")
        .update({
          totalPayment: totalPayment,
          totalOrder: newTotalOrder,
          total: newTotalOrder - totalPayment,
        });
    }
    setGlobalLoading(false);
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        startIcon={<AddOutlined />}
        className={classes.addButton}
        fullWidth
        onClick={onOpen}
      >
        Add
      </Button>
      <Dialog onClose={onClose} open={isOpen}>
        <DialogTitle disableTypography>
          <Typography>New Order Line</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.content}>
            <Autocomplete
              id="free-solo-demo"
              disabled={globalLoading}
              freeSolo
              loading={loading}
              options={products}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => option.name}
              onChange={(event, newProduct) => {
                setProduct(newProduct);
                if (newProduct) {
                  setValue("name", newProduct.name, { shouldDirty: true, shouldValidate: true });
                  setValue("price", newProduct.price, { shouldDirty: true });
                } else {
                  setValue("name", "", { shouldDirty: true, shouldValidate: true });
                  setValue("price", 0, { shouldDirty: true });
                  setValue("option", "", { shouldDirty: true });
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Product" variant="outlined" />
              )}
            />
            <FormControl variant="outlined">
              <InputLabel id="option-label">Option</InputLabel>
              <Controller
                as={Select}
                labelId="option-label"
                name="option"
                control={control}
                disabled={globalLoading}
              >
                {product?.options
                  ? product.options.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))
                  : []}
              </Controller>
              {errors?.option ? <FormHelperText>{errors?.option?.message}</FormHelperText> : null}
            </FormControl>
            <Controller
              as={TextField}
              disabled={globalLoading}
              type="number"
              name="qty"
              control={control}
              label="Quantity"
              error={!!errors?.qty}
              helperText={!!errors?.qty && errors?.price?.message}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            disabled={!isDirty || isSubmitting || globalLoading}
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewOrderLine;
