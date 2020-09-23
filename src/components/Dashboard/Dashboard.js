import React, { useState, useEffect, useContext, Fragment } from "react";
import { UserContext } from "../../UserContext";
import fire from "../../firebase";
import axios from "axios";

import MaterialTable from "material-table";

import "./Dashboard.css";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import Loading from "../Loading/Loading";

import InboxIcon from "@material-ui/icons/MoveToInbox";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import StarBorder from "@material-ui/icons/StarBorder";
import BugReportIcon from "@material-ui/icons/BugReport";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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
    nested: {
        paddingLeft: theme.spacing(4),
    },
    container: {
        display: "flex",
        flexWrap: "wrap",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

function Dashboard() {
    const classes = useStyles();

    const [data, setData] = useState(null);
    const [user, setUser] = useState(null);

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isTableLoading, setIsTableLoading] = useState(false);

    const [openAdd, setOpenAdd] = useState(false);
    const [openManage, setOpenManage] = useState(false);

    const handleOpenAddClick = () => setOpenAdd(true);
    const handleCloseAddClick = () => setOpenAdd(false);
    const handleOpenManageClick = () => setOpenManage(!openManage);

    // change to icon
    const [age, setAge] = React.useState("");

    const handleChange = (event) => {
        setAge(Number(event.target.value) || "");
    };

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
                                todos: data.todos ? [...data.todos] : [],
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

    const deleteProject = async (project) => {
        setIsTableLoading(true);
        try {
            // const response =
            await axios.delete(
                "http://localhost:5000/todo-a2508/europe-west1/api/deleteProject",
                {
                    headers: {
                        Authorization: `Bearer ${await getToken()}`,
                    },
                    data: {
                        project,
                    },
                }
            );
            setProject(null);
            // set data, remove project from state
            let newData = data.filter((proj) => proj.name !== project);
            setData(newData);
            setOpenManage(false);
            setIsTableLoading(false);
        } catch (err) {
            console.log(err);
            setIsTableLoading(false);
        }
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
                        {data.map((proj, index) => (
                            <ListItem
                                selected={project === proj.name}
                                onClick={() => setProject(proj.name)}
                                button
                                key={proj.name}
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
                                <ListItemText primary={proj.name} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        <ListItem button onClick={handleOpenAddClick}>
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText primary="Add project" />
                            {/* {openAdd ? <ExpandLess /> : <ExpandMore />} */}
                        </ListItem>
                        <Dialog
                            disableBackdropClick
                            disableEscapeKeyDown
                            open={openAdd}
                            onClose={handleCloseAddClick}
                        >
                            <DialogTitle>Fill the form</DialogTitle>
                            <DialogContent>
                                <form className={classes.container}>
                                    <FormControl
                                        className={classes.formControl}
                                    >
                                        <InputLabel htmlFor="demo-dialog-native">
                                            Age
                                        </InputLabel>
                                        <Select
                                            native
                                            value={age}
                                            onChange={handleChange}
                                            input={
                                                <Input id="demo-dialog-native" />
                                            }
                                        >
                                            <option
                                                aria-label="None"
                                                value=""
                                            />
                                            <option value={10}>Ten</option>
                                            <option value={20}>Twenty</option>
                                            <option value={30}>Thirty</option>
                                        </Select>
                                    </FormControl>
                                    <FormControl
                                        className={classes.formControl}
                                    >
                                        <InputLabel id="demo-dialog-select-label">
                                            Age
                                        </InputLabel>
                                        <Select
                                            labelId="demo-dialog-select-label"
                                            id="demo-dialog-select"
                                            value={age}
                                            onChange={handleChange}
                                            input={<Input />}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>
                                                Twenty
                                            </MenuItem>
                                            <MenuItem value={30}>
                                                Thirty
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={handleCloseAddClick}
                                    color="primary"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCloseAddClick}
                                    color="primary"
                                >
                                    Ok
                                </Button>
                            </DialogActions>
                        </Dialog>
                        {/* <Collapse in={openAdd} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested}>
                                    <ListItemIcon>
                                        <StarBorder />
                                    </ListItemIcon>
                                    <ListItemText primary="Starred" />
                                </ListItem>
                            </List>
                        </Collapse> */}
                        {project && (
                            <Fragment>
                                <ListItem
                                    button
                                    onClick={handleOpenManageClick}
                                >
                                    <ListItemIcon>
                                        <BugReportIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Manage project" />
                                    {openManage ? (
                                        <ExpandLess />
                                    ) : (
                                        <ExpandMore />
                                    )}
                                </ListItem>
                                <Collapse
                                    in={openManage}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <List component="div" disablePadding>
                                        <ListItem
                                            button
                                            className={classes.nested}
                                            onClick={() =>
                                                deleteProject(project)
                                            }
                                        >
                                            <ListItemIcon>
                                                <DeleteOutlineIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Delete" />
                                        </ListItem>
                                    </List>
                                </Collapse>
                            </Fragment>
                        )}
                        {/* {["All mail", "Trash", "Spam"].map((text, index) => (
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
                        ))} */}
                    </List>
                </div>
            </Drawer>
            <main className={classes.content}>
                {/* <Toolbar /> */}
                {project && (
                    <div className="list">
                        <div className="table">
                            <MaterialTable
                                isLoading={isTableLoading}
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
