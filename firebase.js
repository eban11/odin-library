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
let userId;

auth.onAuthStateChanged((user) => {
  if (user) {
    userId = user.uid;
  }
  setupUI(user);
});

const signInForm = document.querySelector("#signIn-form form");
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signInForm["login-email"].value;
  const password = signInForm["login-password"].value;

  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    signInForm.reset();
    signInForm.parentElement.classList.remove("form-container-active");
  });
});

const signUpForm = document.querySelector("#signUp-form form");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signUpForm["signUp-email"].value;
  const password = signUpForm["signUp-password"].value;

  auth.createUserWithEmailAndPassword(email, password).then((cred) => {
    signUpForm.reset();
    signUpForm.parentElement.classList.remove("form-container-active");
  });
});

document.querySelector("#logout-btn").addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut();
});
