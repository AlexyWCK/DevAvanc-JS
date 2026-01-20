module.exports = [
  {
    id: "post-player",
    url: "/api/player",
    method: "POST",
    variants: [
      {
        id: "success",
        type: "middleware",
        options: {
          middleware: async (req, res, _next, core) => {
            const { id } = req.body;
            core.logger.info(`Received new player: ${id}`);
            res.status(200).send(JSON.stringify({
              id,
              rank: 1000
            }));
          }
        }
      }
    ]
  }
];