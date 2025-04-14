import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import BasicTabs from '../../components/BasicTabs';
import ProfessorTabs from '../../components/ProfessorTabs';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ContactUs from '../../components/ContactUs';
import Footer from '../../components/Footer';
import { useEffect, useState } from 'react';
import { Avatar, CircularProgress, Popover } from '@mui/material';
import APIHandler from '../../handlers/APIHandler';

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];

export default function Dashboard(props: Props) {
  const { window} = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const [loginCreds, setLoginCreds] = useState({
    user_details: null,
    user_type: null,
    isLoggedin: false,
    isVerifying: true,
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        StuVol
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding component={RouterLink} to="/">
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary="Home" />
            </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={RouterLink} to="/about">
          <ListItemButton sx={{ textAlign: 'center' }}>
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={RouterLink} to="/contact">
          <ListItemButton sx={{ textAlign: 'center' }}>
            <ListItemText primary="Contact" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }}>
            <ListItemText primary={`Loggedin as: ${JSON.parse(sessionStorage.getItem("user"))?.first_name}`} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  useEffect(() => {
    const fetchData = async () => {
      if(JSON.parse(sessionStorage.getItem("user"))){
        try {
          const userDetails = await APIHandler.getUserDetails(
            JSON.parse(sessionStorage.getItem("user"))?.user_id,
            JSON.parse(sessionStorage.getItem("user"))?.token
          );
          setLoginCreds({
            user_details: userDetails?.data?.user_details,
            user_type: userDetails?.data?.user_details?.user_type,
            isLoggedin: true,
            isVerifying: false,
          });
          navigate('/dashboard');
        } catch (error) {
          navigate('/login');
        }
      }else{
        navigate('/login');
      }
    };
    fetchData();
  }, []);
  const container = window !== undefined ? () => window().document.body : undefined;

  if(loginCreds?.isVerifying){
    return (
      <Box sx={{marginTop:"6rem", display:"flex", alignItems:"center", justifyContent:"center"}}>
        <CircularProgress />
      </Box>
    );
  };


  return loginCreds.user_details && loginCreds && loginCreds?.user_type === "1" ? (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            StuVol
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {navItems.map((item) => (
              <ListItem
                disablePadding
                component={RouterLink}
                to={"/" + (item !== "Home" ? item.toLowerCase() : "")}
              >
                <Button key={item} sx={{ color: "#fff" }}>
                  {item}
                </Button>
              </ListItem>
            ))}
            {JSON.parse(sessionStorage.getItem("user"))?.first_name && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ListItem disablePadding>
                  <Typography sx={{ color: "#fff" }}>
                    {`${JSON.parse(
                      sessionStorage.getItem("user")
                    )?.first_name?.toUpperCase()?.substring(0,15)}`
                    || `${JSON.parse(
                      sessionStorage.getItem("user")
                    )?.last_name?.toUpperCase()?.substring(0,15)}`
                    }
                  </Typography>
                </ListItem>
                <div
                  aria-describedby={id}
                  // variant="contained"
                  onClick={handleClick}
                >
                  <Avatar>{`${JSON.parse(
                    sessionStorage.getItem("user")
                  )?.first_name?.charAt(0)?.toUpperCase()}`}</Avatar>
                </div>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Typography
                    sx={{ p: 2, cursor: "pointer" }}
                    onClick={() => {
                      sessionStorage.removeItem("user");
                      navigate("/")
                    }}
                  >
                    Logout
                  </Typography>
                </Popover>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <BasicTabs />
      </Box>
    </Box>
  ) : (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            StuVol
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {navItems.map((item) => (
              <ListItem
                disablePadding
                component={RouterLink}
                to={"/" + (item !== "Home" ? item.toLowerCase() : "")}
              >
                <Button key={item} sx={{ color: "#fff" }}>
                  {item}
                </Button>
              </ListItem>
            ))}
            {JSON.parse(sessionStorage.getItem("user"))?.first_name && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ListItem disablePadding>
                  <Typography sx={{ color: "#fff" }}>
                    {`${JSON.parse(
                      sessionStorage.getItem("user")
                    )?.first_name?.toUpperCase()?.substring(0,15)}`
                    || `${JSON.parse(
                      sessionStorage.getItem("user")
                    )?.last_name?.toUpperCase()?.substring(0,15)}`
                    }
                  </Typography>
                </ListItem>
                <div
                  aria-describedby={id}
                  // variant="contained"
                  onClick={handleClick}
                >
                  <Avatar>{`${JSON.parse(
                    sessionStorage.getItem("user")
                  )?.first_name?.charAt(0)?.toUpperCase()}`}</Avatar>
                </div>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Typography
                    sx={{ p: 2, cursor: "pointer" }}
                    onClick={() => {
                      sessionStorage.removeItem("user");
                      navigate("/")
                    }}
                  >
                    Logout
                  </Typography>
                </Popover>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <ProfessorTabs />
      </Box>
    </Box>
  );
}