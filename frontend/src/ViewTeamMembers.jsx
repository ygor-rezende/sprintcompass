import React, { useReducer, useEffect } from "react";
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

const ListTeamMember = () => {
  const initialState = {
    showMsg: false,
    snackbarMsg: "",
    teamMembers: [],
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

  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({
      showMsg: false,
    });
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
            Team Members:
          </Typography>

          <p></p>
          {state.teamMembers.map((element) => {
            return (
              <List>
                <ListItem alignItems="flex-start" key={element.firstName}>
                  <ListItemText
                    primary={`${element.firstName} ${element.lastName}`}
                  />
                </ListItem>
                <Divider />
              </List>
            );
          })}

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

export default ListTeamMember;
