import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import {
  ExitToAppOutlined as LogoutIcon,
  HomeOutlined as HomeIcon,
  ListOutlined as ListIcon,
  PaymentOutlined as PaymentIcon,
  PersonOutline as PersonIcon,
} from "@material-ui/icons";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "~config/auth";
import { auth, googleAuthProvider } from "~config/firebase";

const BottomBar = () => {
  const { currentUser } = useContext(AuthContext);

  const login = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <BottomNavigation showLabels>
      <BottomNavigationAction component={Link} to="/" label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction
        component={Link}
        to="/orders"
        label="Belanjaan"
        icon={<ListIcon />}
      />
      <BottomNavigationAction
        component={Link}
        to="/payments"
        label="Pembayaran"
        icon={<PaymentIcon />}
      />
      <BottomNavigationAction
        label={currentUser ? "Logout" : "Login"}
        icon={currentUser ? <LogoutIcon /> : <PersonIcon />}
        onClick={() => {
          currentUser ? logout() : login();
        }}
      />
    </BottomNavigation>
  );
};

export default BottomBar;
