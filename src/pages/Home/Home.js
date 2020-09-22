import React from "react";
import Button from "@material-ui/core/Button";

import { ReactComponent as HeroImage } from "../../images/hero.svg";

import "./Home.css";

function Home() {
    return (
        <div id="home">
            <div className="home container">
                <div className="top">
                    <div className="content">
                        <h1>
                            Organized <span>tasks</span> everywhere
                        </h1>
                        <p>
                            While using Done you will learn how to have happy
                            and well organized tasks, no matter where you are.
                            Stay organized and manage your day-to-day
                        </p>
                        <div className="buttons">
                            <Button variant="contained" color="primary">
                                Get started
                            </Button>
                            <Button variant="contained" color="secondary">
                                Learn more
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="img-container">
                        <HeroImage />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
