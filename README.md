# Todo with Firebase functions and Facebook authentication

This is a Todo application with firebase functions and facebook authentication. You may view, add, edit or delete your tasks you wanna do. Everything is connected to the firebase and is stored with firestore. To log in to application you have to authenticate yourself with facebook.

## Stack

```
React
Firebase
Express
Firestore
React Router
Firebase functions
Facebook authentication
Material UI
```

## How to start using this app?

To start using this application you have to clone or download this repository using

```
git clone https://github.com/maticoder/todo-firebase-facebook-auth
```

command

next you have to install all required node modules using

```
npm install
```

now you just have to run application using

```
firebase serve
npm start
```

make also sure that you have got your own firebase project. You have to change firebase.js file with your firebaseConfig and serviceAccountKey.json with your key to make this application work properly. You have to also change url to fetch data from firebase to your own url.

## How does it look like?

![](https://github.com/maticoder/todo-firebase-facebook-auth/blob/master/how.gif)
