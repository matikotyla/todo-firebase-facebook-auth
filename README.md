# Todo with Firebase functions and Facebook authentication

This is a Todo application with firebase functions and facebook authentication. You may view, add, edit or delete your tasks you wanna do. You can also group your task in different projects, so they are easier to maintain. Everything is connected to the firebase and is stored with firestore. Your changes are immediately visible in the firebase databse. To log in to application you have to authenticate yourself with facebook.

<!-- The email and password authentication is not ready yet, so you must authenticate yourself using your facebook account. Email and password authentication will be provided soon! -->

## Live Demo

You may check the live demo of this application, simply click the link below
[link to application!](https://gallant-golick-d31a4e.netlify.app/)

You can log in to the application using your facebook account, but if you want, you can also use the user, made specially for this purpose, so you can easier see how the application looks like, just go to login section and fill in the form using this data

```
email: user@email.com
password: 123456
```

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
Lottie
```

## Implemented functionalities

This application was made to help you maintain your task. Now you can group your tasks in different projects, so they it's easier to keep tracking them

![](https://github.com/maticoder/todo-firebase-facebook-auth/blob/master/images/work.gif)

The whole project is connected to the firebase cloud, so the changes are immediately visible in the databse (of course once, the request is processed by the cloud servers), you can see this on the gif below

![](https://github.com/maticoder/todo-firebase-facebook-auth/blob/master/images/change.gif)

You can also sort the data stored in the table, so it's easier to find the task you are looking for, as can be seen below

![](https://github.com/maticoder/todo-firebase-facebook-auth/blob/master/images/sort.gif)

## How to start using this app?

To start using this application you have to clone or download this repository using

```
git clone https://github.com/maticoder/todo-firebase-facebook-auth
```

command

next you have to install all required node modules using

```
npm install
cd functions
npm install
```

you also have to set your own firebase application up, with facebook authentication, cloud firestore and firebase functions. Provide your own `serviceAccountKey.json` file in the `functions` directory in order to run your application. You also have to create `config.js` file in `src` directory, put there your firebase config. Next you need to deploy firebase functions, using

```
firebase deploy
```

in `functions` directory, make sure that you have `firebase-tools` installed, using following command

```
npm install -g firebase-tools
```

now you just have to run application using

```
npm start
```

remember to make sure that you have got your own firebase project. As I mentioned before, you have to change `config.js` file with your firebase config data and `serviceAccountKey.json` with your key to make this application work properly. You have to also change url to fetch data from firebase to your own url.

<!-- ## How does it look like?

You may also see the application here, but I highly recommend you use the live demo mentioned above

![](https://github.com/maticoder/todo-firebase-facebook-auth/blob/master/how.gif) -->
