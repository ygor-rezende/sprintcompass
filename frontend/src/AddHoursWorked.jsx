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
    subtaskName: "",
    hoursWorked: 0,
    hoursToComplete: 0,
    workInfo: "",
    teamMembers: [],
    selectedMember: "",
    optionskey: 1,
    optionskey2: 2,
    optionskey3: 3,
    sprints: [],
    selectedStory: "",
    projects: [],
    selectedTeam: "",
    userStories: []
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      //Load Team members
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


      //Load Sprints and User stories
      query = JSON.stringify({
        query: "query {sprints{name,status,items}}",
      });
      console.log(query);
      response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      json = await response.json();
      let sprints = json.data.sprints;
      let userStories = [];
      sprints.forEach(sprint => { 
        let items = sprint.items.replaceAll("'",'"');
        items = JSON.parse(items);
        items.forEach(story => userStories.push({name: story.userStoryPortion, priority: story.priority}));
      })

      //Load team name information from projects table
      query = JSON.stringify({
        query: "query {projects{teamName}}",
      });
      console.log(query);
      response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      json = await response.json();
      let projects = json.data.projects;
      
      setState({
        showMsg: true,
        snackbarMsg: `Found ${team.length} members, ${sprints.length} sprints, ${userStories.length} stories, and ${projects.length} teams.`,
        teamMembers: team,
        sprints: sprints,
        projects: projects,
        userStories: userStories
      });
    } catch (error) {
      setState({
        snackbarMsg: `${error.message} - Problem loading the server data`,
        showMsg: true,
      });
    }
  };




  const onAddClicked = async () => {
    let story = JSON.stringify(state.selectedStory);
    story = story.replaceAll('"', "'");
    let subtaskInfo = new Subtask(
      state.selectedTeam.teamName,
      story,
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
        query: `mutation {addSubtask(teamName: "${subtaskInfo.teamName}", story: "${subtaskInfo.story}", subtaskName: "${subtaskInfo.subtaskName}", 
        hoursWorked: ${subtaskInfo.hoursWorked}, hoursToComplete: ${subtaskInfo.hoursToComplete}, 
        workInfo: "${subtaskInfo.workInfo}", teamMember: "${subtaskInfo.teamMember}")
        {teamName, story, subtaskName, hoursWorked, hoursToComplete, workInfo, teamMember} }`,
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
        selectedTeam: "",
        subtaskName: "",
        hoursWorked: 0,
        hoursToComplete: 0,
        workInfo: "",
        selectedMember: "",
        optionskey: Math.random(),
        optionskey2: Math.random(),
        optionskey3: Math.random(),
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
  const handleTeamName = (e) => {
    setState({ selectedTeam: e.target.value });
  };

  const handleStory = (e) => {
    setState({selectedStory: e.target.value})
  }
  // const onChange = (e, selectedOption) => {
  //   setState({ workInfo: selectedOption });
  // };

  const emptyorundefined =
    state.selectedTeam === undefined ||
    state.selectedTeam === "" ||
    state.selectedTeam === null ||
    state.selectedMember === undefined ||
    state.selectedMember === "" ||
    state.selectedMember === null ||
    state.selectedStory === undefined ||
    state.selectedStory === "" ||
    state.selectedStory === null ||
    state.subtaskName === undefined ||
    state.subtaskName === "" ||
    state.hoursWorked === undefined ||
    state.hoursWorked === "" ||
    state.hoursToComplete === undefined ||
    state.hoursToComplete === "" ||
    state.workInfo === undefined ||
    state.workInfo === "";

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
          <Autocomplete
            key={state.optionskey}
            options={state.projects}
            getOptionLabel={(option) =>
              `${option.teamName}`
            }
            onChange={(e, selectedOption) => {
              handleTeamName({ target: { value: selectedOption } });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a team"
                variant="outlined"
              />
            )}
          />
          <Autocomplete
            key={state.optionskey2}
            options={state.userStories}
            getOptionLabel={(option) =>
              `${option.name}`
            }
            onChange={(e, selectedOption) => {
              handleStory({ target: { value: selectedOption } });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a user story"
                variant="outlined"
              />
            )}
          />
          <TextField
            onChange={handleSubtaskInfoInput}
            placeholder="Subtask Name"
            value={state.subtaskName}
            style={{ width: "100%" }}
          />
          <TextField
            label="Hours Worked"
            onChange={handleHoursWorked}
            placeholder="Hours Worked"
            value={state.hoursWorked}
            style={{ width: "100%" }}
          />
          <TextField
            label="Estimated Time To Complete (Hours)"
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
            key={state.optionskey3}
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
