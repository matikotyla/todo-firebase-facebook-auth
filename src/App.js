import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import Register from "./pages/Register/Register";

import "./App.css";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#507DD7",
        },
    },
});

function App() {
    return (
        <UserProvider>
            <ThemeProvider theme={theme}>
                <div className="app">
                    <Router>
                        <Navbar />
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <PrivateRoute
                                path="/dashboard"
                                component={Dashboard}
                            />
                            <PublicRoute path="/login" component={Login} />
                            <PublicRoute
                                path="/register"
                                component={Register}
                            />
                        </Switch>
                    </Router>
                </div>
            </ThemeProvider>
        </UserProvider>
    );
}

export default App;
