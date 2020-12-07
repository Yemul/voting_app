const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server);

const port = 8080;

const pollObj = {
    question: "Select Your Favourite Component",
    options: [
      { text: "Angular", value: 0, count: 0 },
      { text: "MongoDB", value: 1, count: 0 },
      { text: "Express.js", value: 2, count: 0 },
      { text: "Golang", value: 3, count: 0 },
      { text: "Python", value: 4, count: 0 },
      { text: "C#", value: 5, count: 0 },
      { text: "PhP", value: 6, count: 0 },
      { text: "C++", value: 7, count: 0 },
    ],
  };

app.use("/", express.static(path.join(__dirname, "dist/chart")));

io.on("connection", socket => {
  console.log("new connection made from client with ID="+socket.id);
  socket.emit("votes", pollObj);

  socket.on("newVote", vote => {
    let voteItem;
    let voteCount;
    pollObj.options.forEach((component) => {
        if (component.value === vote) {
            component.count += 1;
            voteItem = component.text;
            voteCount = component.count;
        }
    });
    console.log(pollObj);
    io.sockets.emit("votes", pollObj);
    socket.emit("thank", `Thank you for voting for ${voteItem}. There are now ${voteCount} vote(s) for option ${voteItem}.`);
  });
});

server.listen(port, () => {
  console.log("Listening on port " + port);
});