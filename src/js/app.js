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

let fetchedGameData = []; 


/* let fetchedGameData; // Declaration
// Initialize fetchedGameData with some value
fetchedGameData = fetchData(); // Example function to fetch data

// Now you can safely use fetchedGameData
console.log(fetchedGameData); */



/* SELECTING THE SIGN IN FORM ELEMENTS */
const emailInput = document.querySelector('.email');
const passwordInput = document.querySelector('.password');
const signInButton = document.querySelector('.sign-in-button');
const emailError = document.querySelector('.email-error');
const passwordError = document.querySelector('.password-error');
const signInForm = document.querySelector('.sign-in-form');
const submissionError = document.querySelector('.submission-error');

const welcomeHeaderAndText = document.querySelector('.welcome');

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
//CLOSE SIGN OUT MODAL
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

		welcomeHeaderAndText.style = 'flex';
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

// STORE DATA IN MPTY ARRAY

//dataOfGames[] = {data};
//export const [dataOfGames] = (data);


/* FETCH GAME DATA FROM API */
/* async function fetchData(){
		const dataExists = await checkDataExists();
		if(!dataExists){
		const response = await fetch('https://api.rawg.io/api/games?key=3c463ef7d0934f34bd20df5f0297ed5f');
		const data = await response.json();

		storeData(data);

		fetchedGameData.push(...data.results);
		console.log(fetchedGameData)

		renderData(data.results);
	}
}
 */


/* ---------- ANNEN FETCH DATA FROM API -------------- */

async function fetchData() {
    try {
        const dataExists = await checkDataExists();
        if (!dataExists) {
            const response = await fetch('https://api.rawg.io/api/games?key=3c463ef7d0934f34bd20df5f0297ed5f');
            const data = await response.json();

            // Check if the retrieved data has the expected structure
            if (Array.isArray(data.results)) {
                // Push each game object into the fetchedGameData array
                data.results.forEach(game => {
                    fetchedGameData.push(game);
                });
            } else {
                console.error('Unexpected data structure from API:', data);
            }

            renderData(fetchedGameData);
			console.log(fetchedGameData);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



/*
separtert med filter kategotty , med switch 

når man bruker filter så skal man map gjennom arrayyen på nytt 
*/

fetchData();

/* FILTER + Event listener */

// Event Listeners

const genreSelect = document.getElementById('filter_by_genre');
const platformSelect = document.getElementById('filter_by_platform');

genreSelect.addEventListener('click', () => {
  const selectedGenre = genreSelect.value;

  console.log('Selected genre:', selectedGenre);

  filterByGenre(fetchedGameData, selectedGenre);
});

platformSelect.addEventListener('click', () => {
  const selectedPlatform = platformSelect.value;

  console.log('Selected platform:', selectedPlatform);
  filterByPlatform(fetchedGameData, selectedPlatform);
});



// Filtering Functions

function filterByGenre(fetchedGameData, genre) {
    const filteredGames = fetchedGameData.filter(game => {
        return game.genres.includes(genre);
    });
    console.log('Filtered games by genre:', filteredGames); // Log the filtered games
    renderData(filteredGames);

}




  
  function filterByPlatform(fetchedGameData, platform) {
	const filteredGames = fetchedGameData.filter(game => {
	  return game.platforms.includes(platform);
	});
	renderData(filteredGames);
  }



/*------------------------*/

// Search function

/* const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const fetchedGameData = fetchedGameData.filter(game => {
    return game.videoGameName.toLowerCase().includes(searchTerm);
  });
  renderData(fetchedGameData);
});  */

// Search function
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const fetchedGameData = fetchedGameData.filter(game => {
    return game.name.toLowerCase().includes(searchTerm);
  });
  renderData(fetchedGameData);
});



// ------------------------
//20.5

/* searchGame.addEventListener("input", (e) => {
    let value = e.target.value

    if (value && value.trim().length > 0){
         value = value.trim().toLowerCase()

        //returning only the results of setList if the value of the search is included in the person's name
        setList(fetchedGameData.filter(game => {
            return game.name.includes(value)
        })))

const searchInput = document.querySelector('.searchInput')

// creating and declaring a function called "setList"
// setList takes in a param of "results"
function setList(results){

    for (const game of results){
        // creating a li element for each result item
        const resultItem = document.createElement('li')

        // adding a class to each item of the results
        resultItem.classList.add('result-item')

        // grabbing the name of the current point of the loop and adding the name as the list item's text
        const text = document.createTextNode(game.name)

        // appending the text to the result item
        resultItem.appendChild(text)

        // appending the result item to the list
        list.appendChild(resultItem)
    }
} */





// gammel lagde ny 29.5 
/* async function storeData(data){
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

		fetchedGameData.push(newVideoGame);
	}
}
 */
//lagt til 29.05 den over er gammel og funket men prøver å fikse 
async function storeData(data){
	for(let game of data.results){
		const newVideoGame = {
			videoGameName: game.name,
			genres: game.genres,
			platforms: game.platforms,
			released: game.released,
			// Add more properties as needed
		};
		console.log(newVideoGame);
		await addDoc(videoGamesCollection, newVideoGame)

		fetchedGameData.push(newVideoGame);
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
			welcomeHeaderAndText.style.display = 'none';
			signUpFormContainer.style.display = 'none';
			mainContentContainer.style.display = 'flex';
		})
	} else {
		mainContentContainer.style.display = 'none';
		signOutButton.style.visibility = 'hidden';
		signInForm.style.display = 'flex';
		welcomeHeaderAndText.style.display = 'flex';
	}
})

export { fetchedGameData };