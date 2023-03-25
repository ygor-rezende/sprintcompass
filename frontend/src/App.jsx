import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import "./App.css";
import theme from "./theme.js";
import {
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import HomePage from "./Home";
import AddProjectInfo from "./AddProjectInfo";
import AddBacklogInfo from "./AddBacklogInfo";
import AddTeamMember from "./AddTeamMember";
import ListTeamMember from "./ViewTeamMembers";

const App = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Sprint Compass
            </Typography>
            <IconButton
              onClick={handleClick}
              color="inherit"
              style={{ marginLeft: "auto", paddingRight: "1vh" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={NavLink} to="/home" onClick={handleClose}>
                Home
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/addbasic"
                onClick={handleClose}
              >
                Capture Basic Story Information
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/addbacklog"
                onClick={handleClose}
              >
                Capture Backlog Information
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/addmember"
                onClick={handleClose}
              >
                Add Team Member
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/listmembers"
                onClick={handleClose}
              >
                View Team Members
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/addbasic" element={<AddProjectInfo />} />
          <Route path="/addbacklog" element={<AddBacklogInfo />} />
          <Route path="/addmember" element={<AddTeamMember />} />
          <Route path="/listmembers" element={<ListTeamMember />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
