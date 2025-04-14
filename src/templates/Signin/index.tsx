// @ts-nocheck
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Home from '../../pages/Dashboard';
import { ISigninData } from '../../interfaces/ISigninData';
import Dashboard from '../../pages/Dashboard';
import { useMutation } from '@tanstack/react-query';
import APIHandler from '../../handlers/APIHandler';
import { Snackbar } from '@mui/material';
import Footer from '../../components/Footer';
function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">
        UTA Graduate Volunteer Program Portal
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
      <Link color="inherit">
        All Rights Reserved.
      </Link>{' '}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const signinInit = {
    "email": "",
    "password": ""
  }
  const navigate = useNavigate();

  const [signinData, setSigninData] = useState<ISigninData>(signinInit);
  const [signinSuccess,setSigninSuccess] = useState(false);
  const [showError,setShowError] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState('');
  
  const signin = (postData, token) => {  
    fetch('https://gxp8728.uta.cloud/volunteer_api/public/api/user_login', {
      method: 'POST', // Specify the HTTP method
      headers: {
        'Authorization': `Bearer ${token || JSON.parse(sessionStorage.getItem("user"))?.token}`,
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if(data.success){
        setSigninData(() => structuredClone(signinInit));
        setSigninSuccess(true);
        let userString = JSON.stringify(data?.data);
        sessionStorage.setItem('user', userString);
        navigate("/dashboard");
      }else{
        setShowError(true);
        setShowErrorMessage(
          data?.message === "Unauthorised."
            ? "Invaid Credentials"
            : "Email not verified. Please verify your email before logging in."
        );
      }
    })
    .catch(error => {
      setShowErrorMessage('Invaid Credentials')
      setShowError(true);
    });
  }
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            sx={{
              height: 150,
              width: 200,
              marginTop: "2rem",
            }}
            alt="WDM logo"
            src="/WDM.png"
            alignItems="center"
            justifyContent="center"
          />
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(event) => {
                setSigninData({
                  ...signinData,
                  email: event.target.value,
                });
              }}
              value={signinData.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(event) => {
                setSigninData({
                  ...signinData,
                  password: event.target.value,
                });
              }}
              value={signinData.password}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {/* 
      // @ts-ignore */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() =>
                signin(signinData, JSON.parse(sessionStorage.getItem("user"))?.token)
              }
              disabled={
                signinData.email == "" ||
                signinData.password == "" ||
                !(
                  signinData.email.includes("@gmail.com") ||
                  signinData.email.includes("@mavs.uta.edu") ||
                  signinData.email.includes("@uta.com")
                )
              }
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <RouterLink to="/signup">
                  {"Don't have an account? Sign Up"}
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Snackbar
          open={showError}
          message={
            showErrorMessage
          }
          autoHideDuration={2000}
          onClose={() => setShowError(false)}
          disableWindowBlurListener
        />
      </Container>
      <Box sx={{ marginTop: "1rem" }}>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};
