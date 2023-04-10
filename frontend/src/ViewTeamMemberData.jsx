import React, { useReducer, useEffect, useState} from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Snackbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import image from "./sprintcompass.jpg";
import theme from "./theme";
import "./App.css";
import XLSXConversion from './XLSXConversion';

const ListTeamMemberData = () => {
    const initialState = {
        showMsg: false,
        snackbarMsg: "",
        teamNames: [],
        subtasks: [],
      };
      

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const [selectedTeamName, setSelectedTeamName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {

      //Load subtasks table
      let query = JSON.stringify({
        query:
          "query{subtasks{teamName, story, subtaskName, hoursWorked, hoursToComplete, workInfo, teamMember}}",
      });
  
      console.log(query);
      let response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      let json = await response.json();
      let subtasks = json.data.subtasks.map((subtask) => {
        let story = JSON.parse(subtask.story.replaceAll("'",'"'));
        return {
        teamName: subtask.teamName,
        priority: story.priority,
        userStory: story.name,
        subtaskInfo: `${subtask.subtaskName}: ${subtask.workInfo}`,
        teamMember: subtask.teamMember,
        actualHours: subtask.hoursWorked,
        hoursToComplete: subtask.hoursToComplete
      }});
      setState({
        showMsg: true,
        snackbarMsg: `Found ${subtasks.length} team member's reports.`,
        teamNames: [...new Set(subtasks.map((subtask) => subtask.teamName))],
        subtasks: subtasks,
      });
    } catch (error) {
      setState({
        snackbarMsg: `${error.message} - Problem loading the server data`,
        showMsg: true,
      });
    }

  };
  
  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({
      showMsg: false,
    });
  };

  const generateTeamMemberReport = () => {
    const xlsxGenerator = new XLSXConversion(state.subtasks);
    const buffer = xlsxGenerator.generateWorkbook(selectedTeamName);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TeamMemberReport-${selectedTeamName}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateSummaryReport = () => {
    const xlsxGenerator = new XLSXConversion(state.subtasks);
    const buffer = xlsxGenerator.generateSprintSumaryReport(selectedTeamName);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ProjectSummaryReport-${selectedTeamName}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Card className="card">
        <CardContent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={image} width="20%" height="20%" />
          </div>
        </CardContent>
        <CardContent>
          <Typography
            variant="h6"
            color="primary"
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            Select a Team to View Data or Generate A Spread Sheet Report For:
          </Typography>
  
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <select value={selectedTeamName} onChange={(e) => setSelectedTeamName(e.target.value)}>
              <option value="">Select A Team</option>
              {state.teamNames.map((teamName) => (
                <option value={teamName} key={teamName}>
                  {teamName}
                </option>
              ))}
            </select>

          </div>
  
          {state.subtasks
  .filter((subtask) => !selectedTeamName || subtask.teamName === selectedTeamName)
  .map((subtask) => (
    <Card key={subtask.subtaskName} style={{ margin: "10px" }}>
      <CardContent>
        <Typography variant="h5">{`Project Team: ${subtask.teamName}`}</Typography>
        <Typography variant="h6">{`User Story: ${subtask.userStory}`}</Typography>
        <Typography variant="body1">{`Team member: ${subtask.teamMember}`}</Typography>
        <Typography variant="body1">{`Hours Worked: ${subtask.actualHours}`}</Typography>
      </CardContent>
    </Card>
    
  ))}  
          <Snackbar
            open={state.showMsg}
            message={state.snackbarMsg}
            autoHideDuration={4000}
            onClose={snackbarClose}
          />
        </CardContent>
        <button onClick={generateTeamMemberReport} disabled={!selectedTeamName}>
            Generate Team Member Report 
          </button>
          <button onClick={generateSummaryReport} disabled={!selectedTeamName}>
            Generate Sumary Report
          </button>
      </Card>
    </ThemeProvider>
  );
  
};

export default ListTeamMemberData;
