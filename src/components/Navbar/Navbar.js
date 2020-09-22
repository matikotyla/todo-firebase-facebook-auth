import React, { useContext } from "react";
import fire from "../../firebase";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { UserContext } from "../../UserContext";

import { ReactComponent as Logo } from "../../images/logo.svg";
import { ReactComponent as LogoDashboard } from "../../images/logo-dashboard.svg";

import "./Navbar.css";

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
}));

function Navbar(props) {
    const { user } = useContext(UserContext);

    const classes = useStyles();

    // handle user logout
    const handleLogout = async () => {
        try {
            await fire.auth().signOut();
        } catch (err) {
            console.log(err);
        }
    };

    return !user ? (
        <div id="navbar">
            <div className="navbar">
                <AppBar className="appbar" position="static">
                    <Toolbar className="toolbar container">
                        <div className="content content-left">
                            <Link to="/" className="logo">
                                <Logo width={24} />
                                <h1>Done</h1>
                            </Link>
                        </div>
                        <div className="content content-middle">
                            <Link to="/">
                                <Button color="inherit">Home</Button>
                            </Link>
                            <Link to="/about">
                                <Button color="inherit">About Us</Button>
                            </Link>
                            <Link to="/pricing">
                                <Button color="inherit">Pricing</Button>
                            </Link>
                            <Link to="/contact">
                                <Button color="inherit">Contact</Button>
                            </Link>
                        </div>
                        <div className="content content-right">
                            <Link to="/login">
                                <Button color="primary">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button color="secondary">Register</Button>
                            </Link>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        </div>
    ) : (
        <div id="navbar">
            <div className="navbar">
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar style={{ width: "initial" }} className="toolbar">
                        <div className="content content-left">
                            <Link to="/" className="logo">
                                <LogoDashboard width={24} />
                                <h1 style={{ color: "white" }}>Done</h1>
                            </Link>
                        </div>
                        <div className="content content-right">
                            <Link to="/dashboard">
                                <Button
                                    style={{ color: "white" }}
                                    color="inherit"
                                >
                                    Dashboard
                                </Button>
                            </Link>

                            <Button
                                style={{
                                    color: "white",
                                }}
                                color="inherit"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
            <div
                style={{
                    width: "100%",
                    height: "64px",
                }}
                className="hide"
            ></div>
        </div>
    );
}

export default Navbar;
