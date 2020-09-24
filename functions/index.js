const firebase = require("firebase");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// service account to test the firebase functions using firebase serve
const serviceAccount = require("./serviceAccountKey.json");

const config = require("./config");

firebase.initializeApp(config);

// initialize firebase application using given credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://todo-a2508.firebaseio.com",
});

// access to the firestore
const db = admin.firestore();

// express app
const app = require("express")();

// cors policy
const cors = require("cors");

// check if user is a valid user with valid token
const firebaseAuth = (req, res, next) => {
    let idToken;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
        console.error("No token found");
        return res.status(403).json({
            error: "Unauthorized user",
        });
    }

    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            // add user credentials to req.user
            req.user = decodedToken;

            // invoke next function
            return next();
        })
        .catch((err) => {
            console.error(err);
            return res.status(403).json(err);
        });
};

// add cors policy to express application
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000", "https://todo-maticoder.netlify.app"],
    })
);

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
};

const isEmpty = (string) => {
    if (string === null || string.trim() === "") return true;
    else return false;
};

// register user
app.post("/register", (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    let errors = {};

    if (isEmpty(firstName)) {
        errors.firstName = "first name must not be empty";
    }

    if (isEmpty(lastName)) {
        errors.lastName = "last name must not be empty";
    }

    if (isEmpty(email)) {
        errors.email = "must not be empty";
    } else if (!isEmail(email)) {
        errors.email = "must be a valid email address";
    }

    if (isEmpty(password)) errors.password = "must not be empty";
    if (password !== confirmPassword) {
        errors.confirmPassword = "passwords must match";
    }

    const valid = Object.keys(errors).length === 0 ? true : false;

    if (!valid) return res.status(400).json(errors);

    let token, userId;
    // const newUser = {
    //     user: `${firstName} ${lastName}`,
    //     email,
    //     password,
    //     confirmPassword,
    // };

    // check if the email exists
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            return firebase.auth().currentUser.updateProfile({
                displayName: `${firstName} ${lastName}`,
            });
        })
        .then(() => {
            const userData = {
                user: `${firstName} ${lastName}`,
            };
            return db.doc(`/users/${userId}`).set(userData);
        })
        .then(() => {
            return db.doc(`/users/${userId}`).collection("/projects");
        })
        .then(() => {
            return res.status(201).json({
                token,
            });
        })
        .catch((err) => {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                return res.status(400).json({
                    email: "Email already in use",
                });
            } else {
                return res.status(500).json({
                    general: "Something went wrong",
                });
            }
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    let errors = {};

    if (isEmpty(email)) {
        errors.email = "must not be empty";
    } else if (!isEmail(email)) {
        errors.email = "must be a valid email address";
    }

    if (isEmpty(password)) errors.password = "must not be empty";

    const valid = Object.keys(errors).length === 0 ? true : false;

    if (!valid) return res.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((data) => {
            // console.log(firebase.auth().currentUser.displayName);
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({
                token,
            });
        })
        .catch((err) => {
            console.error(err);
            if (err.code === "auth/wrong-password") {
                return res.status(403).json({
                    general: "Wrong credentials",
                });
            } else {
                return res.status(500).json({
                    general: "Something went wrong",
                });
            }
        });
});

// get user todos
app.get("/", firebaseAuth, (req, res) => {
    db.collection("/users")
        .doc(req.user.uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                doc.ref
                    .collection("projects")
                    .get()
                    .then((snapshot) => {
                        let data = {
                            user: doc.data().user,
                            projects: [],
                        };
                        snapshot.forEach((doc) => {
                            data.projects.push(doc.data());
                        });
                        return res.status(200).json(data);
                    })
                    .catch((err) => {
                        return res.status(500).json("Something went wrong");
                    });
            } else {
                return res.status(400).json("Invalid uid");
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json(err);
        });
});

// add new todo
app.post("/add", firebaseAuth, (req, res) => {
    // get todo
    const { project, todo, time, date } = req.body;

    // check if document with given id exists
    db.collection("/users")
        .doc(req.user.uid)
        .get()
        .then((doc) => {
            // if the doc with given user uid exists, add new todo to the todos array
            if (doc.exists) {
                // check if the given project exists
                doc.ref
                    .collection("/projects")
                    .where("name", "==", project)
                    .get()
                    .then((query) => {
                        if (query.docs.length > 0) {
                            // project exists
                            query.docs[0].ref.update({
                                todos: admin.firestore.FieldValue.arrayUnion({
                                    todo,
                                    time,
                                    date,
                                }),
                            });
                        } else {
                            // project does not exist
                            doc.ref.collection("/projects").add({
                                name: project,
                                todos: [
                                    {
                                        todo,
                                        time,
                                        date,
                                    },
                                ],
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(400).json("Invalid data");
                    });

                return res.status(200).json("Todo added");
                // if the doc with given user uid does not exist, create new doc, add new projects and new todos array and username
            } else {
                doc.ref.set({
                    user: req.user.name,
                });
                doc.ref
                    .collection("/projects")
                    .add({
                        name: project,
                        todos: [
                            {
                                todo,
                                time,
                                date,
                            },
                        ],
                    })
                    .then(() => {
                        return res
                            .status(200)
                            .json("Doc created and project with todo added");
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(400).json("Invalid data");
                    });
            }
        })
        .catch((err) => {
            // catch if there is an error
            console.error(err);
            return res.status(500).json(err);
        });
});

// edit existing todo
app.put("/edit", firebaseAuth, (req, res) => {
    // get todo
    const { project, index, todo, time, date } = req.body;

    // check if the document with given id exists, if there is a given todo with index
    db.collection("/users")
        .doc(req.user.uid)
        .collection("/projects")
        .where("name", "==", project)
        .get()
        .then((snapshot) => {
            if (snapshot.docs.length > 0) {
                const doc = snapshot.docs[0];
                let data = doc.data().todos;
                data[index] = {
                    todo,
                    time,
                    date,
                };
                doc.ref.update({
                    todos: data,
                });
                return res.status(200).json("Todo edited successfully");
            } else {
                return res.status(400).json("Invalid project name");
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json(err);
        });
});

app.delete("/delete", firebaseAuth, (req, res) => {
    // get todo index
    const { project, todo, time, date } = req.body;

    // check if the document with given id exists
    db.collection("/users")
        .doc(req.user.uid)
        .collection("projects")
        .where("name", "==", project)
        .get()
        .then((snapshot) => {
            if (snapshot.docs.length > 0) {
                const doc = snapshot.docs[0];
                doc.ref.update({
                    todos: admin.firestore.FieldValue.arrayRemove({
                        todo,
                        time,
                        date,
                    }),
                });
                return res.status(200).json("Todo removed");
            } else {
                return res.status(400).json("Invalid project name");
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json(err);
        });
});

app.post("/addProject", firebaseAuth, (req, res) => {
    const { project, icon } = req.body;

    // check if the user exists
    db.collection("/users")
        .doc(req.user.uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                doc.ref
                    .collection("projects")
                    .where("name", "==", project)
                    .get()
                    .then((snapshot) => {
                        if (snapshot.docs.length > 0) {
                            return res.status(400).json("Project exists");
                        } else {
                            // add new project
                            doc.ref.collection("projects").add({
                                name: project,
                                icon: icon,
                                todos: [],
                            });
                            return res.status(200).json("Project added");
                        }
                    });
            } else {
                return res.status(400).json("Invalid uid");
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json(err);
        });
});

app.delete("/deleteProject", firebaseAuth, (req, res) => {
    const { project } = req.body;

    db.collection("/users")
        .doc(req.user.uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                doc.ref
                    .collection("projects")
                    .where("name", "==", project)
                    .get()
                    .then((snapshot) => {
                        if (snapshot.docs.length > 0) {
                            // delete project
                            snapshot.docs[0].ref
                                .delete()
                                .then(() => {
                                    return res
                                        .status(200)
                                        .json("Project deleted");
                                })
                                .catch((err) => {
                                    console.log(err);
                                    return res.status(500).json(err);
                                });
                        } else {
                            return res
                                .status(404)
                                .json("Project does not exist");
                        }
                    });
            } else {
                return res.status(400).json("Invalid uid");
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
});

exports.api = functions.region("europe-west1").https.onRequest(app);
