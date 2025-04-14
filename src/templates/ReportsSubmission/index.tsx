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
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Home from '../../pages/Dashboard';
import { ISigninData } from '../../interfaces/ISigninData';
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';
import { TextareaAutosize } from '@mui/base';
import pdfToText from 'react-pdftotext'
import APIHandler from '../../handlers/APIHandler';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import ReCAPTCHA from 'react-google-recaptcha';
// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function ReportsSubmission() {
  const [task, setTask] = React.useState({ id: "", name: "" });
  const [spinner, setSpinner] = useState(false);
  const [showError,setShowError] = useState(false);

  const { data: tasksByGraduateById } = useQuery({
    queryKey: ["tasksByGraduateById"],
    queryFn: () =>
      APIHandler.getTasksByGraduate(
        "",
        JSON.parse(sessionStorage.getItem("user"))?.token
      ),
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedTask, setSelectedTask] = useState();
  const [selectedStatus, setSelectedStatus] = useState();
  const [fileData, setFileData] = useState();
  const [fileDataResponse, setFileDataResponse] = useState(null);
  const [hours, setHours] = useState();
  const [comments, setComments] = useState();
  const [captchaVerified,setCaptchaVerified] = useState(false);
  const reRef = useRef<ReCAPTCHA>();

  useEffect(() => {
    // console.log(fileData)
  }, [fileData])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };

  const resetCaptcha = () => {
    setCaptchaVerified(false);
    setSpinner(false);
    if (reRef.current) {
      reRef.current.props.grecaptcha.reset();
    }
  };

  const { data: hoursLogged } = useQuery({
    queryKey: ["hoursLogged", selectedTask],
    queryFn: () =>
      APIHandler.getTaskStatus(
        selectedTask,
        JSON.parse(sessionStorage.getItem("user"))?.token
      ),
    enabled: !!selectedTask,
  });


  const handleFileChange = async (event) => {
    setFileDataResponse(null);
    try {
      const file = event.target.files[0];
      if (!file) return;

      setSpinner(true);

      const reader = new FileReader();
      reader.onload = async () => {
        const result:any = reader.result;
        setFileData(result);

        const text = await pdfToText(file);
        const keys = [
          "b807f5a53bmsh329044cc34c4cc7p1e50f7jsn7f465a597eb6",
          "8712debf83msha7179ab30101309p1c5fcdjsn712beea3a7a7",
          "cdc735d998msha73907a40416652p1b9f49jsn4c8b904beed0",
          "8ddc6636afmshacde5256014df67p1be825jsnd16888966fe5"
        ];
        const randomIndex = Math.floor(Math.random() * keys.length);

        const response = await axios.post('https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText/', {
          text: text
        }, {
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': `${keys[randomIndex]}`,
            'X-RapidAPI-Host': 'ai-content-detector-ai-gpt.p.rapidapi.com'
          }
        });

        setFileDataResponse(response.data);
        setSpinner(false);
        // from this response data, take the fakePercentage and status, and send them both to the backend.
      };
      reader.onerror = (error) => {
        console.error("Failed to read file:", error);
        setShowError(true);
        setSpinner(false); // Ensure spinner is hidden on error
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to process file:", error);
      setSpinner(false); // Ensure spinner is hidden on error
      setShowError(true);
    }
  };
  const createTask = useMutation({
    mutationFn: APIHandler.updateTask,
    onSuccess: () => {
              {/* 
        // @ts-ignore */}
      setSelectedStatus("");
              {/* 
        // @ts-ignore */}
      setFileData("")
              {/* 
        // @ts-ignore */}
      setSelectedTask("")
              {/* 
        // @ts-ignore */}
      setComments(" ")
              {/* 
        // @ts-ignore */}
      setHours("");
      resetCaptcha();
    },
    onError: () => {
      resetCaptcha();
    },
  });
  const resetTask = async () => {
    await createTask.mutate(
      {
        task_id: selectedTask,
        task_updated_date: new Date(),
        task_status: selectedStatus,
        comments: comments,
        hours_logged: hours,
        file: fileData,
      },
      JSON.parse(sessionStorage.getItem("user"))?.token
    );

    setTask({ name: "", id: "" });
    // Reset file input
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the value of the file input
    }
  };



  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography component="h1" variant="h5">
            Reports Submission:
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Task *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedTask || null}
                label="Task"
                onChange={(event) => setSelectedTask(event.target.value)}
              >
                {tasksByGraduateById?.data?.tasks_list?.map((task) => (
                  <MenuItem key={task.task_id} value={task.task_id}>
                    {task.task_details}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginTop: "24px" }}>
              <InputLabel id="status-label">Status *</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                label="Status"
                onChange={(event: any) => setSelectedStatus(event.target.value)}
                disabled={!hoursLogged}
              >
                <MenuItem
                  value={1}
                  disabled={hoursLogged?.data?.task_status > 1}
                >
                  Open
                </MenuItem>
                <MenuItem value={2}>In Progress</MenuItem>
                <MenuItem value={3}>Done</MenuItem>
              </Select>
            </FormControl>
            <TextField
              required
              id="outlined-basic"
              fullWidth
              sx={{ marginTop: "24px" }}
              label="Log Hours"
              variant="outlined"
              value={hours}
              onChange={(event: any) => {
                const re = /^[0-9\b]+$/;
                if (event.target.value === "" || re.test(event.target.value)) {
                  setHours(event.target.value);
                }
              }}
            />

            <Container sx={{ marginTop: "2rem", marginLeft: "-1.5rem" }}>
              {/* 
            // @ts-ignore */}
              <textarea
                name="Text1"
                cols={50}
                rows={5}
                value={comments || null}
                placeholder="Comments *"
                onChange={(event: any) => {
                  setComments(event.target.value);
                }}
              ></textarea>
            </Container>
            <Container sx={{ marginTop: "2rem", marginLeft: "-1.5rem" }}>
              <ReCAPTCHA
                sitekey={"6LeZwa8pAAAAAFZY60-4XJkAEpdQsDLNtOnF-58X"}
                ref={reRef}
                onChange={() => setCaptchaVerified(true)}
              />
            </Container>
            {selectedStatus == 3 && (
              <Container sx={{ marginTop: "2rem" , marginLeft:"-2rem"}}>
                <p style={{display:'inline-block', marginRight:"0.5rem"}}>*</p>
                <input
                  required
                  title='file'
                  id="fileInput"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                {fileDataResponse && (
                  <Typography>
                    {fileDataResponse?.fakePercentage >= 50
                      ? `Please, Submit another Report, it seems like more than ${fileDataResponse?.fakePercentage}% content is AI generated`
                      : "Pleace Click on Submit to submit your Assignment"}
                  </Typography>
                )}
              </Container>
            )}
            {spinner && <p>File is being processed....</p>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={async () => {
                resetTask();
                setSubmitSuccess(true);
              }}
              disabled={
                !selectedTask ||
                !selectedStatus ||
                !hours ||
                !comments ||
                !captchaVerified ||
                (fileDataResponse && fileDataResponse?.fakePercentage >= 50) ||
                (selectedStatus == 3 && !fileDataResponse)
              }
            >
              Submit
            </Button>
            <Snackbar
              open={submitSuccess}
              message="Report is being submitted, In a While please stay on the same page"
              autoHideDuration={3000}
              onClose={() => setSubmitSuccess(false)}
              disableWindowBlurListener
            />
            <Snackbar
              open={showError}
              message="failed to upload the file, please try again!"
              autoHideDuration={2000}
              onClose={() => setShowError(false)}
              disableWindowBlurListener
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
