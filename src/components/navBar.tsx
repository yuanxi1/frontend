import { useNavigate, useLocation } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SettingsIcon from "@mui/icons-material/Settings";
import { alpha } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

interface NavBarPropType {
  handleLogout: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  backgroundColor: alpha(theme.palette.info.main, 0.9),
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));
const drawerWidth = 210;

export const NavBar: React.FC<NavBarPropType> = ({
  open,
  setOpen,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const current_path = useLocation().pathname;
  const showloggedInView =
  !(current_path === "/" || current_path === "/login" || current_path === "/register");
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            elevation={2}
            open={open}
          >
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}
              >
                SimplyDONE
              </Typography>
              {showloggedInView && <Stack direction={'row'} spacing={1}>
              <Button variant="contained" onClick={() => navigate("/add_task")}>
                Add a new task
              </Button>

              <Button variant="outlined" color='error' onClick={handleLogout}>
                Log Out
              </Button>

              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={() => navigate("/profile")}
              >
                <AccountCircle />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
              </Stack>}
            </Toolbar>
          </AppBar>
          {showloggedInView && <Drawer
            sx={{
              width: drawerWidth, 
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth, 
                boxSizing: "border-box",
                border: 0,
              },
            }}
            anchor="right"
            open={open}
            onClose={handleDrawerClose}
          >
            <IconButton onClick={handleDrawerClose}>
              <ChevronRightIcon />
            </IconButton>

            <List>
              <ListItem
                button
                key={"home"}
                onClick={() => {
                  handleDrawerClose();
                  navigate("/home");
                }}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={"Home"} />
              </ListItem>
              <ListItem
                button
                key={"calendar"}
                onClick={() => {
                  handleDrawerClose();
                  navigate("/calendar");
                }}
              >
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText primary={"Calendar"} />
              </ListItem>

              <Divider />

              <ListItem
                button
                key={"tag"}
                onClick={() => {
                  handleDrawerClose();
                  navigate("/tags");
                }}
              >
                <ListItemIcon>
                  <LocalOfferIcon />
                </ListItemIcon>
                <ListItemText primary={"Manage Tags"} />
              </ListItem>

              <ListItem
                button
                key={"settings"}
                onClick={() => {
                  handleDrawerClose();
                  navigate("/settings");
                }}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={"Settings"} />
              </ListItem>
            </List>
          </Drawer>}
        </Box>
    </>
  );
};
