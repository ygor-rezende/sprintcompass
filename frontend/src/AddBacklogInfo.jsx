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

const AddBacklogInfo = () => {
  const initialState = {
    showMsg: false,
    snackbarMsg: "",
    userStoryPortion: "",
    priority: "",
    relativeEstimate: "",
    relEstimatedCost: "",
    optionsKey: 1,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const priorityPointOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const onAddClicked = async () => {
    let backlogInfo = {
      userStoryPortion: state.userStoryPortion,
      priority: state.priority,
      relativeEstimate: state.relativeEstimate,
      relEstimatedCost: state.relEstimatedCost,
    };
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `mutation { addBacklog(userStoryPortion: "${backlogInfo.userStoryPortion}", priority: "${backlogInfo.priority}", relativeEstimate: ${backlogInfo.relativeEstimate}, estimatedCost: ${backlogInfo.relEstimatedCost}) {userStoryPortion, priority, relativeEstimate, estimatedCost}}`,
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
        snackbarMsg: `Added Backlog Information`,
        userStoryPortion: "",
        priority: "",
        relativeEstimate: "",
        relEstimatedCost: "",
        optionsKey: Math.random(),
      });
    } catch (error) {
      setState({
        snackbarMsg: `${error.message} - Backlog Information Not Added`,
        showMsg: true,
      });
    }
  };

  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({
      contactServer: false,
      showMsg: false,
    });
  };

  const handleUserStoryPortion = (e) => {
    setState({ userStoryPortion: e.target.value });
  };
  const handlePriorty = (e) => {
    setState({ priority: e.target.value });
  };
  const handleRelativeEstimate = (e) => {
    setState({ relativeEstimate: e.target.value });
  };
  const handleRelEstimatedCostInput = (e) => {
    setState({ relEstimatedCost: e.target.value });
  };
  const onChange = (e, selectedOption) => {
    setState({ estimatedNumStoryPoints: selectedOption });
  };

  const emptyorundefined =
    state.userStoryPortion === undefined ||
    state.userStoryPortion === "" ||
    state.relativeEstimate === undefined ||
    state.relativeEstimate === "" ||
    state.relEstimatedCost === undefined ||
    state.relEstimatedCost === "";

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
            Add Basic Story Information
          </Typography>
          <TextField
            onChange={handleUserStoryPortion}
            placeholder="User Story Description"
            value={state.userStoryPortion}
            style={{ width: "100%" }}
          />
          <Autocomplete
            key={state.optionsKey}
            value={state.priority}
            onChange={(event, newValue) => {
              handlePriorty({ target: { value: newValue } });
            }}
            options={priorityPointOptions}
            getOptionLabel={(option) => option.toString()}
            renderInput={(params) => (
              <TextField {...params} label="Priority Rating" />
            )}
          />
          <TextField
            onChange={handleRelativeEstimate}
            placeholder="Relative Estimate"
            value={state.relativeEstimate}
            style={{ width: "100%" }}
          />
          <TextField
            onChange={handleRelEstimatedCostInput}
            placeholder="Estimated Cost"
            value={state.relEstimatedCost}
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
            ADD BACKLOG INFORMATION
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

export default AddBacklogInfo;
