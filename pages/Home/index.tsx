import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import APIHandler from "../../handlers/APIHandler";
import { useNavigate } from "react-router-dom";

function Home() {
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
          navigate('/');
        }
      }else{
        navigate('/');
      }
    };
    fetchData();
  }, []);
  return (
    <Box style={{ marginTop: "4rem" }}>
      <Box
        component="img"
        sx={{
          height: 150,
          width: 200,
        }}
        alt="WDM logo"
        src="/WDM.png"
        alignItems="center"
        justifyContent="center"
      />
      <div>
        <h1>Welcome to StuVol - Volunteer Program Portal</h1>
        <p>Empowering MS Graduates in Computer Science</p>
      </div>
      <div>
        <h2>Unlock Your Potential</h2>
        <p>
          Join a community of driven MS graduates who are eager to make a
          difference in the world of Computer Science. With StuVol - Volunteer Program Portal,
          you'll gain access to cutting-edge technology, meaningful projects,
          and a supportive network of peers and mentors.
        </p>
      </div>
      <div>
        <h2>Seamless Collaboration, Real Results</h2>
        <p>
          Say goodbye to the traditional barriers to collaboration. With our
          intuitive platform, you can seamlessly connect with professors, peers,
          and industry professionals to tackle projects, share ideas, and
          achieve real results.
        </p>
      </div>
      <div>
        <h2>Features That Propel You Forward</h2>
        <ul>
          <li>
            Personalized Dashboards: Stay organized and on track with
            personalized dashboards that give you a bird's eye view of your
            progress, tasks, and deadlines.
          </li>
          <li>
            Real-Time Communication: Connect with peers and professors in
            real-time through our integrated chat feature. Share insights, ask
            questions, and collaborate effortlessly.
          </li>
          <li>
            Task Management: Keep track of your tasks and responsibilities with
            our intuitive task management tools. Prioritize your workload and
            stay focused on what matters most.
          </li>
          <li>
            Weekly Reports and Feedback: Submit weekly reports to track your
            accomplishments and receive valuable feedback from professors and
            mentors. Gain insights into your strengths and areas for growth.
          </li>
        </ul>
      </div>
      <div>
        <h2>Join Us Today</h2>
        <p>
          Ready to take your career to the next level? Sign up for Your Product
          Name today and embark on a journey of growth, discovery, and success.
          Together, we'll unlock your full potential and pave the way for a
          bright future in Computer Science.
        </p>
      </div>
      <div>
        <h2>Have Questions? We're Here to Help</h2>
        <p>
          Have questions about StuVol - Volunteer Program Portal or how it can benefit you? Our
          dedicated support team is here to assist you every step of the way.
          Contact us today and let's chat!
        </p>
      </div>
      <Box sx={{ marginTop: "1rem" }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default Home;
