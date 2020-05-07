const functions = require("firebase-functions");
const admin = require("firebase-admin");

// service account to test the firebase functions using firebase serve
const serviceAccount = require("./serviceAccountKey.json");

// initialize firebase application using given credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://todo-49517.firebaseio.com",
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
        origin: ["http://localhost:3000", "http://your-production-website.com"],
    })
);

// get user todos
app.get("/", firebaseAuth, (req, res) => {
    db.collection("/users")
        .doc(req.user.uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(200).json(doc.data());
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
    const { todo, time, date } = req.body;

    // check if document with given id exists
    db.collection("/users")
        .doc(req.user.uid)
        .get()
        .then((doc) => {
            // if the doc with given user uid exists, add new todo to the todos array
            if (doc.exists) {
                doc.ref.update({
                    todos: admin.firestore.FieldValue.arrayUnion({
                        todo,
                        time,
                        date,
                    }),
                });
                return res.status(200).json("Todo added");
                // if the doc with given user uid does not exist, create new doc, add new todos array and username
            } else {
                doc.ref.set({
                    todos: [
                        {
                            todo,
                            time,
                            date,
                        },
                    ],
                    user: req.user.name,
                });
                return res.status(200).json("Doc created and todo added");
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
    const { index, todo, time, date } = req.body;

    // check if the document with given id exists, if there is a given todo with index
    db.collection("/users")
        .doc(req.user.uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
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
                return res.status(400).json("Invalid user uid");
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json(err);
        });
});

app.delete("/delete", firebaseAuth, (req, res) => {
    // get todo index
    const { todo, time, date } = req.body;

    // check if the document with given id exists
    db.collection("/users")
        .doc(req.user.uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                // delete the object from array
                doc.ref.update({
                    todos: admin.firestore.FieldValue.arrayRemove({
                        todo,
                        time,
                        date,
                    }),
                });
                return res.status(200).json("Todo removed");
            } else {
                return res.status(400).json("Invalid user uid");
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json(err);
        });
});

exports.api = functions.region("europe-west1").https.onRequest(app);
