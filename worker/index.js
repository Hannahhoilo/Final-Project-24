export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // /api/games henter spill fra RAWG, alt annet er de vanlige filene i dist
    if (url.pathname === "/api/games") {
      try {
        const responseOne = await fetch(
          `https://api.rawg.io/api/games?key=${env.API_KEY}`,
        );
        const responseTwo = await fetch(
          `https://api.rawg.io/api/games?key=${env.API_KEY}&page=2`,
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
        return Response.json(
          { error: "Kunne ikke hente spill" },
          { status: 500 },
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
