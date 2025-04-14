import { PDFExport } from '@progress/kendo-react-pdf';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import APIHandler from '../handlers/APIHandler';
import CircularProgress from '@mui/joy/CircularProgress';
import Button from '@mui/material/Button';

function RecommendationLetter() {
    const pdfExportComponent = React.useRef(null);
    const handleExportWithComponent = (event) => {
      pdfExportComponent.current.save();
    };
    const { isLoading: userDetailsLoading, data: userDetails } = useQuery({
      queryFn: () => APIHandler.getUserDetails(
        JSON.parse(sessionStorage.getItem("user"))?.user_id,
        JSON.parse(sessionStorage.getItem("user"))?.token
      ),
      queryKey: ["userDetails"],
      select(data) {
        return data?.data?.user_details;
      },
    });

    const {data: professorDetails , isLoading: professorDetailsLoading} = useQuery({
      queryFn: () => APIHandler.getUserDetails(
        userDetails?.certified_by,
        JSON.parse(sessionStorage.getItem("user"))?.token
      ),
      queryKey: ["professorDetails"],
      select(data) {
        return data?.data?.user_details;
      },
      enabled: !!userDetails?.certified_by
    });
    if(userDetailsLoading || professorDetailsLoading){
      return <CircularProgress />
    }
  return (
    <div>
      {
        (userDetails?.is_certified && userDetails && professorDetails)?
        <>
          <Button onClick={handleExportWithComponent} variant="text">Download</Button>
          <PDFExport ref={pdfExportComponent}>
            <div
              style={{
                maxWidth: "800px",
                margin: "20px auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#fff",
                fontFamily: "Arial, sans-serif",
                lineHeight: "1.6",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h2>Recommendation Letter</h2>
                <h3>To whom so ever it may concern</h3>
              </div>
              <p>
                I am writing to wholeheartedly recommend{" "}
                <strong>{`${userDetails?.first_name?.toUpperCase()} ${userDetails?.last_name?.toUpperCase()}`}</strong> for{" "}
                <strong>Job Position/Admission to any College Program</strong>. Having
                had the pleasure of working closely with <strong>[him/her]</strong>{" "}
                during <strong>[his/her]</strong> time in{" "}
                <strong>{userDetails?.dept}</strong> course at{" "}
                <strong>UTA</strong>, I can confidently attest to{" "}
                <strong>[his/her]</strong> exceptional abilities, dedication, and
                potential for future success.
              </p>
              <p>
                Throughout <strong>[his/her]</strong> tenure in {" "}
                <strong>{userDetails?.dept}</strong>,{" "}
                <strong>{`${userDetails?.first_name?.toUpperCase()} ${userDetails?.last_name?.toUpperCase()}`}</strong> consistently impressed me with{" "}
                <strong>[his/her]</strong> keen intellect, strong work ethic, and
                unwavering commitment to excellence. <strong>[He/She]</strong> tackled
                each assignment with enthusiasm and creativity, demonstrating a
                remarkable ability to analyze complex problems and develop innovative
                solutions. <strong>[His/Her]</strong> contributions to class
                discussions were insightful and thought-provoking, reflecting a deep
                understanding of the subject matter and a genuine passion for
                learning.
              </p>
              <p>
                One particular project that stands out is{" "}When tasked with{" "}
                <strong>some complex task</strong>,{" "}
                <strong>{`${userDetails?.first_name?.toUpperCase()} ${userDetails?.last_name?.toUpperCase()}`}</strong> not only met but exceeded
                expectations, showcasing <strong>[his/her]</strong> exceptional
                analytical skills, attention to detail, and ability to work
                effectively both independently and as part of a team.{" "}
                <strong>[His/Her]</strong> final deliverable not only demonstrated{" "}
                <strong>[his/her]</strong> mastery of the material but also{" "}
                <strong>[his/her]</strong> capacity to think critically and creatively
                in order to achieve outstanding results.
              </p>
              <p>
                Furthermore, <strong>{`${userDetails?.first_name?.toUpperCase()}`}</strong> possesses excellent
                communication skills, both written and verbal, which were evident in{" "}
                <strong>[his/her]</strong> interactions with peers, faculty, and
                external stakeholders. <strong>[He/She]</strong> is articulate,
                persuasive, and adept at conveying complex ideas in a clear and
                concise manner, making <strong>[him/her]</strong> an invaluable asset
                to any team or organization.
              </p>
              <p>
                Beyond <strong>[his/her]</strong> academic and intellectual
                capabilities, <strong>{`${userDetails?.first_name?.toUpperCase()}`}</strong> is also a person of
                integrity, reliability, and integrity, demonstrating professionalism
                and maturity beyond <strong>[his/her]</strong> years.{" "}
                <strong>[He/She]</strong> approaches challenges with a positive
                attitude, resilience, and a willingness to learn from setbacks,
                qualities that will undoubtedly serve <strong>[him/her]</strong> well
                in <strong>[his/her]</strong> future endeavors.
              </p>
              <p>
                In conclusion, I have no hesitation in recommending{" "}
                <strong>{`${userDetails?.first_name?.toUpperCase()}`}</strong> for{" "}
                <strong>Job Position/Admission to College Program</strong>.{" "}
                <strong>[He/She]</strong> possesses all the qualities and attributes
                necessary to excel in <strong>[his/her]</strong> chosen field and will
                undoubtedly make a positive and lasting impact wherever{" "}
                <strong>[he/she]</strong> goes. If you have any further questions or
                require additional information, please do not hesitate to contact me.
              </p>
              <div style={{ marginTop: "30px" }}>
                <p>Sincerely,</p>
                <p>
                  <strong>{`${professorDetails?.first_name} ${professorDetails?.last_name}`}</strong>
                  <br />
                  <strong>University of Texas</strong>
                  <br/>
                  <strong>Arlington</strong>
                </p>
              </div>
            </div>
          </PDFExport>
        </>: <p>No 'Recommendation Letters' to download</p>
      }
    </div>
  );
}

export default RecommendationLetter;
