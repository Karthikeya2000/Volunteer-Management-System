import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export default function BasicCards(props:any) {
    const {metric,number} = props;
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h1" sx={{ fontSize: 60 }} color="text.primary" gutterBottom>
         {number}
        </Typography>
        <Typography variant="h6">
          {metric}
        </Typography>
      </CardContent>
    </Card>
  );
}
