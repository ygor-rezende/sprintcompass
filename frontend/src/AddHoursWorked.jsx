import React, { useReducer, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Autocomplete,
  Card,
  CardContent,
  Button,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import image from "./sprintcompass.jpg";
import theme from "./theme";
import "./App.css";
import Subtask from "./components/subtaskClass";

const AddHoursWorked = () => {
  const initialState = {
    showMsg: false,
    snackbarMsg: "",
    teamName: "",
    subtaskName: "",
    hoursWorked: 0,
    hoursToComplete: 0,
    workInfo: "",
    teamMembers: [],
    selectedMember: "",
    optionskey: 1,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: "query {teamMembers{firstName,lastName}}",
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
      let team = json.data.teamMembers;
      setState({
        showMsg: true,
        snackbarMsg: `Found ${team.length} members.`,
        teamMembers: team,
      });
    } catch (error) {
      setState({
        snackbarMsg: `${error.message} - Problem loading the server data`,
        showMsg: true,
      });
    }
  };

  const onAddClicked = async () => {
    let subtaskInfo = new Subtask(
      state.teamName,
      state.subtaskName,
      state.hoursWorked,
      state.hoursToComplete,
      state.workInfo,
      `${state.selectedMember.firstName} ${state.selectedMember.lastName}`
    );
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `mutation {addSubtask(teamName: "${subtaskInfo.teamName}", subtaskName: "${subtaskInfo.subtaskName}", 
        hoursWorked: ${subtaskInfo.hoursWorked}, hoursToComplete: ${subtaskInfo.hoursToComplete}, 
        workInfo: "${subtaskInfo.workInfo}", teamMember: "${subtaskInfo.teamMember}")
        {teamName, subtaskName, hoursWorked, hoursToComplete, workInfo, teamMember} }`,
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
      setState({
        showMsg: true,
        snackbarMsg: `Added Subtask Information`,
        teamName: "",
        subtaskName: "",
        hoursWorked: 0,
        hoursToComplete: 0,
        workInfo: "",
        selectedMember: "",
        optionskey: Math.random(),
      });
    } catch (error) {
      setState({
        snackbarMsg: `${error.message} - Subtask Information Not Added`,
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

  const handleTeamInput = (e) => {
    setState({ teamName: e.target.value });
  };
  const handleSubtaskInfoInput = (e) => {
    setState({ subtaskName: e.target.value });
  };
  const handleHoursWorked = (e) => {
    setState({ hoursWorked: e.target.value });
  };
  const handleHoursToComplete = (e) => {
    setState({ hoursToComplete: e.target.value });
  };
  const handleTeamMember = (e) => {
    setState({ selectedMember: e.target.value });
  };
  const handleWorkInfoInput = (e) => {
    setState({ workInfo: e.target.value });
  };
  // const onChange = (e, selectedOption) => {
  //   setState({ workInfo: selectedOption });
  // };

  const emptyorundefined =
    state.teamName === undefined ||
    state.teamName === "" ||
    state.subtaskName === undefined ||
    state.subtaskName === "" ||
    state.hoursWorked === undefined ||
    state.hoursWorked === "" ||
    state.hoursToComplete === undefined ||
    state.hoursToComplete === "" ||
    state.workInfo === undefined ||
    state.workInfo === "" ||
    state.teamMembers === undefined ||
    state.teamMembers === "";

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
            Add Subtask Information
          </Typography>
          <TextField
            onChange={handleTeamInput}
            placeholder="Team's Name"
            value={state.teamName}
            style={{ width: "100%" }}
          />
          <TextField
            onChange={handleSubtaskInfoInput}
            placeholder="Subtask Name"
            value={state.subtaskName}
            style={{ width: "100%" }}
          />
          <TextField
            onChange={handleHoursWorked}
            placeholder="Hours Worked"
            value={state.hoursWorked}
            style={{ width: "100%" }}
          />
          <TextField
            onChange={handleHoursToComplete}
            placeholder="Estimated Time To Complete (Hours)"
            value={state.hoursToComplete}
            style={{ width: "100%" }}
          />
          <TextField
            onChange={handleWorkInfoInput}
            placeholder="What Work Has Been Done/Implemented"
            value={state.workInfo}
            style={{ width: "100%" }}
          />
          <Autocomplete
            key={state.optionskey}
            options={state.teamMembers}
            getOptionLabel={(option) =>
              `${option.firstName}, ${option.lastName}`
            }
            onChange={(e, selectedOption) => {
              handleTeamMember({ target: { value: selectedOption } });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assign A Team Member"
                variant="outlined"
              />
            )}
          />
          <Button
            color="primary"
            variant="contained"
            style={{ marginTop: 10 }}
            onClick={onAddClicked}
            disabled={emptyorundefined}
          >
            ADD SUBTASK INFORMATION
          </Button>
          <Snackbar
            open={state.showMsg}
            message={state.snackbarMsg}
            autoHideDuration={4000}
            onClose={snackbarClose}
          />
          <Snackbar
            open={state.contactServer}
            message={state.snackBarMsg}
            autoHideDuration={3000}
            onClose={snackbarClose}
          />
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default AddHoursWorked;
