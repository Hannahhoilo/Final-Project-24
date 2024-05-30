
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

export default renderData;
