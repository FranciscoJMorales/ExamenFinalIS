const app = require("./app");
const server = require("http").Server(app);
const { connect } = require("./database");
const port = 4000;

async function main() {
  //Database Connection
  await connect();

  //Express Application
  await server.listen(port);
  console.log(`voting-system listening on port ${port}`);
  console.log(`GET  localhost:${port}/`);
  console.log(`POST localhost:${port}/`);
}

main();