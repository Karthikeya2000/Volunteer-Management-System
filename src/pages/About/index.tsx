import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import APIHandler from '../../handlers/APIHandler';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();
  const [loginCreds, setLoginCreds] = useState({
    user_details: null,
    user_type: null,
    isLoggedin: false,
    isVerifying: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if(JSON.parse(sessionStorage.getItem("user"))){
        try {
          const userDetails = await APIHandler.getUserDetails(
            JSON.parse(sessionStorage.getItem("user"))?.user_id,
            JSON.parse(sessionStorage.getItem("user"))?.token
          );
          setLoginCreds({
            user_details: userDetails?.data?.user_details,
            user_type: userDetails?.data?.user_details?.user_type,
            isLoggedin: true,
            isVerifying: false,
          });
          navigate('/dashboard');
        } catch (error) {
          navigate('/about');
        }
      }else{
        navigate('/about');
      }
    };
    fetchData();
  }, []);
  return (
    <Box style={{ marginTop: "6rem" }}>
        <h1>About Us - StuVol</h1>
        <p>Welcome to StuVol - Volunteer Program Portal! We are a dedicated team committed to empowering MS graduates in Computer Science and bridging the gap between academia and industry.</p>
        
        <h2>Our Mission</h2>
        <p>Our mission is to provide MS graduates with valuable opportunities, resources, and connections to help them succeed in their careers. We believe in fostering collaboration, innovation, and lifelong learning.</p>
        
        <h2>Our Vision</h2>
        <p>Our vision is to create a vibrant community of MS graduates who are equipped with the skills, knowledge, and networks to make a positive impact in the world of Computer Science and beyond.</p>
        
        <h2>Our Values</h2>
        <ul>
            <li>Empowerment: We empower MS graduates to take control of their careers and pursue their passions.</li>
            <li>Collaboration: We believe in the power of collaboration and teamwork to drive innovation and excellence.</li>
            <li>Integrity: We uphold the highest standards of integrity, professionalism, and ethical conduct in everything we do.</li>
            <li>Inclusivity: We celebrate diversity and inclusion, embracing individuals from all backgrounds and experiences.</li>
        </ul>
        
        <h2>Get in Touch</h2>
        <p>Have questions or feedback? We'd love to hear from you! Contact us.</p>
        <Box sx={{ marginTop: "1rem" }}>
          <Footer />
        </Box>
    </Box>
  )
}

export default About