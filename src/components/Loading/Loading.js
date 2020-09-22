import React from "react";
import Lottie from "react-lottie";

import * as animationData from "../../images/data.json";

import "./Loading.css";

function Loading() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData.default,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
        },
    };

    return (
        <div className="loading">
            <Lottie options={defaultOptions} isClickToPauseDisabled={true} />
            <p>This guy is working really hard, to collect your data</p>
        </div>
    );
}

export default Loading;
