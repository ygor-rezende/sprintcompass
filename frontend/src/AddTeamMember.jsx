import React, { useReducer, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
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
import TeamMember from "./components/teamMemberClass";

const AddTeamMember = () => {
  const initialState = {
    showMsg: false,
    snackbarMsg: "",
    firstName: "",
    lastName: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const onAddClicked = async () => {
    let member = new TeamMember(state.firstName, state.lastName);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `mutation {addMember(firstName: "${member.firstName}", lastName: "${member.lastName}"){firstName, lastName} }`,
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
        snackbarMsg: `Member ${member.firstName} added.`,
        firstName: "",
        lastName: "",
      });
    } catch (error) {
      setState({
        snackbarMsg: `${error.message} - Member Not Added`,
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

  const handlefirstNameInput = (e) => {
    setState({ firstName: e.target.value });
  };
  const handleLastNameInput = (e) => {
    setState({ lastName: e.target.value });
  };

  const emptyorundefined =
    state.firstName === undefined ||
    state.firstName === "" ||
    state.lastName === undefined ||
    state.lastName === "";

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
            Add a Team Member
          </Typography>
          <TextField
            onChange={handlefirstNameInput}
            placeholder="First name"
            value={state.firstName}
            style={{ width: "100%" }}
          />

          <TextField
            onChange={handleLastNameInput}
            placeholder="Last name"
            value={state.lastName}
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
            ADD TEAM MEMBER
          </Button>
          <Snackbar
            open={state.showMsg}
            message={state.snackbarMsg}
            autoHideDuration={4000}
            onClose={snackbarClose}
          />
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default AddTeamMember;
