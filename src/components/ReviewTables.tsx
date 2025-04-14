// @ts-nocheck
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Modal, Snackbar, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import APIHandler from '../handlers/APIHandler';
import CircularProgress from '@mui/joy/CircularProgress';
import { DateTime } from 'luxon';

function createData(
  tasks: string,
  startDate: string,
  endDate: string,
  assignee: string,
  link: string,
  status:string,
  aiCheatStatus:string
) {
  return { tasks, startDate, endDate, assignee, link, status, aiCheatStatus };
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ReviewTables() {
  const [open, setOpen] = React.useState(false);
  const [selectedTask,setSelectedTask] = React.useState();
  const handleOpen = (id) => {setSelectedTask(id); return setOpen(true)}
  const handleClose = () => setOpen(false);
  const [comments,setComments] = React.useState({task_id:"",comments:""});
  const [submitSuccess,setSubmitSuccess] = React.useState(false);
  const [showError,setShowError] = React.useState(false);
  const [trigger,setTrigger] = React.useState(false);
  const [hoursLogged ,setHoursLogged] = React.useState(null);
  const { isLoading: taskListLoading, data: tasksData } = useQuery({
    queryFn: () => APIHandler.getTaskList(
      JSON.parse(sessionStorage.getItem("user"))?.user_id,
      JSON.parse(sessionStorage.getItem("user"))?.token
    ),
    queryKey: ["tasklist",trigger],
    select(data) {
      return data?.data?.tasks_list;
    },
  });
  const updateReviewComments = useMutation({
    mutationFn: APIHandler.updateReviewComments,
    onSuccess: () => {
      setComments({task_id:"",comments:""})
      setSubmitSuccess(true);
      setTrigger(trigger?false:true);
      setOpen(false)
    },
    onError: () => {
      setShowError(true);
    },
  });

  const { data: taskLogs , isLoading: taskLogsLoading} = useQuery({
    queryKey: ["taskLogs", selectedTask],
    queryFn: () =>
      APIHandler.getTaskLogs(
        selectedTask,
        JSON.parse(sessionStorage.getItem("user"))?.token
      ),
    enabled: !!selectedTask,
  });

  useEffect(()=>{
    let hours = 0;
    taskLogs?.data.map((log)=>{
        hours = hours + log?.hours_logged
    })
    {/* 
    // @ts-ignore */}
    setHoursLogged(hours)
  }, [taskLogs])

  if(taskListLoading || taskLogsLoading){
    return <CircularProgress />
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Tasks</TableCell>
            <TableCell align="left">Graduate</TableCell>
            <TableCell align="left">Start Date</TableCell>
            <TableCell align="left">End Date</TableCell>
            <TableCell align="left">Link</TableCell>
            <TableCell align="left">Review Status</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Priority</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasksData?.map((row) => (
            <TableRow
              key={row.tasks}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">
                {row.task_details}
              </TableCell>
              <TableCell align="left">
                {`${row.first_name} ${row.last_name}`}
              </TableCell>
              <TableCell align="left">
                {DateTime.fromISO(row.task_start_date, {
                  zone: "utc",
                }).toFormat("MM/dd/yyyy")}
              </TableCell>
              <TableCell align="left">
                {DateTime.fromISO(row.task_end_date, { zone: "utc" }).toFormat(
                  "MM/dd/yyyy"
                )}
              </TableCell>
              <TableCell align="left">
                {" "}
                <Button size="small" onClick={()=> handleOpen(row.task_id)} disabled={row.progress != 3 || row.completed}>
                  Review
                </Button>
              </TableCell>
              <TableCell align="left">
                {row.completed == "0" ? "Incomplete" : "complete"}
              </TableCell>
              <TableCell align="left">
                {row.progress == "1" ? "Open" : row.progress == "2" ? "In Progress" : row.progress == "3" ? "Done" : "Open"}
              </TableCell>
              <TableCell align="left">
                {row.task_priority == "1"
                  ? "Medium"
                  : row.task_priority == "3"
                  ? "Low"
                  : row.task_priority == "2"
                  ? "High"
                  : "none"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ marginBottom: "1rem"}}
            >
              Review Task and Add Comments
            </Typography>
            <Button onClick={handleClose} style={{fontWeight:700}}>X</Button>
          </Box>
          {
            (taskLogs?.data?.length>0)?
            <table className="reviewTable" style={{border:"2px solid grey",margin: "0px auto", 	marginTop: "2rem", marginBottom: "2rem"}}>
                <thead>
                    <th>
                        <td>Date</td>
                    </th>
                    <th>
                        <td>Activity Description</td>
                    </th>
                    <th>
                        <td>Attachment</td>
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
                            <td>{log.file?<a download="PDF Title" href={log.file}>Download PDF document</a>:"NA"}</td>
                            <td>{log.hours_logged}</td>
                        </tr>
                    ))}
                    <tr>
                        <td><b></b>Total</td>
                        <td></td>
                        <td></td>
                        <td>{hoursLogged}</td>
                    </tr>
                </tbody>
            </table>:
            <Box sx={{height:"50px",width:"100%"}}>
              <p>No Reports</p>
            </Box>
          }
          {/* 
      // @ts-ignore */}
          <textarea
            required
            name="Text1"
            cols={40}
            rows={5}
            value={comments["comments"]}
            placeholder="Review"
            onChange={(event) =>
              setComments({ ...comments, comments: event.target.value, task_id:selectedTask})
            }
          ></textarea>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, width: "250px" }}
            onClick={() => {
              updateReviewComments.mutate(
                comments,
                JSON.parse(sessionStorage.getItem("user"))?.token
              );
            }}
          >
            Submit
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ml:2, mt: 3, mb: 2, width: "250px",backgroundColor: "grey" }}
            onClick={() => handleClose(false)}>
            Cancel
          </Button>
        </Box>
      </Modal>
      <Snackbar
        open={submitSuccess}
        message="Review submitted Successfully"
        autoHideDuration={2000}
        onClose={() => setSubmitSuccess(false)}
        disableWindowBlurListener
      />
    </TableContainer>
  );
};