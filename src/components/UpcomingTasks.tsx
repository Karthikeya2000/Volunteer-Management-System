import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import APIHandler from '../handlers/APIHandler';


export default function UpcomingTasks() {
  const { data: tasksByGraduate } = useQuery({
    queryKey: ["tasksByGraduate"],
    queryFn: () =>
      APIHandler.getTasksByGraduate(
        `start_date=${new Date().toISOString().slice(0, -5) + "Z"}`,
        JSON.parse(sessionStorage.getItem("user"))?.token
      ),
  });
  
  const heading =  "Upcoming Tasks"
  const tasks = ["Weekly Thesis", "POC Task", "Research weekly Thesis"]

  return (
    <Card sx={{ minWidth: 275, minHeight:150 }}>
      <CardContent>
        <Typography variant="h4" sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
          {heading}
        </Typography>
        {tasksByGraduate?.data?.tasks_list.map((task, index) => (
          <Typography key={index} sx={{ fontSize: 16 }}>
            {task.task_details}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
}
