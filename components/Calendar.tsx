import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import APIHandler from '../handlers/APIHandler';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const localizer = momentLocalizer(moment);

// const events = [
//   {
//     title: 'Peer Review',
//     start_date: new Date(2024, 1, 20, 10, 0),
//     end: new Date(2024, 1, 27, 10, 30),
//   },
//   {
//     title: 'Brain Writing',
//     start_date: new Date(2024, 1, 25, 15, 45),
//     end: new Date(2024, 1, 28, 16, 30),
//   },
//   {
//     title: 'Concept Mapping',
//     start_date: new Date(2024, 1, 26, 15, 45),
//     end: new Date(2024, 2, 30, 16, 30),
//   },
// ];

const CalendarComponent = () => {
  const [importantDates, setImportantDates] = useState([]);
  const { data: importantDatesList } = useQuery({
    queryKey: ["importantDatesList"],
    queryFn: () => APIHandler.getImportantDates(
      JSON.parse(sessionStorage.getItem("user"))?.token
    ),
  });

  useEffect(()=>{
    if(importantDatesList){
      importantDatesList?.data?.importantDates.map(item=>{
        item.start_date = new Date(item.start_date);
        item.end_date = new Date(item.end_date);
      });
      setImportantDates(importantDatesList?.data?.importantDates);
    }
    
  },[importantDatesList]);
  return (
    <div style={{ height: 600 }}>
      {
        <Box style={{ height: 600 }}>
          {
            importantDatesList?.data?.importantDates?.length<=0 &&  
            <p>No dates available to show</p>
          } 
            <Calendar
              localizer={localizer}
              events={importantDates}
              startAccessor="start_date"
              endAccessor="end_date"
              style={{ margin: '50px' }}
            />
        </Box>
      }
    </div>
  );
};

export default CalendarComponent;
