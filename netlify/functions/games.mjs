// Netlify kjører denne funksjonen når noen besøker /api/games
export default async () => {
  const API_KEY = process.env.API_KEY;

  try {
    const responseOne = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}`,
    );
    const responseTwo = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&page=2`,
    );

    if (!responseOne.ok || !responseTwo.ok) {
      return Response.json(
        { error: "RAWG svarte med en feil" },
        { status: 502 },
      );
    }

    const dataOne = await responseOne.json();
    const dataTwo = await responseTwo.json();

    return Response.json([dataOne.results, dataTwo.results]);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Kunne ikke hente spill" }, { status: 500 });
  }
};
