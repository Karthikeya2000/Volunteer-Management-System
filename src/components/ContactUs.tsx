// @ts-nocheck
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Snackbar } from '@mui/material';
import Footer from './Footer';
import { useMutation } from '@tanstack/react-query';
import APIHandler from '../handlers/APIHandler';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function ContactUs() {
  const contactInit = {
    "email": "",
    "name": "",
    message:""
  }
  const [submitSuccess,setSubmitSuccess] = React.useState(false);
  const [showError,setShowError] = React.useState(false);
  const navigate = useNavigate();
  const [loginCreds, setLoginCreds] = useState({
    user_details: null,
    user_type: null,
    isLoggedin: false,
    isVerifying: true,
  });

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
          navigate('/contact');
        }
      }else{
        navigate('/contact');
      }
    };
    fetchData();
  }, []);
  const sendContactUs = useMutation({
    mutationFn: APIHandler.sendContactUs,
    onSuccess: () => {
      setSubmitSuccess(true);
      setContactData({
        "email": "",
        "name": "",
        message:""
      });
    },
    onError: () => {
      setShowError(true);
    },
  });

  const [contactData, setContactData] = useState<any>(contactInit);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Contact Us
          </Typography>
          <Box
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="Name"
              label="Name"
              type="Name"
              id="Name"
              value={contactData.name}
              autoComplete="name"
              onChange={(event) => {
                setContactData({
                  ...contactData,
                  name: event.target.value,
                });
              }}
            />
            <TextField
              sx={{ mt: 1 }}
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={contactData.email}
              onChange={(event) => {
                setContactData({
                  ...contactData,
                  email: event.target.value,
                });
              }}
            />
            <Container sx={{ marginTop: "2rem",marginLeft:"-1.5rem"}}>
              {/* 
      // @ts-ignore */}
              <textarea
                name="Message"
                cols={55}
                rows={10}
                placeholder="Write to us *"
                value={contactData.message}
                onChange={(event) =>
                  setContactData({ ...contactData, message: event.target.value })
                }
              ></textarea>
            </Container>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={async () => {
                await sendContactUs.mutate(contactData, JSON.parse(sessionStorage.getItem("user"))?.token);
              }}
              disabled={contactData.email == "" || contactData.name == "" || contactData.message == ""}
            >
              Submit
            </Button>
          </Box>
        </Box>
        <Snackbar
          open={submitSuccess}
          message="Submitted Successfully"
          autoHideDuration={2000}
          onClose={() => setSubmitSuccess(false)}
          disableWindowBlurListener
        />
        <Snackbar
          open={showError}
          message="Error occurred during submission"
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
