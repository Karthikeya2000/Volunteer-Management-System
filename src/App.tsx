// @ts-nocheck
import './App.css';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Signin from './templates/Signin';
import SignUp from "./templates/Signup";
import About from "./pages/About";
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import ForgetPassword from './templates/ForgetPassword';
import Error from "./pages/Error/Error";
import Home from "./pages/Home";
import ContactUs from './components/ContactUs';
import { AppBar, Box, Button, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Dashboard from './pages/Dashboard';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import APIHandler from './handlers/APIHandler';
import { useQuery } from '@tanstack/react-query';

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact', 'Login', 'Signup'];

function App(props: Props) {
  const { window } = props;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h4" sx={{ my: 2 }}>
        StuVol
      </Typography>
      <Divider />
      <List>
        {navItems.map(item => (
          <ListItem key={item} disablePadding component={RouterLink} to={"/" + (item !== "Home" ? item.toLowerCase() : "")}>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            StuVol
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {navItems.map(item => (
              <Button key={item} component={RouterLink} to={"/" + (item !== "Home" ? item.toLowerCase() : "")} sx={{ color: '#fff' }}>
                {item}
              </Button>
            ))}
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
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Container>
        <ErrorBoundary FallbackComponent={<Error />}>
          <Suspense fallback={<CircularProgress />}>
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Signin />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/error/:errorcode" element={<Error />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Container>
    </Box>
  );
}

export default App;