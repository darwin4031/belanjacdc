import { useSnackbar } from "notistack";

const useNotify = () => {
  const { enqueueSnackbar } = useSnackbar();

  return {
    success: (message, options = {}) =>
      enqueueSnackbar(message, {
        variant: "success",
        ...options,
      }),
    error: (message, options = {}) =>
      enqueueSnackbar(message, {
        variant: "error",
        ...options,
      }),
  };
};

export default useNotify;
