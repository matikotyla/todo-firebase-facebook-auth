import React, { useState } from "react";
import firebase from "firebase";
import fire from "../../firebase";
import FacebookIcon from "@material-ui/icons/Facebook";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { ReactComponent as LoginImage } from "../../images/login.svg";

import "./Login.css";

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // make new facebook provider to login to the application
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
        display: "popup",
    });

    const handleLoginWithEmailAndPasswordClick = async (e) => {
        e.preventDefault();
        setLoading(true);

        fire.auth()
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                setLoading(false);
                props.history.push("/dashboard");
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    // handle user authentication when the user wanna sign in
    const handleLoginClick = async () => {
        fire.auth()
            .signInWithPopup(provider)
            .then((result) => {
                props.history.push("/dashboard");
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // display the login button
    return (
        // <div className="login">
        //     <Button
        //         variant="contained"
        //         color="primary"
        //         className="login-button"
        //         startIcon={<FacebookIcon />}
        //         onClick={handleLoginClick}
        //     >
        //         Log in With Facebook
        //     </Button>
        // </div>
        <div id="login">
            <div className="login container">
                <div className="top">
                    <div className="content">
                        <div className="content">
                            <h1>Login now</h1>
                            <p>Complete every task</p>
                            <form
                                onSubmit={(e) =>
                                    handleLoginWithEmailAndPasswordClick(e)
                                }
                            >
                                <div className="input">
                                    <TextField
                                        id="standard-basic"
                                        label="Email address"
                                        variant="outlined"
                                        type="email"
                                        value={email}
                                        fullWidth
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="input">
                                    <TextField
                                        id="standard-basic"
                                        label="Password"
                                        variant="outlined"
                                        type="password"
                                        value={password}
                                        fullWidth
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="checkbox">
                                    <p>
                                        Forgot password? <span>Click here</span>
                                    </p>
                                </div>
                                <div className="buttons">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Back
                                    </Button>
                                </div>
                            </form>
                            <div className="divider-container">
                                <p className="text">or sign in with</p>
                                <div className="divider"></div>
                            </div>
                            <Button
                                variant="contained"
                                color="primary"
                                className="login-button"
                                startIcon={<FacebookIcon />}
                                onClick={handleLoginClick}
                                fullWidth
                            >
                                Facebook
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="img-container">
                        <LoginImage />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
