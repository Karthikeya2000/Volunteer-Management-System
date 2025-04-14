// @ts-nocheck
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import APIHandler from '../handlers/APIHandler';

function createData(
  tasks: string,
  startDate: string,
  endDate: string,
  assignee: string,
  link: string,
  status:string
) {
  return { tasks, startDate, endDate, assignee, link, status };
}


export default function GenerateRecommendations() {
  const [certifyData,setCertifyData] = React.useState({userId:"",professorId:""});
  const [submitSuccess,setSubmitSuccess] = React.useState(false);
  const [showError,setShowError] = React.useState(false);

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

  const certify = useMutation({
    mutationFn: APIHandler.certify,
    onSuccess: () => {
      setSubmitSuccess(true);
    },
    onError: () => {
      setShowError(true);
    },
  });

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column", width: "500px" }}>
        <FormControl style={{ width: "400px", marginBottom: "2rem" }}>
          <InputLabel id="demo-simple-select-label">Graduate</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={certifyData.userId}
            label="Graduate"
            onChange={(event) =>
              setCertifyData({
                ...certifyData,
                professorId: JSON.parse(sessionStorage.getItem("user")).user_id,
                userId: event.target.value,
              })
            }
          >
            {graduatesData?.map((eachItem) => (
              <MenuItem value={`${eachItem.id}`}>
                {eachItem.first_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, width: "400px" }}
          onClick={() => {
          {/* 
           // @ts-ignore */}
            certify.mutate(
              certifyData,
              JSON.parse(sessionStorage.getItem("user"))?.token
            );
          }}
          disabled={!certifyData.userId}
        >
          Generate
        </Button>
      </Box>
      <Snackbar
        open={submitSuccess}
        message="Recommendation Generated Successfully"
        autoHideDuration={2000}
        disableWindowBlurListener
      />
    </Box>
  );
}