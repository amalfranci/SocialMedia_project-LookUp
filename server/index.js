import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import { Server } from 'socket.io';
// security packges
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();

const __dirname = path.resolve(path.dirname(""));

const PORT = process.env.PORT || 8800;
dbConnection();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views/build")));

app.use(morgan("dev"));
app.use(router);
app.use(errorMiddleware);

const server= app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});


const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});


io.on("connection", (socket) => {
  console.log("connected to socket.io")
  socket.on('setup', (userData) => {
    
    socket.join(userData._id)
    console.log(userData._id)

    socket.emit('connected')
  });

    socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
    });
  
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

    socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });


})
