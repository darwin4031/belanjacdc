import { lazy, Suspense } from "react";
import { Navigate, Route, Routes as ReactRoutes } from "react-router-dom";
import { ProgressToggle } from "./components/Progress";

const Layout = lazy(() => import("~components/layout"));

const Home = lazy(() => import("~app/home"));
const Order = lazy(() => import("~app/order"));
const Payment = lazy(() => import("~app/payment"));

const Routes = () => {
  return (
    <Suspense fallback={<ProgressToggle />}>
      <ReactRoutes>
        <Route path="/*" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/payments" element={<Payment />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Route>
      </ReactRoutes>
    </Suspense>
  );
};

export default Routes;
