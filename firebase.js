var firebaseConfig = {
  apiKey: "AIzaSyCiyTfHz3syINWxcz8hM9Kri6iZb-JgfwE",
  authDomain: "odin-library-46ed9.firebaseapp.com",
  databaseURL: "https://odin-library-46ed9.firebaseio.com",
  projectId: "odin-library-46ed9",
  storageBucket: "odin-library-46ed9.appspot.com",
  messagingSenderId: "297060438464",
  appId: "1:297060438464:web:e4cd869a7e91dd2ea0f825",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

function signIn(e) {
  e.preventDefault();
  console.log("Signed in");
}

function signUp(e) {
  e.preventDefault();
  console.log("Signed up");
}
