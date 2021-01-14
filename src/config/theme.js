import { createMuiTheme } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";

const colors = {
  primary: "#07689f",
  font: {
    button: "#FFFFFF",
    default: "#3D3D3D",
    gray: "#616161",
    textButton: "#06847B",
    textDisabled: "#616161",
  },
  paperBorder: "#EAEAEA",
};

const theme = createMuiTheme({
  /**
   * @see https://material-ui.com/customization/themes/#theme-configuration-variables
   */
  palette: {
    background: {
      default: "#EEF0F8",
    },
    primary: {
      main: "#07689f",
    },
  },
  typography: {
    fontFamily: ["Poppins", "Helvetica", "sans-serif"].join(","),
  },
  overrides: {
    MuiInput: {
      input: {
        "&::placeholder": {
          opacity: "1 !important",
        },
      },
    },
    MuiInputBase: {
      input: {
        "&::placeholder": {
          color: colors.font.gray,
          opacity: "1 !important",
        },
        zIndex: 2,
      },
    },
    MuiInputLabel: {
      filled: {
        zIndex: 2,
      },
      formControl: {
        transform: "translate(0, 1.5px) scale(0.75)",
        transformOrigin: "top left",
        width: "100%",
      },
      outlined: {
        "&$shrink": {
          transform: "translate(12px, 9px) scale(0.75)",
        },
        transform: "translate(14px, 18px) scale(1)",
        zIndex: 9,
      },
    },
    MuiInputAdornment: {
      positionStart: {
        marginTop: 11,
      },
    },
    MuiAutocomplete: {
      inputRoot: {
        padding: "0 30px 0 0 !important",
      },
    },
    MuiOutlinedInput: {
      input: {
        "&:-webkit-autofill": {
          borderRadius: 4,
          boxShadow: `0 0 0px 1000px rgba(19, 190, 187, 0.1) inset`,
          zIndex: 0,
        },
        "&::placeholder": {
          opacity: [[0], "!important"],
        },
        padding: "23px 12px 10px 12px !important",
      },
      inputMultiline: {
        left: -2,
        padding: "10px 0",
        position: "relative",
      },
      root: {
        "& fieldset": {
          top: 0,
          zIndex: 1,
        },
        "& legend": {
          display: "none",
        },
        "&$disabled": {
          "& input": {
            zIndex: 2,
          },
        },
        "&$error": {
          "&$focused": {
            "& input": {
              zIndex: 2,
            },
          },
          "&:hover": {
            "& input": {
              zIndex: 2,
            },
          },
        },
        "&$focused": {
          "& input": {
            "&::placeholder": {
              opacity: [[1], "!important"],
            },
          },
        },
        top: 0,
      },
    },
    MuiCard: {
      root: {
        borderColor: colors.paperBorder,
        borderRadius: 8,
        borderStyle: "solid",
        borderWidth: 1,
        overflow: "visible",
      },
    },
    MuiCardActions: {
      root: {
        flexDirection: "row-reverse",
      },
    },
    MuiCardContent: {
      root: {
        padding: "24px",
      },
    },
    MuiTable: {
      root: {
        fontFeatureSettings: '"tnum"',
      },
    },
    MuiTableCell: {
      // body: {
      //   fontSize: "1rem",
      //   // paddingBottom: 8,
      //   // paddingTop: 8,
      // },
      head: {
        fontSize: "1rem",
        height: 56,
        "&.MuiTableCell-sizeSmall": {
          height: 48,
        },
      },
      paddingCheckbox: {
        "&:first-child": {
          padding: "0 12px",
          width: 72,
        },
        "&:not(first-child)": {
          padding: 0,
          width: 52,
        },
      },
      root: {
        "&:first-child": {
          "&:not($paddingCheckbox)": {
            paddingLeft: 24 + "px",
            textAlign: "left",
          },
        },
        borderBottomColor: colors.paperBorder,
        // padding: "4px 24px",
      },
    },
    MuiTableRow: {
      footer: {
        "$root$hover&:hover": {
          background: "none",
        },
      },
      head: {
        "$root$hover&:hover": {
          background: "none",
        },
      },
      hover: {
        "$root&:hover": {
          cursor: "pointer",
          backgroundColor: fade(colors.primary, 0.3),
        },
      },
      root: {
        "&$selected": {
          backgroundColor: fade(colors.primary, 0.05),
        },
        "&$selected:hover": {
          backgroundColor: fade(colors.primary, 0.05),
        },
      },
    },
    typography: {
      h5: {
        fontSize: "1.3125rem",
      },
    },
  },
  props: {
    MuiTypography: {
      component: "div",
    },
    MuiCard: {
      elevation: 0,
    },
    MuiTextField: {
      variant: "outlined",
      fullWidth: true,
    },
  },
});
export default theme;
