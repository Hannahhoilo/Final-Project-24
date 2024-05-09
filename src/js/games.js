const gameList = document.querySelector(".game-list");

const url = 'https://api.rawg.io/api/games?key=3c463ef7d0934f34bd20df5f0297ed5f'

function loadGames(url){
	fetch(url)
	.then(response => response.json())
	.then(data => {
		console.log(data)
	})
}

loadGames(url);

/* ----------------------- */

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

		gameImage.src = newVideoGame.game;
		videoGameName.textConent = newVideoGame.videoGameName;
		countryRegion.textContent = newCountry.region;
		countryPopulation.textContent = newCountry.population;

		gameContainer.textContent = newVideoGame.gameContainer;
		videoGameReleased.textContent = newVideoGame.videoGameReleased;

	});
}