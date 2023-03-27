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

const AddSprint = () => {
    const initialState = {
        showMsg: false,
        snackbarMsg: "",
        stories: [],
        sprintName: "",
        sprintStatus: "Open",
        sprintStories: [],
        id: 0,
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
                body: JSON.stringify({ query: "query { stories {userStoryPortion, priority, relativeEstimate, estimatedCost} }" }),
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

    const addSprintItem = async (e) => {
        state.sprintStories.push(e.target.value);
    }

    const addSprintComplete = async () => {
        let newSprint = {
            name: state.sprintName,
            status: state.sprintStatus,
            items: JSON.stringify(state.sprintStories),
        };
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        try {
            let query = JSON.stringify({
                //addSprint(name: String, status: String: items: [Backlog]): Sprint
                query: `mutation { addSprint(name: "${newSprint.name}", status: "${newSprint.status}", items: ${newSprint.items}) {name, status, items }}`,
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
    }

    const emptyorundefined =
        state.sprintName === undefined ||
        state.sprintName === "";

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
                        onChange={(event, newValue) => {
                            handlePriorty({ target: { value: newValue } });
                        }}
                        options={state.stories}
                        getOptionLabel={(option) => option.userStoryPortion}
                        renderInput={(params) => (
                            <TextField {...params} label="Backlog Items" />
                        )}
                    />
                    <Button
                        color="primary"
                        variant="contained"
                        style={{ marginTop: 10 }}
                        onClick={addSprintItem}
                        disabled={emptyorundefined}
                    >
                        Add Item To Sprint
                    </Button>

                    <Button
                        color="primary"
                        variant="contained"
                        style={{ marginTop: 10 }}
                        onClick={addSprintComplete}
                        disabled={emptyorundefined}
                    >
                        Create New Sprint
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

export default AddSprint;