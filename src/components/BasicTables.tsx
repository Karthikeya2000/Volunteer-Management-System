import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import moment from 'moment';

function createData(
  tasks: string,
  startDate: string,
  endDate: string,
  priority: string,
  status: string
) {
  return { tasks, startDate, endDate, priority, status };
}

export default function BasicTables(tableData) {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Tasks</TableCell>
            <TableCell align="right">Start Date</TableCell>
            <TableCell align="right">End Date</TableCell>
            <TableCell align="right">Priority</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Review Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData?.tableData.map((row) => (
            <TableRow
              key={row.tasks}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.task_details}
              </TableCell>
              <TableCell align="right">{moment(row.task_start_date).format('MM/DD/YYYY')}</TableCell>
              <TableCell align="right">{moment(row.task_end_date).format('MM/DD/YYYY')}</TableCell>
              <TableCell align="right">{row.task_priority == 1 ? "Medium" : row.task_priority == 2 ? "High" : "Low"}</TableCell>
              <TableCell align="right">{row.progress == 1 ? "Open" : row.progress == 2 ? "In Progress" : row.progress == 3 ? "Done" : "Open"}</TableCell>
              <TableCell align="right">{row.completed ? "Done" : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}