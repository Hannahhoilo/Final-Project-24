import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config()

const app = express();
const PORT = 4000;
const { API_KEY } = process.env;

app.use(cors());

const games = []

app.listen(PORT, ()=> {
	console.log(`server is running on port ${PORT}`)
});

app.get("/", async(req, res)=>{
	try {
		const responseOne = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}`)
		const dataOne = await responseOne.json();

		const responseTwo = await fetch (`https://api.rawg.io/api/games?key=${API_KEY}&page=2`)
		const dataTwo = await responseTwo.json();
		games.push([...dataOne.results], [...dataTwo.results] )
		res.json(games);

	} catch (error) {
		console.log(error);
	};
});

