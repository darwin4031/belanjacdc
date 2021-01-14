import { Container, makeStyles } from "@material-ui/core";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ProgressToggle } from "~core/components/Progress";
import BottomBar from "./BottomBar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    minHeight: "100vh",
    gridTemplateRows: "1fr auto",
  },
  container: {
    paddingTop: theme.spacing(1),
    [theme.breakpoints.up("md")]: { padding: theme.spacing(2) },
  },
}));

const Layout = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container maxWidth="md" className={classes.container}>
        <Suspense fallback={<ProgressToggle />}>
          <Outlet />
        </Suspense>
      </Container>
      <BottomBar />
    </div>
  );
};

export default Layout;
