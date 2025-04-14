import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BasicCards from './BasicCards';
import UpcomingTasks from './UpcomingTasks';
import BasicTables from './BasicTables';
import "react-datepicker/dist/react-datepicker.css";
import CalendarComponent from './Calendar';
import { Button, Container } from '@mui/material';
import ReportsSubmission from '../templates/ReportsSubmission';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Footer from './Footer';
import  ChatApp from '../pages/ChatApp';
import APIHandler from '../handlers/APIHandler';
import { useQueries, useQuery, QueryClient} from '@tanstack/react-query';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RecommendationLetter from './RecommendationLetter';
import Template from './Template';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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

export default function BasicTabs() {

  const queryClient = new QueryClient();
  const [value, setValue] = React.useState(0);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [filterString, setFilterString] = React.useState("");

  //@ts-ignore
  const { data: tasksByGraduateDone } = useQuery({
    queryKey: ["tasksByGraduateDone", ""],
    queryFn: () => APIHandler.getTasksByGraduate(
      "",
      JSON.parse(sessionStorage.getItem("user"))?.token
    ),
  });
  const { data: hoursLogged } = useQuery({
    queryKey: ["hoursLogged"],
    queryFn: () => APIHandler.getHoursLogged(),
  });
  const { data: tasksByGraduateById } = useQuery({
    queryKey: ["tasksByGraduateById", filterString],
    queryFn: () =>
      APIHandler.getTasksByGraduate(
        filterString,
        JSON.parse(sessionStorage.getItem("user"))?.token
      ),
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  
  const [completedCount, setCompletedCount] = React.useState(0);

React.useEffect(() => {
  let count = 0;
  tasksByGraduateDone?.data?.tasks_list?.forEach(task => {
    if (task?.completed === 1) {
      count += 1;
    }
  });
  setCompletedCount(count);
}, [tasksByGraduateDone]);


React.useEffect(() => {
  setFilterString(`start_date=${startDate ? (new Date(startDate)).toISOString().slice(0, -5) + "Z" : ""}&end_date=${endDate ? (new Date(endDate)).toISOString().slice(0, -5) + "Z" : ""}`);
}, [startDate, endDate]);



  return (
    <Box sx={{ width: "1040px", height: "80vh" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Progress Tracking" {...a11yProps(0)} />
          <Tab label="Calendar" {...a11yProps(1)} />
          <Tab label="Weekly Reports" {...a11yProps(2)} />
          <Tab label="Chat" {...a11yProps(3)}/>
          <Tab label="Weekly Declarations" {...a11yProps(3)}/>
          <Tab label="Recommendation Letter" {...a11yProps(4)}/>
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box sx={{ display: 'flex', alignItems:'center', justifyContent:'space-between' }}>
          <BasicCards metric={"Tasks Completed"} number={completedCount} />
          <BasicCards metric={"Total Hours Worked"} number={hoursLogged?.data?.hours} />
          <UpcomingTasks
          />
        </Box>
        <Box sx={{display: 'flex',alignItems:'center', marginTop: '4rem'}}>
          <Box sx={{ display: 'flex', alignItems:'center'}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container sx={{ display: "flex", marginLeft: "-3rem" }}>
              <Container sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <DatePicker
                  label="Task Start Date"
                  slotProps={{
                    textField: {
                      helperText: "MM/DD/YYYY",
                    },
                  }}
                  onChange={(date: string) => {
                    if (!isNaN((new Date(date)).getTime())) {
                      setStartDate(date)
                    }
                  }}
                  value={startDate}
                />
              </Container>
              <Container sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <DatePicker
                  label="Task End Date"
                  slotProps={{
                    textField: {
                      helperText: "MM/DD/YYYY",
                    },
                  }}
                  onChange={(date: string) => {
                    if (!isNaN((new Date(date)).getTime())) {
                      setEndDate(date)
                    }
                  }}
                  value={endDate}
                />
              </Container>
            </Container>
          </LocalizationProvider>
          </Box>
        </Box>
        <Box sx={{marginTop: '4rem'}}>
          <BasicTables tableData={tasksByGraduateById?.data?.tasks_list || []}/>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CalendarComponent/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ReportsSubmission/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ChatApp/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Template/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <RecommendationLetter/>
      </CustomTabPanel>
      <Footer/>
    </Box>
  );
}