import React from "react";
import firebase from "firebase";
import fire from "../../firebase";
import Button from "@material-ui/core/Button";
import FacebookIcon from "@material-ui/icons/Facebook";

import "./Login.css";

function Login(props) {
    // make new facebook provider to login to the application
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
        display: "popup",
    });

    // handle user authentication when the user wanna sign in
    const handleLoginClick = async () => {
        fire.auth()
            .signInWithPopup(provider)
            .then((result) => {
                props.history.push("/");
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // display the login button
    return (
        <div className="login">
            <Button
                variant="contained"
                color="primary"
                className="login-button"
                startIcon={<FacebookIcon />}
                onClick={handleLoginClick}
            >
                Log in With Facebook
            </Button>
        </div>
    );
}

export default Login;
