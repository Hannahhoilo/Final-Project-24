import firebaseConfig from './firebaseConfig';
import {initializeApp} from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';

import {getFirestore, collection, addDoc, getDocs} from 'firebase/firestore';



/* INITIALIZE FIREBASE */
initializeApp(firebaseConfig);

/* INITIALIZE AUTH SERVICE */
const authService = getAuth();


/* INITIALIZE FIRESTORE DATABASE */
const database = getFirestore();

/* ACCESS THE COUNTRIES COLLECTION IN FIRESTORE */
const videoGamesCollection = collection(database, 'videoGames');


import {validateSignInForm} from './signInValidation';
import {validateSignUpForm} from './signUpValidation';
import renderData from './renderData';



/* SELECTING THE SIGN IN FORM ELEMENTS */
const emailInput = document.querySelector('.email');
const passwordInput = document.querySelector('.password');
const signInButton = document.querySelector('.sign-in-button');
const emailError = document.querySelector('.email-error');
const passwordError = document.querySelector('.password-error');
const signInForm = document.querySelector('.sign-in-form');
const submissionError = document.querySelector('.submission-error');

/* SELECTING SIGN UP FORM ELEMENTS */
const signUpFirstname = document.querySelector('.firstname');
const signUpLastname = document.querySelector('.lastname');
const signUpEmail = document.querySelector('.sign-up-email');
const signUpPassword = document.querySelector('.sign-up-password');
const signUpError = document.querySelector('.sign-up-error');
const signUpForm = document.querySelector('.sign-up-form');
const closeSignUpFormButton = document.querySelector('.sign-up-form__close');
const openSignUpFormButton = document.querySelector('.sign-up-form__open');
const signUpFormContainer = document.querySelector('.sign-up-form-container');
const signUpButton = document.querySelector('.sign-up-button');

const gameList = document.querySelector('.game-list');
const url = `https://api.rawg.io/api/games?key=3c463ef7d0934f34bd20df5f0297ed5f`

/* SIGNOUT BUTTON */
const signOutButton = document.querySelector('.sign-out-button');

/* MAIN CONTENT DIV */
const mainContentContainer = document.querySelector('.main-content-container');

/* EVENTLISTENER */
// OPEN SIGN UP MODAL
openSignUpFormButton.addEventListener('click', (e) => {
	e.preventDefault();
	signUpFormContainer.style.display = 'block'
})
//CLOSE SIGN UOUT MODAL
closeSignUpFormButton.addEventListener('click', (e) => {
	e.preventDefault();
	signUpFormContainer.style.display = 'none'
})
/*
signInButton.addEventListener('click', (e)=>{
	e.preventDefault ();

	validateSignInForm(
		emailInput.value,
		passwordInput.value,
		emailError,
		passwordError
	);
});
*/
/*
signUpButton.addEventListener('click', (e)=> {
	e.preventDefault();
	validateSignUpForm(signUpFirstname.value, signUpLastname.value, signUpEmail.value, signUpPassword.value, signUpError)
})
*/
/* 	SIGN UP USER ACTION */
function signUpUser() {
	const {signUpErrorStatus} = validateSignUpForm(
		signUpFirstname.value.trim(), 
		signUpLastname.value.trim(), 
		signUpEmail.value.trim(), 
		signUpPassword.value.trim(), 
		signUpError
		);
		if(signUpErrorStatus()){
			return
		} else {
			const newUser = {
				firstname: signUpFirstname.value.trim(),
				lastname: signUpLastname.value.trim(),
				signUpEmail: signUpEmail.value.trim(),
				signUpPassword: signUpPassword.value.trim(),
			}
			createUserWithEmailAndPassword(authService, newUser.signUpEmail, newUser.signUpPassword)
			.then(()=>{
				signUpForm.requestFullscreen();
				signUpForm.style.display = 'none';
			})
			.then((err)=> console.log(err.message))
		}
}

signUpButton.addEventListener('click', (e)=>{
	e.preventDefault();
	signUpUser();
})

/* HANDLE SIGN OUT ACTION */
function singOutUser(){
	signOut(authService)
	.then(()=>{
		console.log('Signed out successfully');
		signOutButton.style.visibility = 'hidden';
		signInForm.style.display = 'flex';
	})
	.catch((err)=> console.log('error'))
}

signOutButton.addEventListener('click', (e)=>{
	e.preventDefault();
	singOutUser();
})

/* HANDLE SIGN IN ACTION */
function signInUser(){
	const {signInFormStatus} =
	validateSignInForm(
		emailInput.value,
		passwordInput.value,
		emailError,
		passwordError
	);
	if(signInFormStatus()){
		return
	} else{
		const email = emailInput.value.trim();
		const password = passwordInput.value.trim();
		signInWithEmailAndPassword(authService, email, password)
		.then(()=>{
			signInForm.reset();
			signOutButton.style.visibility = 'visible';
			console.log('Successfully signed in');
		})
		.catch(err => {
			submissionError.textContent = err.message
		})
	}
}

signInButton.addEventListener('click', (e)=>{
	e.preventDefault();
	signInUser();
})

/* FETCH GAME DATA FROM API */
async function fetchData(){
		const dataExists = await checkDataExists();
		if(!dataExists){
		const response = await fetch('https://api.rawg.io/api/games?key=3c463ef7d0934f34bd20df5f0297ed5f');
		const data = await response.json();
		console.log(data);
		storeData(data);
		renderData(data.results);
	}
}

fetchData();



async function storeData(data){
	for(let game of data){
		const newVideoGame = {
			gameContainer: game.gameContainer.svg,
			videoGameName: game.name,
			parent_platforms: game.parent_platforms,
			population: game.population,

			videoGameReleased: game.videoGameReleased,
		};
		console.log(newVideoGame);
		await addDoc(videoGamesCollection, newVideoGame)
	}
}

async function checkDataExists(){
	const snapshot = await getDocs(videoGamesCollection);
	return !snapshot.empty;
}

onAuthStateChanged(authService, (user)=>{
	if(user){
		getDocs(videoGamesCollection)
		.then((snapshot)=>{
			renderData(snapshot.docs);
			signOutButton.style.visibility = 'visible';
			signInForm.style.display = 'none';
			signUpFormContainer.style.display = 'none';
			mainContentContainer.style.display = 'flex';
		})
	} else {
		mainContentContainer.style.display = 'none';
		signOutButton.style.visibility = 'hidden';
		signInForm.style.display = 'flex';
	}
})

