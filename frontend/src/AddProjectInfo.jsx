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
import Project from "./components/projectClass";

const AddProjectInfo = () => {
  const initialState = {
    showMsg: false,
    snackbarMsg: "",
    teamName: "",
    productName: "",
    startDate: "",
    numHoursStoryPoint: "",
    estimatedNumStoryPoints: "",
    estimatedCost: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const storyPointOptions = [0, 0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55];

  const onAddClicked = async () => {
    let projectInfo = new Project(
      state.teamName,
      state.productName,
      state.startDate,
      state.numHoursStoryPoint,
      state.estimatedNumStoryPoints,
      state.estimatedCost
    );
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `mutation {addProject(teamName: "${projectInfo.teamName}", productName: "${projectInfo.productName}", 
        startDate: "${projectInfo.startDate}", numHoursStoryPoint: ${projectInfo.numHoursStoryPoint}, 
        estimatedNumStoryPoints: ${projectInfo.estimatedNumStoryPoints}, estimatedCost: ${projectInfo.estimatedCost})
        {teamName, productName, startDate, numHoursStoryPoint, estimatedNumStoryPoints, estimatedCost} }`,
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
        snackbarMsg: `Added Project Information`,
        teamName: "",
        productName: "",
        startDate: "",
        numHoursStoryPoint: "",
        estimatedNumStoryPoints: "",
        estimatedCost: "",
      });
    } catch (error) {
      setState({
        snackbarMsg: `${error.message} - Project Information Not Added`,
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

  const handleTeamNameInput = (e) => {
    setState({ teamName: e.target.value });
  };
  const handleProductNameInput = (e) => {
    setState({ productName: e.target.value });
  };
  const handleStartDateInput = (e) => {
    setState({ startDate: e.target.value });
  };
  const handleNumHoursStoryInput = (e) => {
    setState({ numHoursStoryPoint: e.target.value });
  };
  const handleEstimatedNumStoryPointsInput = (e) => {
    setState({ estimatedNumStoryPoints: e.target.value });
  };
  const handleEstimatedCostInput = (e) => {
    setState({ estimatedCost: e.target.value });
  };
  // const onChange = (e, selectedOption) => {
  //   setState({ estimatedNumStoryPoints: selectedOption });
  // };

  const emptyorundefined =
    state.teamName === undefined ||
    state.teamName === "" ||
    state.productName === undefined ||
    state.productName === "" ||
    state.startDate === undefined ||
    state.startDate === "" ||
    state.numHoursStoryPoint === undefined ||
    state.numHoursStoryPoint === "" ||
    state.estimatedNumStoryPoints === undefined ||
    state.estimatedNumStoryPoints === "" ||
    state.estimatedCost === undefined ||
    state.estimatedCost === "";

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
            Add New Project
          </Typography>
          <TextField
            onChange={handleTeamNameInput}
            placeholder="Team's name"
            value={state.teamName}
            style={{ width: "100%" }}
          />
          <TextField
            onChange={handleProductNameInput}
            placeholder="Product name"
            value={state.productName}
            style={{ width: "100%" }}
          />
          <TextField
            onChange={handleStartDateInput}
            placeholder="Start Date"
            value={state.startDate}
            style={{ width: "100%" }}
          />
          <TextField
            onChange={handleNumHoursStoryInput}
            placeholder="Number of Hours for the Story"
            value={state.numHoursStoryPoint}
            style={{ width: "100%" }}
          />
          <Autocomplete
            value={state.estimatedNumStoryPoints}
            onChange={(event, newValue) => {
              handleEstimatedNumStoryPointsInput({
                target: { value: newValue },
              });
            }}
            options={storyPointOptions}
            getOptionLabel={(option) => option.toString()}
            renderInput={(params) => (
              <TextField {...params} label="Estimated Number of Story Points" />
            )}
          />
          <TextField
            onChange={handleEstimatedCostInput}
            placeholder="Estimated Cost"
            value={state.estimatedCost}
            style={{ width: "100%" }}
          />
          <p></p>

          <Button
            color="primary"
            variant="contained"
            style={{ marginTop: 10 }}
            onClick={onAddClicked}
            disabled={emptyorundefined}
          >
            ADD PROJECT INFORMATION
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

export default AddProjectInfo;
