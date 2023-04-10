import React, { useReducer, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
    Card,
    CardContent,
    Snackbar,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";
import image from "./sprintcompass.jpg";
import theme from "./theme";
import "./App.css";

const DisplayBacklog = () => {
    const initialState = {
        showMsg: false,
        snackbarMsg: "",
        stories: [],
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
                        User Stories
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ maxWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Relative Estimate</TableCell>
                                    <TableCell>Estimated Cost</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.stories.map((row) => (
                                    <TableRow key={parseInt(state.id++)}>
                                        <TableCell>
                                            {row.userStoryPortion}
                                        </TableCell>
                                        <TableCell>
                                            {row.priority}
                                        </TableCell>
                                        <TableCell>
                                            {row.relativeEstimate}
                                        </TableCell>
                                        <TableCell>
                                            {row.estimatedCost}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

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

export default DisplayBacklog;