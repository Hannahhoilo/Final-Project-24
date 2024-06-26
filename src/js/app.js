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

// Selecting the filter for genre buttons
const filterByActionButton = document.querySelector("#filter-action");
const filterByAdventureButton = document.querySelector("#filter-adventure");
const filterByRPGButton = document.querySelector("#filter-rpg");
const filterByShooterButton = document.querySelector("#filter-shooter");
const filterByPuzzleButton = document.querySelector("#filter-puzzle");
const filterByIndieButton = document.querySelector("#filter-indie");
const filterByPlatformerButton = document.querySelector("#filter-platformer");

// Selecting the filter for consoles buttons
const filterByPcButton = document.querySelector("#filter-pc");
const filterByPlaystationButton = document.querySelector("#filter-playstation");
const filterByXboxButton = document.querySelector("#filter-xbox");
const filterByNintendoButton = document.querySelector("#filter-nintendo");

// Selecting the sort buttons
const sortByReleaseButton = document.querySelector("#sort-release");
const sortByNameButton = document.querySelector("#sort-name");
const sortByRatingButton = document.querySelector("#sort-rating");

// LOAD MORE BUTTON
const loadButton = document.querySelector(".load-more-button");

const gameList = document.querySelector(".game-list");
/* const url = `https://api.rawg.io/api/games?key=${API_KEY}`; */

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
      `http://localhost:4000/`
    );
    const data = await response.json();
      const [firstPage, secondPage] = data

    // Store the fetched data
    fetchedGameData = [firstPage, secondPage];
    console.log(...fetchedGameData[0], ...fetchedGameData[1])
    /* console.log(fetchedGameData); */
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Load more button fetch
 loadButton.addEventListener("click", async () => {
  try {
    renderData([...fetchedGameData[0], ...fetchedGameData[1]]);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

//--------------------------------------------------

/* Handle auth state changes */
onAuthStateChanged(authService,  (user) => {
  if (user) {
    fetchData().then(()=>{
      renderData(fetchedGameData[0]);
    })
    
    signOutButton.style.visibility = "visible";
    signInForm.style.display = "none";
    welcomeHeaderAndText.style.display = "none";
    signUpFormContainer.style.display = "none";
    mainContentContainer.style.display = "flex";
  } else {
    mainContentContainer.style.display = "none";
    signOutButton.style.visibility = "hidden";
    signInForm.style.display = "flex";
    welcomeHeaderAndText.style.display = "flex";
  }
});

// --------------------------------------------
// Sorting the games
sortByRatingButton.addEventListener("click", async () => {
  const sortedRatings = await sortByRating(fetchedGameData[0],fetchedGameData[1]);
  console.log(sortedRatings);
  renderData(sortedRatings);
});

function sortByRating(data) {
  return data.slice().sort((a, b) => b.rating - a.rating);
}

//sort the names
sortByNameButton.addEventListener("click", () => {
  const sortedNames = sortByName(fetchedGameData[0],fetchedGameData[1]);
  console.log(sortedNames);
  renderData(sortedNames);
});

function sortByName(data) {
  return data.slice().sort((a, b) => a.name.localeCompare(b.name));
}

// sort by release
sortByReleaseButton.addEventListener("click", () => {
  const sortedRelease = sortByRelease(fetchedGameData[0],fetchedGameData[1]);
  console.log(sortedRelease);
  renderData(sortedRelease);
});

function sortByRelease(data) {
  return data.slice().sort((a, b) => {
    return Number(a.released.slice(0, 4)) - Number(b.released.slice(0, 4));
  });
}


// --------------------------- Filter Genres ---------------------------------
// Action
filterByActionButton.addEventListener("click", () => {
  const filterAction = filterByAction(fetchedGameData[0],fetchedGameData[1]);
  console.log(filterAction);
  renderData(filterAction);
});
function filterByAction(data) {
  return data.filter((game) =>
    game.genres.some((genre) => genre.slug === "action")
  );
}

// Adventure
filterByAdventureButton.addEventListener("click", () => {
  const filterAdventure = filterByAdventure(fetchedGameData[0],fetchedGameData[1]);
  console.log(filterAdventure);
  renderData(filterAdventure);
});
function filterByAdventure(data) {
  return data.filter((game) =>
    game.genres.some((genre) => genre.slug === "adventure")
  );
}

// RPG
filterByRPGButton.addEventListener("click", () => {
  const filterRPG = filterByRPG(fetchedGameData[0], fetchedGameData[1]);
  console.log(filterRPG);
  renderData(filterRPG);
});
function filterByRPG(data) {
  return data.filter((game) =>
    game.genres.some((genre) => genre.slug === "role-playing-games-rpg")
  );
}

// Shooter
filterByShooterButton.addEventListener("click", () => {
  const filterShooter = filterByShooter(fetchedGameData[0],fetchedGameData[1]);
  console.log(filterShooter);
  renderData(filterShooter);
});
function filterByShooter(data) {
  return data.filter((game) =>
    game.genres.some((genre) => genre.slug === "shooter")
  );
}

// Puzzle
filterByPuzzleButton.addEventListener("click", () => {
  const filterPuzzle = filterByPuzzle(fetchedGameData[0],fetchedGameData[1]);
  console.log(filterPuzzle);
  renderData(filterPuzzle);
});
function filterByPuzzle(data) {
  return data.filter((game) =>
    game.genres.some((genre) => genre.slug === "puzzle")
  );
}

// Indie
filterByIndieButton.addEventListener("click", () => {
  const filterIndie = filterByIndie(fetchedGameData[0],fetchedGameData[1]);
  console.log(filterIndie);
  renderData(filterIndie);
});
function filterByIndie(data) {
  return data.filter((game) =>
    game.genres.some((genre) => genre.slug === "indie")
  );
}

// Platformer
filterByPlatformerButton.addEventListener("click", () => {
  const filterPlatformer = filterByPlatformer(fetchedGameData[0],fetchedGameData[1]);
  console.log(filterPlatformer);
  renderData(filterPlatformer);
});
function filterByPlatformer(data) {
  return data.filter((game) =>
    game.genres.some((genre) => genre.slug === "platformer")
  );
}

// -------------------------------- Filter game consoles ---------------------------------
// PC
filterByPcButton.addEventListener("click", () => {
  const filterPc = filterByPc(fetchedGameData[0],fetchedGameData[1]);
  console.log(filterPc);
  renderData(filterPc);
});
function filterByPc(data) {
  return data
    .slice()
    .filter((game) =>
      game.platforms.some(
        (platform) =>
          platform.platform.slug === "pc" ||
          platform.platform.name.toLowerCase() === "pc"
      )
    );
}

// Playstation
filterByPlaystationButton.addEventListener("click", () => {
  const filterPlaystation = filterByPlaystation(fetchedGameData[0],fetchedGameData[1]);
  console.log(filterPlaystation);
  renderData(filterPlaystation);
});
function filterByPlaystation(data) {
  return data
    .slice()
    .filter((game) =>
      game.parent_platforms.some(
        (platform) =>
          platform.platform.slug === "playstation" ||
          platform.platform.name.toLowerCase() === "playstation"
      )
    );
}

// xbox
filterByXboxButton.addEventListener("click", () => {
  const filterXbox = filterByXbox(fetchedGameData[0],fetchedGameData[1]);
  console.log(filterXbox);
  renderData(filterXbox);
});
function filterByXbox(data) {
  return data
    .slice()
    .filter((game) =>
      game.parent_platforms.some(
        (platform) =>
          platform.platform.slug === "xbox" ||
          platform.platform.name.toLowerCase() === "xbox"
      )
    );
}

// nintendo
filterByNintendoButton.addEventListener("click", () => {
  const filterNintendo = filterByNintendo(fetchedGameData[0], fetchedGameData[1]);
  console.log(filterNintendo);
  renderData(filterNintendo);
});
function filterByNintendo(data) {
  return data
    .slice()
    .filter((game) =>
      game.parent_platforms.some(
        (platform) =>
          platform.slug === "nintendo" ||
          platform.platform.name.toLowerCase() === "nintendo"
      )
    );
}

// -----------------------------------------

// -------------- search ---------------------

const searchInput = document.querySelector("#search-input");

searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  console.log(searchValue);

  // Search for the games based on the search value
  const searchValueResults = (fetchedGameData[0], fetchedGameData[1]).filter((game) =>
    game.name.toLowerCase().includes(searchValue)
  );

  // Render the games you are searching for
  renderData(searchValueResults);
});




