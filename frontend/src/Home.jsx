import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { Card, CardContent, CardHeader, Typography, CardMedia } from "@mui/material";
import "./App.css";
import image from "./sprintcompass.jpg";

const HomePage = () => {
 return (
 <ThemeProvider theme={theme}>
   <Card className="card">
     <CardMedia
       component="img"
       image={image}
       alt="Travel Image"
       sx={{width: '150px', height: 'auto', margin: '0 auto'}}
     />
     <CardHeader
       title="Sprint Compass"
       style={{ color: theme.palette.primary.main, textAlign: "center" }}
     />
     <CardContent>
       <br />
       <Typography
         color="primary"
         style={{ float: "right", paddingRight: "1vh", fontSize: "smaller" }}
       >
         &copy;Sprint Compass
       </Typography>
     </CardContent>
   </Card>
 </ThemeProvider>
 );
};
export default HomePage;
