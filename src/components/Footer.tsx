import { Link, Typography } from '@mui/material';
import React from 'react'
function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit">
          StuVol - Volunteer Program Portal
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
        <Link color="inherit">
          All Rights Reserved.
        </Link>{' '}
      </Typography>
    );
}
function Footer() {
  return (
    <div>
        <Copyright/>
    </div>
  )
}

export default Footer