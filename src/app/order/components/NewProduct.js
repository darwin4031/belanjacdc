import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { AddOutlined } from "@material-ui/icons";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { firestore } from "~config/firebase";
import { useNotify, useOpen } from "~utils/hooks";

const schema = yup.object().shape({
  name: yup.string().required(),
  options: yup.string().required(),
  price: yup.number().required().positive(),
});

const useStyles = makeStyles((theme) => ({
  content: {
    display: "grid",
    gap: theme.spacing(1.5) + "px",
  },
}));

const NewProduct = () => {
  const { isOpen, onOpen, onClose } = useOpen();
  const notify = useNotify();
  const classes = useStyles();
  const {
    control,
    errors,
    reset,
    formState: { isDirty, isSubmitting },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "",
      options: "",
      price: 0,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    // check duplicate
    const duplicateCheckerRef = await firestore
      .collection("products")
      .where("name", "==", data.name)
      .get();
    const duplicateData = duplicateCheckerRef.docs.map((doc) => doc.data());
    if (duplicateData.length > 0) {
      notify.error("Product already exists.");
      reset();
    } else {
      try {
        await firestore.collection("products").add({
          name: data.name,
          price: data.price,
          options: data.options.split(",").map((item) => item.trim()),
        });
        notify.success("Product added");
        reset();
        onClose();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <Button variant="contained" color="secondary" startIcon={<AddOutlined />} onClick={onOpen}>
        New Product
      </Button>
      <Dialog onClose={onClose} open={isOpen}>
        <DialogTitle disableTypography>
          <Typography>Add new product</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.content}>
            <Controller
              as={TextField}
              name="name"
              control={control}
              label="Name"
              error={!!errors?.name}
              helperText={!!errors?.name && errors?.name?.message}
            />
            <Controller
              as={TextField}
              name="options"
              control={control}
              label="Options"
              error={!!errors?.options}
              helperText={!!errors?.options && errors?.options?.message}
            />
            <Controller
              as={TextField}
              type="number"
              name="price"
              control={control}
              label="Price"
              error={!!errors?.price}
              helperText={!!errors?.price && errors?.price?.message}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            disabled={!isDirty || isSubmitting}
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewProduct;
