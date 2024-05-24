
/*





------------------------------------------------------


const gameList = document.querySelector(".game-list");

const url = 'https://api.rawg.io/api/games?key=3c463ef7d0934f34bd20df5f0297ed5f'

function videoGames(url){
	fetch(url)
	.then(response => response.json())
	.then(data => {
		console.log(data)
	})
}

videoGames(url);




function renderData(videoGames){
	const mainContentContainer = document.querySelector('.main-content-container');

	videoGames.forEach((videoGame)=>{

		let newVideoGame = videoGame.data();

		const videoGameContainer = document.createElement('span');
		const gameContainer = document.createElement('span');
		const gameImage = document.createElement('img');
		const videoGameName = document.createElement('h3');
		const countryRegion = document.createElement('h3');
		const countryPopulation = document.createElement('h3');

		const videoGameReleased = document.createElement("p");
		const videoGamePlatforms = document.createElement("p");
		const videoGameDevelopers = document.createElement("p");

		

		mainContentContainer.append(videoGameContainer);
		videoGameContainer.append(gameContainer, videoGameName, countryRegion, countryPopulation, videoGameReleased, videoGamePlatforms, videoGameDevelopers);
		gameContainer.append(gameImage);

		gameList.append(li);
		li.append(name, birthYear, species, homeworld, films, imgContainer);

		gameImage.src = newVideoGame.game;
		videoGameName.textConent = newVideoGame.name;
		countryRegion.textContent = newCountry.region;
		countryPopulation.textContent = newCountry.population;

		videoGameContainer.textContent = newVideoGame.videoGameContainer;
		gameContainer.textContent = newVideoGame.gameContainer;
		videoGameReleased.textContent = newVideoGame.videoGameReleased;

	});
}
 */

/* import {fetchedGameData} from './app'

console.log("from render", fetchedGameData); */

 function renderData(videoGames){
    const gameList = document.querySelector('.game-list');
	gameList.textContent = ''
console.log(videoGames);
     videoGames.forEach((videoGame) => {
		
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');

        const gameImage = document.createElement('img');
        gameImage.src = videoGame.background_image || ''; // Make sure to handle cases where background_image is undefined
        gameImage.alt = videoGame.name || ''; // Make sure to handle cases where name is undefined

        const videoGameName = document.createElement('h3');
        videoGameName.textContent = videoGame.name || ''; // Make sure to handle cases where name is undefined

        const videoGameReleased = document.createElement("p");
        videoGameReleased.textContent = `Released: ${videoGame.released || ''}`; // Make sure to handle cases where released is undefined

        const videoGamePlatforms = document.createElement("p");
        videoGamePlatforms.textContent = `Platforms: ${videoGame.platforms ? videoGame.platforms.map(platform => platform.platform.name).join(', ') : ''}`; // Check if platforms is defined before mapping

        const videoGameDevelopers = document.createElement("p");
        videoGameDevelopers.textContent = `Developers: ${videoGame.developers ? videoGame.developers.map(developer => developer.name).join(', ') : ''}`; // Check if developers is defined before mapping



		const videoGameGenres = document.createElement("p");
        videoGameGenres.textContent = `Genres: ${videoGame.genres ? videoGame.genres.map(genre => genre.name).join(', ') : ''}`; // Check if genres is defined before mapping
        
        const videoGamePublishers = document.createElement("p");
        videoGamePublishers.textContent = `Publishers: ${videoGame.publishers ? videoGame.publishers.map(publisher => publisher.name).join(', ') : ''}`; // Check if publishers is defined before mapping

        gameCard.appendChild(gameImage);
        gameCard.appendChild(videoGameName);
        gameCard.appendChild(videoGameReleased);
        gameCard.appendChild(videoGamePlatforms);
        gameCard.appendChild(videoGameDevelopers);


		gameCard.appendChild(videoGameGenres);
		gameCard.appendChild(videoGamePublishers);

        gameList.appendChild(gameCard);


    });
}


/* Filter */

/* // Function to filter games by genre
function filterByGenre(newVideoGame, genres) {
    return filterVideoGames.filter(game => game.genres === genres);
}

// Function to filter games by platform
function filterByPlatform(newVideoGame, platform) {
    return filterVideoGames.filter(game => game.platform === platform);
}

// Example of applying filters based on user input
const filteredByGenre = filterByGenre(games, 'Action');
console.log('Games filtered by genre:', filteredByGenres);

const filteredByPlatform = filterByPlatform(games, 'PlayStation');
console.log('Games filtered by platform:', filteredByPlatform);


 */





export default renderData;
