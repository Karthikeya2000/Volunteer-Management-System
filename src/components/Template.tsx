import { Box, Button, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import APIHandler from '../handlers/APIHandler';
import { useQuery } from '@tanstack/react-query';
import { PDFExport } from '@progress/kendo-react-pdf';

function Template({ }) {
    function createData(
        name: string,
        content: string,
    ) {
        return { name, content };
    }
    const rows = [
        createData('Frozen yoghurt', ''),
        createData('Ice cream sandwich', ''),
        createData('Eclair', ''),
        createData('Cupcake', ''),
        createData('Gingerbread', ''),
    ];




    const [selectedTask, setSelectedTask] = useState();

    const [doneTaskDetails, setDoneTasksCompleted] = useState();

    const { data: tasksByGraduateById } = useQuery({
      queryKey: ["tasksByGraduateById"],
      queryFn: () =>
        APIHandler.getTasksByGraduate(
          "",
          JSON.parse(sessionStorage.getItem("user"))?.token
        ),
      enabled: JSON.parse(sessionStorage.getItem("user")).user_type == 1,
    });

    const { data: tasksByProfessorById } = useQuery({
      queryKey: ["tasksByProfessorById"],
      queryFn: () =>
        APIHandler.getTaskList(
          JSON.parse(sessionStorage.getItem("user"))?.user_id,
          JSON.parse(sessionStorage.getItem("user"))?.token
        ),
      enabled: JSON.parse(sessionStorage.getItem("user")).user_type == 2,
    });



    const { data: taskDetails } = useQuery({
      queryKey: ["taskDetails", selectedTask],
      queryFn: () =>
        APIHandler.getTaskDetails(
          selectedTask,
          JSON.parse(sessionStorage.getItem("user"))?.token
        ),
      enabled: !!selectedTask,
    });

    const { data: taskLogs } = useQuery({
      queryKey: ["taskLogs", selectedTask],
      queryFn: () =>
        APIHandler.getTaskLogs(
          selectedTask,
          JSON.parse(sessionStorage.getItem("user"))?.token
        ),
      enabled: !!selectedTask,
    });

    const { isLoading: userDetailsLoading, data: userDetails } = useQuery({
        queryFn: () => APIHandler.getUserDetails(
            taskDetails?.data?.task_details?.graduate_id,
            JSON.parse(sessionStorage.getItem("user"))?.token
        ),
        queryKey: ["userDetails", taskDetails],
        enabled: !!taskDetails,
        select(data) {
            return data?.data?.user_details;
        },
    });

    const { data: professorDetails } = useQuery({
        queryFn: () => APIHandler.getUserDetails(
            taskDetails?.data?.task_details?.professor_id,
            JSON.parse(sessionStorage.getItem("user"))?.token
        ),
        queryKey: ["professorDetails", taskDetails],
        enabled: !!taskDetails,
        select(data) {
            return data?.data?.user_details;
        }
    });

    const [hoursLogged, setHoursLogged] = useState();

    useEffect(()=>{
        let hours = 0;
        taskLogs?.data.map((log)=>{
            hours = hours + log?.hours_logged
        })
        {/* 
        // @ts-ignore */}
        setHoursLogged(hours)
    }, [taskLogs])


    const [taskStatuses, setTaskStatuses] = useState([]);

    useEffect(() => {
        if (tasksByGraduateById?.data?.tasks_list) {
            const fetchTaskStatuses = async () => {
                const statuses = await Promise.all(
                  tasksByGraduateById.data.tasks_list.map((task) =>
                    APIHandler.getTaskStatus(
                      task.task_id,
                      JSON.parse(sessionStorage.getItem("user"))?.token
                    )
                  )
                );

                setTaskStatuses(statuses);

            };

            fetchTaskStatuses();
        }
    }, [tasksByGraduateById]);

    const pdfExportComponent = React.useRef(null);
    const handleExportWithComponent = (event) => {
      pdfExportComponent.current.save();
    };

    return (
        <div>
            <div>
                <InputLabel id="demo-simple-select-label">Select any Task *</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedTask}
                    label="Task"
                    sx={{ width: "200px" }}
                    placeholder='Select'
                    required
                    onChange={(event:any) =>
                        setSelectedTask(event.target.value)
                    }
                >
                    {JSON.parse(sessionStorage.getItem("user")).user_type == 1 && tasksByGraduateById?.data?.tasks_list?.map((task) => (
                        task && <MenuItem key={task.task_id} value={task.task_id}>
                            {task.task_details}
                        </MenuItem>
                    ))}

                    {JSON.parse(sessionStorage.getItem("user")).user_type == 2 && tasksByProfessorById?.data?.tasks_list?.map((task) => (
                        task && <MenuItem key={task.task_id} value={task.task_id}>
                            {task.task_details}
                        </MenuItem>
                    ))}

                </Select>
            </div>
            <Button onClick={handleExportWithComponent} variant="text">Download</Button>

            <PDFExport ref={pdfExportComponent}>
                <Typography variant='h6' sx={{ textAlign: "center", fontWeight: 700 }}>SPRING 2024 WDM PROJECT</Typography>
                <Box>
                    <img src="https://yt3.googleusercontent.com/B1TrijSQWAPefWPELeE2ewShLuyw7cIhJnBMvDmOdXVUDbpSSuOqnmFtcKphmiQxOFPHuclqrPo=s176-c-k-c0x00ffffff-no-rj" alt="UTA logo" width="100px" height="60px" />
                </Box>
                <Box>
                    <Typography variant='h5' sx={{ textAlign: "center", fontWeight: 400, textDecoration: 'underline' }}>Volunteer Student Weekly Activity Report Form</Typography>
                </Box>
                <Box className="template">
                    <Typography variant='h6' sx={{ textAlign: "center", fontWeight: 600, marginTop: '3rem' }}>Student Information</Typography>
                    <table>
                        <tbody>
                            <tr>
                                <td>Student ID</td>
                                <td>{userDetails?.id}</td>
                            </tr>
                            <tr>
                                <td>Full Name</td>
                                <td>{`${userDetails?.first_name || ""} ${userDetails?.last_name || ""}`}</td>
                            </tr>
                            <tr>
                                <td>Contact Email</td>
                                <td>{userDetails?.email}</td>
                            </tr>
                            <tr>
                                <td>Contact Phone</td>
                                <td>{userDetails?.contact_details}</td>
                            </tr>
                            <tr>
                                <td>Major</td>
                                <td>{userDetails?.dept}</td>
                            </tr>
                            <tr>
                                <td>Graduation Date</td>
                                <td>{userDetails?.graduation_date}</td>
                            </tr>
                        </tbody>
                    </table>
                </Box>
                <Box className="template">
                    <Typography variant='h6' sx={{ textAlign: "center", fontWeight: 600 }}>Professor/Supervisor Information</Typography>
                    <table>
                        <tbody>
                            <tr>
                                <td>Full Name</td>
                                <td>{`${professorDetails?.first_name || ""} ${professorDetails?.last_name || ""}`}</td>
                            </tr>
                            <tr>
                                <td>Contact Email</td>
                                <td>{professorDetails?.email}</td>
                            </tr>
                            <tr>
                                <td>Contact Phone</td>
                                <td>{professorDetails?.contact_details}</td>
                            </tr>
                            <tr>
                                <td>Major</td>
                                <td>{professorDetails?.dept}</td>
                            </tr>
                            <tr>
                                <td>Professor ID</td>
                                <td>{professorDetails?.id}</td>
                            </tr>
                        </tbody>
                    </table>
                </Box>
                <Box className="template">
                    <Typography variant='h6' sx={{ textAlign: "center", fontWeight: 600 }}>Volunteer Assignment Details</Typography>
                    <table>
                        <tbody>
                            <tr>
                                <td>Project/Activity Title: </td>
                                <td>{taskDetails?.data?.task_details?.task_details}</td>
                            </tr>
                            <tr>
                                <td>Brief Description:</td>
                                <td>{taskDetails?.data?.task_details?.summary}</td>
                            </tr>
                            <tr>
                                <td>Start Date</td>
                                <td>{taskDetails?.data?.task_details?.task_start_date.split("T")[0]}</td>
                            </tr>
                            <tr>
                                <td>End Date</td>
                                <td>{taskDetails?.data?.task_details?.task_end_date.split("T")[0]}</td>
                            </tr>
                            <tr>
                                <td>Weekly Hours Commitment/hours/week</td>
                                <td>21 at least</td>
                            </tr>
                            <tr>
                                <td>Location</td>
                                <td>Remote</td>
                            </tr>
                        </tbody>
                    </table>
                </Box>
                <Box className="template-activity-log">
                    <Typography variant='h6' sx={{ textAlign: "center", fontWeight: 600 }}>Weekly Activity Log</Typography>
                    <table>
                        <thead>
                            <th>
                                <td>Date</td>
                            </th>
                            <th>
                                <td>Activity Description</td>
                            </th>
                            <th>
                                <td>Hours Spent</td>
                            </th>
                        </thead>
                        <tbody>
                            {taskLogs?.data.map((log, index) => (
                                <tr key={index}>
                                    <td>{log.created_at.split("T")[0]}</td>
                                    <td>{log.comments}</td>
                                    <td>{log.hours_logged}</td>
                                </tr>
                            ))}

                            <tr>
                                <td><b></b>Total</td>
                                <td></td>
                                <td>{hoursLogged}</td>
                            </tr>
                        </tbody>
                    </table>
                </Box>
                <Box className="!mb-8 ml-2">
                    <Typography variant='h6' sx={{ textAlign: "left", fontWeight: 400, textDecoration: 'underline' }}>Student Acknowledgement:</Typography>
                    <Typography variant='h6' sx={{ textAlign: "left", fontWeight: 400 }}>I hereby confirm that I will commit to volunteering for a minimum of 20 hours per week as
                        specified in the above schedule. I understand that I will be supervised by the named
                        professor/supervisor and will maintain regular communica/on with them regarding my
                        activities.
                    </Typography>
                    <Typography variant='h6' sx={{ textAlign: "left", fontWeight: 400, marginTop: '2rem' }}>Student's Signature: {`${userDetails?.first_name || ""} ${userDetails?.last_name || ""}`}</Typography>{
                        (taskLogs?.data[taskLogs?.data?.length - 1]?.created_at?.split("T")[0] == undefined)?
                        <Typography variant='h6' sx={{ textAlign: "left", fontWeight: 400, marginTop: '1rem' }}>Date: {``}</Typography>:
                        <Typography variant='h6' sx={{ textAlign: "left", fontWeight: 400, marginTop: '1rem' }}>Date: {`${taskLogs?.data[taskLogs?.data?.length - 1]?.created_at?.split("T")[0]}`}</Typography>
                    }
                    <Typography variant='h6' sx={{ textAlign: "left", fontWeight: 400, textDecoration: 'underline', marginTop: '2rem' }}>Professor/Supervisor Acknowledgement:</Typography>
                    <Typography variant='h6' sx={{ textAlign: "left", fontWeight: 400 }}>
                        I hereby confirm my agreement to supervise the above-named student in their volunteer
                        activities and support their commitment of at least 21 hours per week in order to be compliant
                        with Immigration law.
                    </Typography>
                    <Typography variant='h6' sx={{ textAlign: "left", fontWeight: 400 }}>
                        I understand that I will maintain regular communication with the student regarding their activities.
                    </Typography>
                    <Typography variant='h6' sx={{ textAlign: "left", fontWeight: 400, marginTop: '2rem' }}>Professor/Supervisor's Signature: {`${professorDetails?.first_name || ""} ${professorDetails?.last_name || ""}`}</Typography>
                    {
                        (taskLogs?.data[taskLogs?.data.length - 1]?.created_at?.split("T")[0] == undefined)?
                        <Typography variant='h6' sx={{ textAlign: "left", fontWeight: 400, marginTop: '1rem' }}>Date: {``}</Typography>:
                        <Typography variant='h6' sx={{ textAlign: "left", fontWeight: 400, marginTop: '1rem' }}>Date: {`${taskLogs?.data[taskLogs?.data.length - 1]?.created_at?.split("T")[0]}`}</Typography>
                    }
                    <Typography variant='h6' sx={{ textAlign: "left", fontWeight: 400, marginTop: '2rem' }}>Submission Instructions:</Typography>
                    <p style={{ marginLeft: '2rem' }}>1) Attach your report.</p>
                    <p style={{ marginLeft: '2rem' }}>2) Please submit this form to the elizabeth.diaz@uta.edu for approval and record-keeping.
                        This form must be submitted on a weekly or bi-weekly basis</p>
                </Box>
            </PDFExport>
        </div>
    )
}

export default Template