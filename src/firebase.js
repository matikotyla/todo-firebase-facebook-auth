import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {};

const fire = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

// export const firestore = firebase.firestore();

export default fire;
