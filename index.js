// Initialize the canvas
import Maze from "./laberinto/maze.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let newMaze = new Maze(600, 10, 10, canvas, ctx);

newMaze.setup();
newMaze.draw();
