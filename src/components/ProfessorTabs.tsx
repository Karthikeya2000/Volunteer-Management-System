// @ts-nocheck
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BasicCards from './BasicCards';
import UpcomingTasks from './UpcomingTasks';
import BasicTables from './BasicTables';
import { DateTime } from 'luxon';

import "react-datepicker/dist/react-datepicker.css";
import CalendarComponent from './Calendar';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField } from '@mui/material';
import ReportsSubmission from '../templates/ReportsSubmission';
import ReviewTables from './ReviewTables';
import GenerateRecommendations from './GenerateRecommendations';
import ProfessorChatApp from '../pages/ProfessorChat';
import { useMutation, useQuery } from '@tanstack/react-query';
import APIHandler from '../handlers/APIHandler';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Footer from './Footer';
import Template from './Template';


function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ProfessorTabs() {
  const [value, setValue] = React.useState(0);
  const [showError,setShowError] = React.useState(false);
  const [task, setTask] = React.useState({
    professor_id: "",
    task_details: "",
    task_start_date: "",
    task_end_date: "",
    task_priority: "",
    graduate_id: "",
    summary: ""
  });
  const [submitSuccess,setSubmitSuccess] = React.useState(false);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { isLoading: graduatesLoading, data: graduatesData } = useQuery({
    queryFn: () => APIHandler.getGraduates(
      JSON.parse(sessionStorage.getItem("user"))?.user_id,
      JSON.parse(sessionStorage.getItem("user"))?.token
    ),
    queryKey: ["graduates"],
    select(data) {
      return data?.data?.users;
    },
  });

  const createTask = useMutation({
    mutationFn: APIHandler.createTask,
    onSuccess: () => {
      setTask({
        professor_id: "",
        task_details: "",
        task_start_date: "",
        task_end_date: "",
        task_priority: "",
        graduate_id: "",
        summary: ""
      });
      setSubmitSuccess(true);
    },
    onError: () => {
      setShowError(true);
    },
  });

  return (
    <Box sx={{ width: "1040px", height: "80vh" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Task Assignment" {...a11yProps(0)} />
          <Tab label="Report Review" {...a11yProps(1)} />
          <Tab label="Recommendation Letters" {...a11yProps(2)} />
          <Tab label="Chat" {...a11yProps(3)} />
          <Tab label="Weekly Declarations" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Task Assignment
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", width: "500px" }}>
          <TextField
            required
            id="task-name"
            label="Task Name"
            variant="outlined"
            value={task.task_details}
            style={{ width: "400px", marginBottom: "2rem" }}
            onChange={(event) =>
              setTask({
                ...task,
                task_details: event.target.value,
                professor_id: JSON.parse(sessionStorage.getItem("user"))
                  .user_id,
              })
            }
          />
          <FormControl style={{ width: "400px", marginBottom: "2rem" }}>
            <InputLabel id="demo-simple-select-label">Graduate *</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={task.graduate_id}
              label="Graduate"
              onChange={(event) =>
                setTask({ ...task, graduate_id: event.target.value })
              }
            >
              {graduatesData?.map((eachItem) => (
                <MenuItem value={`${eachItem.id}`}>
                  {eachItem.first_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container sx={{ display: "flex", marginLeft: "-3rem" }}>
              <Container sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <DatePicker
                  label="Task Start Date *"
                  slotProps={{
                    textField: {
                      helperText: "MM/DD/YYYY",
                    },
                  }}
                  onChange={(date) =>
                    setTask({
                      ...task,
                      task_start_date: DateTime.fromRFC2822(`${date}`).toFormat(
                        "yyyy-LL-dd"
                      ),
                    })
                  }
                  value={task.task_start_date==""?null:task.task_start_date}
                />
              </Container>
              <Container sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <DatePicker
                  label="Task End Date *"
                  slotProps={{
                    textField: {
                      helperText: "MM/DD/YYYY",
                    },
                  }}
                  onChange={(date) =>
                    setTask({
                      ...task,
                      task_end_date: DateTime.fromRFC2822(`${date}`).toFormat(
                        "yyyy-LL-dd"
                      ),
                    })
                  }
                  value={task.task_end_date==""?null:task.task_end_date}
                />
              </Container>
            </Container>
          </LocalizationProvider>
          <FormControl style={{ width: "400px", marginBottom: "2rem" }}>
            <InputLabel id="demo-simple-select-label">Priority *</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={task.task_priority}
              label="Priority"
              onChange={(event) =>
                setTask({ ...task, task_priority: event.target.value })
              }
            >
              <MenuItem value="2">High</MenuItem>
              <MenuItem value="1">Medium</MenuItem>
              <MenuItem value="3">Low</MenuItem>
            </Select>
            <FormControl style={{ width: "400px", marginTop: "2rem" }}>
              <textarea
                placeholder="summary *"
                onChange={(event) =>
                  setTask({ ...task, summary: event.target.value })
                }
                rows={5}
                value={task.summary}
              ></textarea>
            </FormControl>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, width: "400px" }}
            onClick={async () => {
              await createTask.mutate(
                task,
                JSON.parse(sessionStorage.getItem("user"))?.token
              );
            }}
            disabled={
              !task.professor_id ||
              !task.task_details ||
              !task.task_start_date ||
              !task.task_end_date ||
              !task.task_priority ||
              !task.graduate_id ||
              !task.summary
            }
          >
            Submit
          </Button>
        </Box>
      </CustomTabPanel>
      <Snackbar
        open={submitSuccess}
        message="Task Assigned Successfully"
        autoHideDuration={2000}
        onClose={() => setSubmitSuccess(false)}
        disableWindowBlurListener
      />
      <Snackbar
        open={showError}
        message="Error occurred during task creation"
        autoHideDuration={2000}
        onClose={() => setShowError(false)}
        disableWindowBlurListener
      />
      <CustomTabPanel value={value} index={1}>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Task Review Tables
          </Typography>
          <ReviewTables />
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Generate Recommendation Letters *
        </Typography>
        <GenerateRecommendations />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Chat
        </Typography>
        <ProfessorChatApp />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Template/>
      </CustomTabPanel>
      <Box sx={{ marginTop: "1rem" }}>
        <Footer />
      </Box>
    </Box>
  );
}