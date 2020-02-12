const express = require("express");

const postsRouter = require('./posts-router.js');
const Posts = require('./data/db.js');
const server = express();


server.use(express.json());

server.use(`/api/posts`, postsRouter)

server.get("/", (req, res) => {
    res.send( `<h2>Lambda hubs API</h2>` )
})

const port = 8000;
server.listen(port, () => {
    console.log(`\n *** server running on http://localhost:${port} ***\n`)
})