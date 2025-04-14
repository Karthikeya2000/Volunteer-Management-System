// @ts-nocheck
import * as React from 'react';
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
import { InputLabel, MenuItem, Select, Snackbar } from '@mui/material';
import { ISignupData } from '../../interfaces/ISignupData';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import APIHandler from '../../handlers/APIHandler';
import Footer from '../../components/Footer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">
        StuVol - Volunteer Program Portal
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
      <Link color="inherit">
        All Rights Reserved.
      </Link>{' '}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const signupInit = {
    "first_name": "",
    "last_name": "",
    "email": "",
    "contact_details": "",
    "graduation_date": null,
    "password": "",
    "c_password": "",
    "user_type": "",
    "dept": "",
  };

  const [showErrorMessage, setShowErrorMessage] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setSignupData({ ...signupData, dept: e.target.value })
  }
  const [signupData, setSignupData] = useState<ISignupData>(signupInit);

  const signup = (postData, token) => {  
    fetch('https://gxp8728.uta.cloud/volunteer_api/public/api/user_register', {
      method: 'POST', // Specify the HTTP method
      headers: {
        'Authorization': `Bearer ${token || JSON.parse(sessionStorage.getItem("user"))?.token}`,
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData) // Convert data to JSON string
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if(data.success){
        setSignupData(() => structuredClone(signupInit));
        setSignupSuccess(true);
      }else{
        let message = ''
        if(data?.data?.c_password){
          message+=data?.data?.c_password[0]
        }
        if(data?.data?.email){
          message+=data?.data?.email[0]
        }
        if(data?.data?.password){
          message+=data?.data?.password[0]
        }
        setShowError(true);
        setErrorMessage(message);
      }
    })
    .catch(error => {
      setShowErrorMessage('Invaid Credentials')
      setShowError(true);
    });
  };  

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            User Registration
          </Typography>
          <Box component="article" sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="first_name"
                  name="first_name"
                  required
                  fullWidth
                  id="first_name"
                  label="First Name"
                  autoFocus
                  onChange={(event) =>
                    setSignupData({
                      ...signupData,
                      first_name: event.target.value,
                    })
                  }
                  value={signupData.first_name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                  onChange={(event) =>
                    setSignupData({
                      ...signupData,
                      last_name: event.target.value,
                    })
                  }
                  value={signupData.last_name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    User Type *
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={signupData.user_type}
                  >
                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label="Professor"
                      onChange={(event: any) =>
                        setSignupData({
                          ...signupData,
                          user_type: event.target.value,
                        })
                      }
                    />
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Graduate"
                      onChange={(event: any) =>
                        setSignupData({
                          ...signupData,
                          user_type: event.target.value,
                        })
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  value={signupData.email}
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(event) => {
                    setSignupData({ ...signupData, email: event.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  value={signupData.contact_details}
                  label="Phone Number"
                  name="phone"
                  inputProps={{maxLength: 10}}
                  autoComplete="phone"
                  onChange={(event) =>
                    setSignupData({
                      ...signupData,
                      contact_details: event.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  {signupData.user_type == "1" && (
                    <DatePicker
                      required
                      label="Graduation Date"
                      value={signupData.graduation_date}
                      name="graduation_date"
                      onChange={(newValue) => {
                        const date = new Date(newValue);

                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        ); // Months are zero-based
                        const day = String(date.getDate()).padStart(2, "0");

                        const formattedDate = `${year}-${month}-${day}`;
                        setSignupData({
                          ...signupData,
                          graduation_date: formattedDate,
                        });
                      }}
                    />
                  )}
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  value={signupData.password}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(event) =>
                    setSignupData({
                      ...signupData,
                      password: event.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="c_password"
                  value={signupData.c_password}
                  label="Confirm Password"
                  type="password"
                  id="c_password"
                  autoComplete="new-password"
                  onChange={(event) =>
                    setSignupData({
                      ...signupData,
                      c_password: event.target.value,
                    })
                  }
                />
              </Grid>
              <FormControl
                style={{ marginTop: "2rem", marginLeft: "1rem" }}
                fullWidth
              >
                <InputLabel id="demo-simple-select-label">
                  Department *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={signupData.dept}
                  label="Department"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value={"Computer Science"}>
                    Computer Science
                  </MenuItem>
                  <MenuItem value={"Business Analytics"}>
                    Business Analytics
                  </MenuItem>
                  <MenuItem value={"Management Information Systems"}>
                    Management Information Systems
                  </MenuItem>
                  <MenuItem value={"Construction Management"}>
                    Construction Management
                  </MenuItem>
                  <MenuItem value={"Data Science"}>Data Science</MenuItem>
                  <MenuItem value={"Applied Science and Data Science"}>
                    Applied Science and Data Science
                  </MenuItem>
                  <MenuItem value={"Data Engineering"}>
                    Data Engineering
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() =>
                signup(signupData, JSON.parse(sessionStorage.getItem("user"))?.token)
              }
              disabled={
                signupData.first_name == "" ||
                signupData.last_name == "" ||
                signupData.email == "" ||
                signupData.password == "" ||
                signupData.c_password == "" ||
                signupData.dept == "" ||
                signupData.user_type == "" ||
                signupData.contact_details == "" ||
                (signupData.user_type == "1" &&
                  signupData.graduation_date == null) ||
                !(signupData.email.includes('@gmail.com') || 
                signupData.email.includes('@mavs.uta.edu') || 
                signupData.email.includes('@uta.com'))
              }
            >
              Sign Up
            </Button>
            <Snackbar
              open={signupSuccess}
              message="Signup Successful, Please verify your email."
              autoHideDuration={2000}
              onClose={() => setSignupSuccess(false)}
              disableWindowBlurListener
            />
            <Snackbar
              open={showError}
              message={errorMessage}
              autoHideDuration={4000}
              onClose={() => setShowError(false)}
              disableWindowBlurListener
            />
            <Grid container justifyContent="flex-end">
              <RouterLink to="/login">
                Already have an account? Sign in
              </RouterLink>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Box sx={{ marginTop: "1rem" }}>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}