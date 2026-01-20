const { FAKE_PLAYERS } = require("../data/players.data");

module.exports = [
  {
    id: "post-match",
    url: "/api/match",
    method: "POST",
    variants: [
      {
        id: "success",
        type: "middleware",
        options: {
          middleware: async (req, res, _next, core) => {
            const { winner, loser, draw } = req.body;
            core.logger.info(`Received match result: ${winner} vs ${loser} => ${draw ? 'draw' : winner}`);
            res.status(200).send(JSON.stringify({
              winner: {
                id: winner,
                rank: 1000 + FAKE_PLAYERS.indexOf(winner) * 10
              },
              loser: {
                id: loser,
                rank: 1000 + FAKE_PLAYERS.indexOf(loser) * 10
              }
            }));
          }
        }
      }
    ]
  }
];