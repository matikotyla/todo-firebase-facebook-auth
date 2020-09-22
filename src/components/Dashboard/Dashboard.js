import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext";
import fire from "../../firebase";
import axios from "axios";

import MaterialTable from "material-table";

import "./Dashboard.css";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import AddIcon from "@material-ui/icons/Add";

import Loading from "../Loading/Loading";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: "auto",
        marginTop: "64px",
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing(3),
    },
    icon: {
        color: "black",
    },
}));

function Dashboard() {
    const classes = useStyles();

    const [data, setData] = useState(null);
    const [user, setUser] = useState(null);

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const [columns, setColumns] = useState([
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
    ]);

    const userContext = useContext(UserContext);

    // get user todos when component is mounted
    useEffect(() => {
        async function fetchData() {
            await getUserTodos();
        }
        fetchData();
    }, []);

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
                "http://localhost:5000/todo-a2508/europe-west1/api",
                {
                    headers: {
                        Authorization: `Bearer ${await getToken()}`,
                    },
                }
            );
            setUser(response.data.user);
            setData(response.data.projects);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    // add new todo to the database
    const onMyRowAdd = (newTodo) =>
        new Promise(async (resolve) => {
            axios
                .post(
                    "http://localhost:5000/todo-a2508/europe-west1/api/add",
                    {
                        project: project,
                        todo: newTodo.todo,
                        time: newTodo.time,
                        date: newTodo.date,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${await getToken()}`,
                        },
                    }
                )
                .then((res) => {
                    resolve();
                    setData((prevData) => {
                        let newData = [];
                        prevData.forEach((data) => {
                            newData.push({
                                name: data.name,
                                todos: [...data.todos],
                            });
                        });
                        newData[findProjectIndex()].todos.push(newTodo);
                        return newData;
                    });
                })
                .catch((err) => {
                    resolve();
                    console.error(err);
                });
        });

    const onMyRowUpdate = (newTodo, oldTodo) =>
        new Promise(async (resolve) => {
            axios
                .put(
                    "http://localhost:5000/todo-a2508/europe-west1/api/edit",
                    {
                        project: project,
                        index: oldTodo.tableData.id,
                        todo: newTodo.todo,
                        time: newTodo.time,
                        date: newTodo.date,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${await getToken()}`,
                        },
                    }
                )
                .then((res) => {
                    resolve();
                    if (oldTodo) {
                        setData((prevData) => {
                            let newData = [];
                            prevData.forEach((data) => {
                                newData.push({
                                    name: data.name,
                                    todos: [...data.todos],
                                });
                            });
                            let i = findProjectIndex();
                            newData[i].todos[
                                newData[i].todos.indexOf(oldTodo)
                            ] = newTodo;
                            return newData;
                        });
                        // setState((prevState) => {
                        //     const data = [...prevState.data];
                        //     data[data.indexOf(oldData)] = newData;
                        //     return { ...prevState, data };
                        // });
                    }
                })
                .catch((err) => {
                    resolve();
                    console.error(err);
                });
        });

    const onMyRowDelete = (oldTodo) =>
        new Promise(async (resolve) => {
            axios
                .delete(
                    "http://localhost:5000/todo-a2508/europe-west1/api/delete",
                    {
                        headers: {
                            Authorization: `Bearer ${await getToken()}`,
                        },
                        data: {
                            project: project,
                            todo: oldTodo.todo,
                            time: oldTodo.time,
                            date: oldTodo.date,
                        },
                    }
                )
                .then((res) => {
                    resolve();
                    setData((prevData) => {
                        let newData = [];
                        prevData.forEach((data) => {
                            newData.push({
                                name: data.name,
                                todos: [...data.todos],
                            });
                        });
                        let i = findProjectIndex();
                        newData[i].todos.splice(
                            newData[i].todos.indexOf(oldTodo),
                            1
                        );
                        return newData;
                    });
                    // setState((prevState) => {
                    //     const data = [...prevState.data];
                    //     data.splice(data.indexOf(oldData), 1);
                    //     return { ...prevState, data };
                    // });
                })
                .catch((err) => {
                    resolve();
                    console.error(err);
                });
        });

    const findProjectIndex = () => {
        for (var i = 0; i < data.length; i++) {
            if (data[i].name === project) {
                return i;
            }
        }
        return -1;
    };

    return loading ? (
        <Loading />
    ) : (
        <div className={classes.root}>
            {/* <CssBaseline /> */}
            {/* <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Clipped drawer
                    </Typography>
                </Toolbar>
            </AppBar> */}
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                {/* <Toolbar /> */}
                <div className={classes.drawerContainer}>
                    <List>
                        {data.map((project, index) => (
                            <ListItem
                                onClick={() => setProject(project.name)}
                                button
                                key={project.name}
                            >
                                <ListItemIcon className={classes.icon}>
                                    {index % 2 === 0 ? (
                                        <span role="img" aria-label="emoji">
                                            🏠
                                        </span>
                                    ) : (
                                        <span role="img" aria-label="emoji">
                                            🍔
                                        </span>
                                        // <MailIcon />
                                    )}
                                </ListItemIcon>
                                <ListItemText primary={project.name} />
                            </ListItem>
                        ))}
                        <ListItem
                            onClick={() => console.log("Add project!")}
                            button
                        >
                            <ListItemIcon className={classes.icon}>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText primary="Add new project" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        {["All mail", "Trash", "Spam"].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>
                                    {index % 2 === 0 ? (
                                        <InboxIcon />
                                    ) : (
                                        <MailIcon />
                                    )}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
            <main className={classes.content}>
                {/* <Toolbar /> */}
                {project && (
                    <div className="list">
                        <div className="table">
                            <MaterialTable
                                title={`Hi ${userContext.user.displayName}`}
                                columns={columns}
                                data={
                                    data ? data[findProjectIndex()].todos : []
                                }
                                editable={{
                                    onRowAdd: onMyRowAdd,
                                    onRowUpdate: onMyRowUpdate,
                                    onRowDelete: onMyRowDelete,
                                }}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
