import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext";
import fire from "../../firebase";
import axios from "axios";

import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";

import BugReportIcon from "@material-ui/icons/BugReport";

import "./List.css";

function List() {
    const [state, setState] = React.useState({
        columns: [
            {
                title: "Task",
                field: "todo",
                render: (rowData) => (
                    <div>
                        <span>{rowData.todo}</span>
                    </div>
                ),
            },
            {
                title: "Time",
                field: "time",
                type: "time",
                width: 120,
            },
            {
                title: "Date",
                field: "date",
                type: "date",
                width: 100,
            },
        ],
        data: [],
    });

    const userContext = useContext(UserContext);

    // get user todos when component is mounted
    useEffect(() => {
        async function fetchData() {
            await getUserTodos();
        }
        fetchData();
    }, []);

    // handle user logout
    const handleLogout = async () => {
        try {
            await fire.auth().signOut();
        } catch (err) {
            console.log(err);
        }
    };

    // get user token to authorize user requests
    const getToken = async () => {
        try {
            const token = await fire.auth().currentUser.getIdToken();
            return token;
        } catch (err) {
            return null;
        }
    };

    // get user todos
    const getUserTodos = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/todo-49517/europe-west1/api",
                {
                    headers: {
                        Authorization: `Bearer ${await getToken()}`,
                    },
                }
            );
            setState({ ...state, data: response.data.todos });
        } catch (err) {
            console.error(err);
        }
    };

    // add new todo to the database
    const onMyRowAdd = (newData) =>
        new Promise(async (resolve) => {
            axios
                .post(
                    "http://localhost:5000/todo-49517/europe-west1/api/add",
                    {
                        todo: newData.todo,
                        time: newData.time,
                        date: newData.date,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${await getToken()}`,
                        },
                    }
                )
                .then((res) => {
                    resolve();
                    setState((prevState) => {
                        const data = [...prevState.data];
                        data.push(newData);
                        return { ...prevState, data };
                    });
                })
                .catch((err) => {
                    resolve();
                    console.error(err);
                });
        });

    const onMyRowUpdate = (newData, oldData) =>
        new Promise(async (resolve) => {
            axios
                .put(
                    "http://localhost:5000/todo-49517/europe-west1/api/edit",
                    {
                        index: oldData.tableData.id,
                        todo: newData.todo,
                        time: newData.time,
                        date: newData.date,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${await getToken()}`,
                        },
                    }
                )
                .then((res) => {
                    resolve();
                    if (oldData) {
                        setState((prevState) => {
                            const data = [...prevState.data];
                            data[data.indexOf(oldData)] = newData;
                            return { ...prevState, data };
                        });
                    }
                })
                .catch((err) => {
                    resolve();
                    console.error(err);
                });
        });

    const onMyRowDelete = (oldData) =>
        new Promise(async (resolve) => {
            axios
                .delete(
                    "http://localhost:5000/todo-49517/europe-west1/api/delete",
                    {
                        headers: {
                            Authorization: `Bearer ${await getToken()}`,
                        },
                        data: {
                            todo: oldData.todo,
                            time: oldData.time,
                            date: oldData.date,
                        },
                    }
                )
                .then((res) => {
                    resolve();
                    setState((prevState) => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        return { ...prevState, data };
                    });
                })
                .catch((err) => {
                    resolve();
                    console.error(err);
                });
        });

    return (
        <div className="list">
            <div className="table">
                <MaterialTable
                    title={`Hi ${userContext.user.displayName}`}
                    columns={state.columns}
                    data={state.data}
                    editable={{
                        onRowAdd: onMyRowAdd,
                        onRowUpdate: onMyRowUpdate,
                        onRowDelete: onMyRowDelete,
                    }}
                />
            </div>
            <Button
                onClick={handleLogout}
                variant="contained"
                color="secondary"
                startIcon={<BugReportIcon />}
                className="logout-button"
            >
                Logout
            </Button>
        </div>
    );
}

export default List;
