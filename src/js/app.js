import firebaseConfig from "./firebaseConfig";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";

import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

import { validateSignInForm, removeErrorsOnInput } from "./signInValidation";
import {
  validateSignUpForm,
  removeSignUpErrorOnInput,
} from "./signUpvalidation";
import renderData from "./renderData";

// INITIALIZE FIREBASE
initializeApp(firebaseConfig);

// INITIALIZE AUTHENTICATION SERVICE
const authService = getAuth();

// INITIALIZE FIRESTORE DATABASE
const database = getFirestore();


// ACCESSING COUNTRIES COLLECTION
const countriesCollection = collection(database, "countries");
// SIGN IN FORM ELEMENTS
const emailInput = document.querySelector(".email");
const passwordInput = document.querySelector(".password");
const signInButton = document.querySelector(".sign-in-button");
const emailError = document.querySelector(".email-error");
const passwordError = document.querySelector(".password-error");
const signInForm = document.querySelector(".sign-in-form");
const errorMessage = document.querySelector('.error-message')
// SIGN UP FORM ELEMENTS

const signUpFirstname = document.querySelector(".firstname");
const signUpLastname = document.querySelector(".lastname");
const signUpEmail = document.querySelector(".sign-up-email");
const signUpPassword = document.querySelector(".sign-up-password");
const signUpButton = document.querySelector(".sign-up-button");
const signUpError = document.querySelector(".sign-up-error");
const signUpForm = document.querySelector(".sign-up-form");
const closeSignUpButton = document.querySelector(".signup-form__close");
const signUpFormContainer = document.querySelector(".sign-up-form-container");
const signUpFormOpen = document.querySelector(".signup-form__open");

// SIGN OUT FORM ELEMENTS
const signOutButton = document.querySelector(".sign-out-button");

const mainContentContainer = document.querySelector('.content-main-container');

// REMOVE SIGN IN FORM ERRORS ON INPUT
removeErrorsOnInput(emailInput, passwordInput, emailError, passwordError);

// // REMOVE SIGN UP FORM ERROR ON INPUT
signUpForm.addEventListener("input", () => {
  removeSignUpErrorOnInput(
    signUpFirstname.value.trim(),
    signUpLastname.value.trim(),
    signUpEmail.value.trim(),
    signUpPassword.value.trim(),
    signUpError
  );
});

// CLOSING THE SIGN UP FORM
closeSignUpButton.addEventListener("click", (e) => {
  e.preventDefault();
  signUpFormContainer.style.display = "none";
});
// OPENING THE SIGN UP FORM
signUpFormOpen.addEventListener("click", (e) => {
  e.preventDefault();
  signUpFormContainer.style.display = "block";
});
//HANDLE SIGN IN ACTION
signInButton.addEventListener("click", (e) => {
  e.preventDefault();
  const { signInFormStatus } = validateSignInForm(
    emailInput.value.trim(),
    passwordInput.value.trim(),
    emailError,
    passwordError
  );
  if (signInFormStatus()) {
    return;
  } else{
    signInuser();
  }
});

function signInuser() {
  const userEmail = emailInput.value.trim();
  const userPassword = passwordInput.value.trim();
  signInWithEmailAndPassword(authService, userEmail, userPassword).then(() => {
    signInForm.reset();
    signOutButton.style.display = "block";
    console.log("welcome back in!");
  }).catch(err =>{
    errorMessage.textContent = err.message
  })
}

// HANDLING SIGN UP ACION
function signUpUser(firstname, lastname, email, password) {
  const { signUpErrorStatus } = validateSignUpForm(
    signUpFirstname.value.trim(),
    signUpLastname.value.trim(),
    signUpEmail.value.trim(),
    signUpPassword.value.trim(),
    signUpError
  );
  if (signUpErrorStatus()) {
    return;
  } else {
    const newUser = {
      userFirstname: firstname.value.trim(),
      userLastname: lastname.value.trim(),
      userEmail: email.value.trim(),
      userPassword: password.value.trim(),
    };
    createUserWithEmailAndPassword(
      authService,
      newUser.userEmail,
      newUser.userPassword
    ).then(() => {
      signUpForm.reset();
      signUpFormContainer.style.display = 'none';
    });
  }
}
signUpButton.addEventListener("click", (e) => {
  e.preventDefault();
  signUpUser(signUpFirstname, signUpLastname, signUpEmail, signUpPassword);
});

//HANDLING SIGN OUT ACTION
function signOutUser() {
  signOut(authService).then(() => {
    signOutButton.style.display = "none";
    mainContentContainer.style.display = 'none';
    signInForm.style.display = 'flex';
    unsubscribeAuthStateListener();
  });
}

signOutButton.addEventListener("click", (e) => {
  e.preventDefault();
  signOutUser();
});



// SENDING THE HTTP REQUEST
async function fetchData() {
  const dataExists = await checkDataExists(); 
  if (!dataExists) { 
  const response = await fetch("https://restcountries.com/v3.1/region/Oceania");
  const data = await response.json();
  storeData(data);
  }
}


//STORE THE DATA IN FIRESTORE
async function storeData(data) {
  const countriesCollectionRef = collection(database, "countries");

  for (const country of data) {
    const newCountryData = {
      flag: country.flags.png,
      countryName: country.name.common,
      region: country.region,
      population: country.population,
    };
    
    // Add document one by one using addDoc
    await addDoc(countriesCollectionRef, newCountryData);
  }
}
// CHECKING IF THE DATA EXISTS IN THE COLLECTION
async function checkDataExists() {
  const countriesCollectionRef = collection(database, "countries");
  const snapshot = await getDocs(countriesCollectionRef);
  return !snapshot.empty;
}

let unsubscribeFromAuthState;

unsubscribeFromAuthState = onAuthStateChanged(authService, (user)=>{
  if(user){
    const countriesCollectionRef = collection(database, "countries");
    getDocs(countriesCollectionRef)
    .then( (snapshot) => {
      mainContentContainer.style.display = 'flex';
      fetchData();
      renderData(snapshot.docs)
      signInForm.style.display = 'none';
      signOutButton.style.display = 'block' 
    })
  } else {
    signOutButton.style.display = "none";
    mainContentContainer.style.display = 'none';
    signInForm.style.display = 'flex';
  }
})
function unsubscribeAuthStateListener() {
  if (unsubscribeFromAuthState) {
    unsubscribeFromAuthState();
  }
}