import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import List from "./components/List/List";
import Login from "./components/Login/Login";

import "./App.css";

function App() {
    return (
        <UserProvider>
            <div className="app">
                <Router>
                    <Switch>
                        <PrivateRoute exact path="/" component={List} />
                        <PublicRoute path="/login" component={Login} />
                    </Switch>
                </Router>
            </div>
        </UserProvider>
    );
}

export default App;
