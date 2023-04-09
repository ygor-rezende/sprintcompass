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
  List,
  ListItemButton,
  ListItemText,
  Container,
} from "@mui/material";
import image from "./sprintcompass.jpg";
import theme from "./theme";
import "./App.css";

const AddSprint = () => {
  const initialState = {
    showMsg: false,
    snackbarMsg: "",
    stories: [],
    sprintName: "",
    sprintStatus: "Open",
    sprintStories: [],
    id: 0,
    selectedStory: "",
    listSelectedIndex: -1,
    optionskey: 1,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setState({
        showMsg: true,
        snackbarMsg: `Loading backlog items...`,
      });
      let response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query:
            "query { stories {userStoryPortion, priority, relativeEstimate, estimatedCost} }",
        }),
      });
      let json = await response.json();

      setState({
        stories: json.data.stories,
        showMsg: true,
        snackbarMsg: `Loaded ${state.stories.length} backlog items`,
      });
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading backlog data - ${error.message}`,
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

  const handleSprintNameInput = (e) => {
    setState({ sprintName: e.target.value });
  };

  const addSprintItem = () => {
    let storiesLeft = state.stories.filter(
      (story) => story != state.selectedStory
    );
    if (state.sprintStories.length > 0)
      setState({
        sprintStories: [...state.sprintStories, state.selectedStory],
        stories: storiesLeft,
        optionskey: Math.random(),
        selectedStory: "",
      });
    else
      setState({
        sprintStories: [state.selectedStory],
        stories: storiesLeft,
        optionskey: Math.random(),
        selectedStory: "",
      });
  };

  const handleUserStories = (e) => {
    setState({ selectedStory: e.target.value });
  };

  const handleListItemClick = (event, index) => {
    setState({ listSelectedIndex: index });
  };

  const removeStoryFromList = () => {
    //get the item to be removed from its index
    let userStory = state.sprintStories[state.listSelectedIndex];

    //remove story from sprintStories array by its index
    let newSprintStories = state.sprintStories.filter(
      (value, index) => index != state.listSelectedIndex
    );

    //add the item removed back into the stories array
    //and update the sprintstories list
    if (state.stories.length > 0)
      setState({
        stories: [...state.stories, userStory],
        optionskey: Math.random(),
        sprintStories: newSprintStories,
        listSelectedIndex: -1,
      });
    else
      setState({
        stories: [userStory],
        optionskey: Math.random(),
        sprintStories: newSprintStories,
        listSelectedIndex: -1,
      });
  };

  const saveSprint = async () => {
    let sprintItems = JSON.stringify(state.sprintStories);
    sprintItems = sprintItems.replaceAll('"', "'");
    let newSprint = {
      name: state.sprintName,
      status: state.sprintStatus,
      items: sprintItems.replace(/"([^"]+)":/g, "$1:"),
    };
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        //addSprint(name: String, status: String: items: [Backlog]): Sprint
        query: `mutation { addSprint(name: "${newSprint.name}", status: "${newSprint.status}", items: "${newSprint.items}") {name, status, items }}`,
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
        snackbarMsg: `Added Sprint Information`,
        name: "",
        country: "",
      });
    } catch (error) {
      setState({
        snackbarMsg: `${error.message} - Sprint Information Not Added`,
        showMsg: true,
      });
    }
  };

  const addItemToSprintCheck =
    state.sprintName === undefined ||
    state.sprintName === "" ||
    state.selectedStory === undefined ||
    state.selectedStory === "" ||
    state.selectedStory === null;

  const saveSprintCheck =
    state.sprintName === undefined ||
    state.sprintName === "" ||
    state.sprintStories.length < 1;

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
            Add Sprint
          </Typography>
          <TextField
            onChange={handleSprintNameInput}
            placeholder="Sprint Name"
            value={state.sprintName}
            style={{ width: "100%" }}
          />
          <Autocomplete
            key={state.optionskey}
            onChange={(event, newValue) => {
              handleUserStories({ target: { value: newValue } });
            }}
            options={state.stories}
            getOptionLabel={(option) => option.userStoryPortion}
            renderInput={(params) => (
              <TextField {...params} label="User Stories available" />
            )}
          />
          <Button
            color="primary"
            variant="contained"
            style={{ marginTop: 10 }}
            onClick={addSprintItem}
            disabled={addItemToSprintCheck}
          >
            Add Item To Sprint
          </Button>

          <Button
            color="primary"
            variant="contained"
            style={{ marginTop: 10 }}
            onClick={saveSprint}
            disabled={saveSprintCheck}
          >
            Save Sprint
          </Button>
          <Snackbar
            open={state.showMsg}
            message={state.snackbarMsg}
            autoHideDuration={4000}
            onClose={snackbarClose}
          />
        </CardContent>
      </Card>
      {state.sprintStories.length > 0 && (
        <Container>
          <Typography
            variant="h6"
            color="secondary"
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            Selected Stories
          </Typography>
          <List>
            {state.sprintStories.map((story, index) => (
              <ListItemButton
                key={index}
                selected={state.listSelectedIndex === index}
                onClick={(e) => handleListItemClick(event, index)}
              >
                <ListItemText primary={story.userStoryPortion} />
              </ListItemButton>
            ))}
          </List>
          <Button
            color="secondary"
            variant="contained"
            style={{ marginTop: 10 }}
            onClick={removeStoryFromList}
            disabled={state.listSelectedIndex < 0}
          >
            Remove story selected
          </Button>
        </Container>
      )}
    </ThemeProvider>
  );
};

export default AddSprint;
