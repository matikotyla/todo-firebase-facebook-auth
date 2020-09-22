import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

import { ReactComponent as RegisterImage } from "../../images/register.svg";

import "./Register.css";

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [terms, setTerms] = useState(false);

    return (
        <div id="register">
            <div className="register container">
                <div className="top">
                    <div className="content">
                        <h1>Create account</h1>
                        <p>Start your journey right now</p>
                        <form>
                            <div className="input">
                                <TextField
                                    id="standard-basic"
                                    label="First name"
                                    variant="outlined"
                                    type="text"
                                    value={firstName}
                                    // fullWidth
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                                <TextField
                                    id="standard-basic"
                                    label="Last name"
                                    variant="outlined"
                                    type="text"
                                    value={lastName}
                                    // fullWidth
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </div>
                            <div className="input">
                                <TextField
                                    id="standard-basic"
                                    label="Email address"
                                    variant="outlined"
                                    type="email"
                                    value={email}
                                    fullWidth
                                    onChange={(e) => setEmail(e.target.value)}
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
                            <div className="input">
                                <TextField
                                    id="standard-basic"
                                    label="Confirm password"
                                    variant="outlined"
                                    type="password"
                                    value={confirmPassword}
                                    fullWidth
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </div>
                            <div className="checkbox">
                                <Checkbox
                                    checked={terms}
                                    onChange={(e) => setTerms(e.target.checked)}
                                    inputProps={{
                                        "aria-label": "primary checkbox",
                                    }}
                                />
                                <p>I agree to the terms and Privacy Policy</p>
                            </div>
                            <div className="buttons">
                                <Button variant="contained" color="primary">
                                    Register
                                </Button>
                                <Button variant="contained" color="secondary">
                                    Back
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="bottom">
                    <div className="img-container">
                        <RegisterImage />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
