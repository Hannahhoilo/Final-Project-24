import firebaseConfig from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

/* INITIALIZE FIREBASE */
initializeApp(firebaseConfig);

/* INITIALIZE AUTH SERVICE */
const authService = getAuth();

/* INITIALIZE FIRESTORE DATABASE */
const database = getFirestore();

/* ACCESS THE COUNTRIES COLLECTION IN FIRESTORE */
const videoGamesCollection = collection(database, "videoGames");

import { validateSignInForm } from "./signInValidation";
import { validateSignUpForm } from "./signUpValidation";
import renderData from "./renderData";

let fetchedGameData = [];

/* SELECTING THE SIGN IN FORM ELEMENTS */
const emailInput = document.querySelector(".email");
const passwordInput = document.querySelector(".password");
const signInButton = document.querySelector(".sign-in-button");
const emailError = document.querySelector(".email-error");
const passwordError = document.querySelector(".password-error");
const signInForm = document.querySelector(".sign-in-form");
const submissionError = document.querySelector(".submission-error");

const welcomeHeaderAndText = document.querySelector(".welcome");

/* SELECTING SIGN UP FORM ELEMENTS */
const signUpFirstname = document.querySelector(".firstname");
const signUpLastname = document.querySelector(".lastname");
const signUpEmail = document.querySelector(".sign-up-email");
const signUpPassword = document.querySelector(".sign-up-password");
const signUpError = document.querySelector(".sign-up-error");
const signUpForm = document.querySelector(".sign-up-form");
const closeSignUpFormButton = document.querySelector(".sign-up-form__close");
const openSignUpFormButton = document.querySelector(".sign-up-form__open");
const signUpFormContainer = document.querySelector(".sign-up-form-container");
const signUpButton = document.querySelector(".sign-up-button");

const gameList = document.querySelector(".game-list");
const url = `https://api.rawg.io/api/games?key=3c463ef7d0934f34bd20df5f0297ed5f`;

/* SIGNOUT BUTTON */
const signOutButton = document.querySelector(".sign-out-button");

/* MAIN CONTENT DIV */
const mainContentContainer = document.querySelector(".main-content-container");

/* EVENTLISTENER */
// OPEN SIGN UP MODAL
openSignUpFormButton.addEventListener("click", (e) => {
  e.preventDefault();
  signUpFormContainer.style.display = "block";
});
//CLOSE SIGN OUT MODAL
closeSignUpFormButton.addEventListener("click", (e) => {
  e.preventDefault();
  signUpFormContainer.style.display = "none";
});

/* 	SIGN UP USER ACTION */
function signUpUser() {
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
      firstname: signUpFirstname.value.trim(),
      lastname: signUpLastname.value.trim(),
      signUpEmail: signUpEmail.value.trim(),
      signUpPassword: signUpPassword.value.trim(),
    };
    createUserWithEmailAndPassword(
      authService,
      newUser.signUpEmail,
      newUser.signUpPassword
    )
      .then(() => {
        signUpForm.requestFullscreen();
        signUpForm.style.display = "none";
      })
      .then((err) => console.log(err.message));
  }
}

signUpButton.addEventListener("click", (e) => {
  e.preventDefault();
  signUpUser();
});

/* HANDLE SIGN OUT ACTION */
function singOutUser() {
  signOut(authService)
    .then(() => {
      console.log("Signed out successfully");
      signOutButton.style.visibility = "hidden";
      signInForm.style.display = "flex";

      welcomeHeaderAndText.style = "flex";
    })
    .catch((err) => console.log("error"));
}

signOutButton.addEventListener("click", (e) => {
  e.preventDefault();
  singOutUser();
});

/* HANDLE SIGN IN ACTION */
function signInUser() {
  const { signInFormStatus } = validateSignInForm(
    emailInput.value,
    passwordInput.value,
    emailError,
    passwordError
  );
  if (signInFormStatus()) {
    return;
  } else {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    signInWithEmailAndPassword(authService, email, password)
      .then(() => {
        signInForm.reset();
        signOutButton.style.visibility = "visible";
        console.log("Successfully signed in");
      })
      .catch((err) => {
        submissionError.textContent = err.message;
      });
  }
}

signInButton.addEventListener("click", (e) => {
  e.preventDefault();
  signInUser();
});

/* ----------  FETCH DATA FROM API -------------- */

async function fetchData() {
  try {
    const response = await fetch(
      "https://api.rawg.io/api/games?key=3c463ef7d0934f34bd20df5f0297ed5f"
    );
    const data = await response.json();
    console.log(data);

    // Store the fetched data
    fetchedGameData = data.results;

    // event listeners after data is fetched
    const genreSelect = document.getElementById("filter_by_genre");
    const platformSelect = document.getElementById("filter_by_platform");

    genreSelect.addEventListener("click", () => {
      const selectedGenre = genreSelect.value;
      console.log("Selected genre:", selectedGenre);
      filterByGenre(fetchedGameData, selectedGenre);
    });

    platformSelect.addEventListener("click", () => {
      const selectedPlatform = platformSelect.value;
      console.log("Selected platform:", selectedPlatform);
      filterByPlatform(fetchedGameData, selectedPlatform);
    });

    // Filtering Functions
    function filterByGenre(games, genre) {
      const filteredGames = games.filter((game) => {
        // Ensure genres exist and check for matching genre
        return game.genres.some((g) => g.name.toLowerCase() === genre.toLowerCase());
      });
      console.log("Filtered games by genre:", filteredGames); // Log the filtered games
      renderData(filteredGames);
    }

    function filterByPlatform(games, platform) {
      const filteredGames = games.filter((game) => {
        // Ensure platforms exist and check for matching platform
        return game.platforms.some((p) => p.platform.name.toLowerCase() === platform.toLowerCase());
      });
      console.log("Filtered games by platform:", filteredGames); // Log the filtered games
      renderData(filteredGames);
    }

    // Initial render of fetched data
    renderData(fetchedGameData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Fetch data when the page loads
fetchData();

/* Handle auth state changes */
onAuthStateChanged(authService, (user) => {
  if (user) {
    getDocs(videoGamesCollection).then((snapshot) => {
      renderData(snapshot.docs.map(doc => doc.data())); // Correctly pass the data
      signOutButton.style.visibility = "visible";
      signInForm.style.display = "none";
      welcomeHeaderAndText.style.display = "none";
      signUpFormContainer.style.display = "none";
      mainContentContainer.style.display = "flex";
    });
  } else {
    mainContentContainer.style.display = "none";
    signOutButton.style.visibility = "hidden";
    signInForm.style.display = "flex";
    welcomeHeaderAndText.style.display = "flex";
  }
});
