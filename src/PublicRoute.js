// redirect if user is logged in
import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { Route, Redirect } from "react-router-dom";

function PublicRoute({ component: Component, ...rest }) {
    const { user } = useContext(UserContext);

    return (
        <Route
            {...rest}
            render={(routeProps) =>
                !!!user ? (
                    <Component {...routeProps} />
                ) : (
                    <Redirect to="/dashboard" />
                )
            }
        />
    );
}

export default PublicRoute;
