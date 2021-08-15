import Maze from "./maze.js";

export default class Cell {
    // El constructor toma el rowNum y el colNum que sera utilizada como coordeadas para dibujar en el canvas
    constructor(rowNum, colNum, parentGrid, parentSize, ctx) {
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.ctx = ctx;
        this.visited = false;
        this.walls = {
            topWall: true,
            rightWall: true,
            bottomWall: true,
            leftWall: true,
        };
        this.goal = false;
        // parentGird se pasa para habiliar el metodo para checkear a los vecinos
        // parentSize se pasa para setear el size de cada celda en el grid
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
    }

    checkNeighbours() {
        let grid = this.parentGrid;
        let row = this.rowNum;
        let col = this.colNum;
        let neighbours = [];

        // Las siguientes lineas pushean todos los vecinos disponibles en el array de vecinos
        // undefined es retornado cuando el indice se encuentra fuera de los bordes (para los casos de las aristas)
        let top = row !== 0 ? grid[row - 1][col] : undefined;
        let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
        let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
        let left = col !== 0 ? grid[row][col - 1] : undefined;

        // si las siguientes no son 'undefined' entonces pushearlos en el array de vecinos
        if (top && !top.visited) neighbours.push(top);
        if (right && !right.visited) neighbours.push(right);
        if (bottom && !bottom.visited) neighbours.push(bottom);
        if (left && !left.visited) neighbours.push(left);

        // Elegir un vecino aleatorio del array de vecinos
        if (neighbours.length !== 0) {
            let random = Math.floor(Math.random() * neighbours.length);
            return neighbours[random];
        } else {
            return undefined;
        }
    }

    // Las funciones para dibujar las paredes de la celda, se llaman si la muralla es seteada como relevate en el constructor de la celda
    drawTopWall(x, y, size, columns, rows) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + size / columns, y);
        this.ctx.stroke();
    }

    drawRightWall(x, y, size, columns, rows) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + size / columns, y);
        this.ctx.lineTo(x + size / columns, y + size / rows);
        this.ctx.stroke();
    }

    drawBottomWall(x, y, size, columns, rows) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + size / rows);
        this.ctx.lineTo(x + size / columns, y + size / rows);
        this.ctx.stroke();
    }

    drawLeftWall(x, y, size, columns, rows) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y + size / rows);
        this.ctx.stroke();
    }

    // Destaca la celda actual en el grid. las columnas son pasadas para setear el size del grid
    highlight(columns) {
        // Sumas y restas agregadas para que la celda resaltada cubra las paredes
        let x = (this.colNum * this.parentSize) / columns + 1;
        let y = (this.rowNum * this.parentSize) / columns + 1;
        this.ctx.fillStyle = "purple";
        this.ctx.fillRect(
            x,
            y,
            this.parentSize / columns - 3,
            this.parentSize / columns - 3
        );
    }

    removeWalls(cell1, cell2) {
        // Compara las dos celdas en el eje x
        let x = cell1.colNum - cell2.colNum;
        // Remueve las murallas si hay una diferencia en el eje x
        if (x === 1) {
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        } else if (x === -1) {
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }
        // compara las celdas en el eje x
        let y = cell1.rowNum - cell2.rowNum;
        // Remueve las murallas si hay una diferencia en el eje x
        if (y === 1) {
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        } else if (y === -1) {
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        }
    }

    // Dibuja cada una de las celdas en el laberinto del canvas
    show(size, rows, columns) {
        let x = (this.colNum * size) / columns;
        let y = (this.rowNum * size) / rows;
        // console.log(`x =${x}`);
        // console.log(`y =${y}`);
        this.ctx.strokeStyle = "#ffffff";
        // ctx.fillStyle = "white";
        this.ctx.lineWidth = 2;
        if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
        if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
        if (this.walls.bottomWall)
            this.drawBottomWall(x, y, size, columns, rows);
        if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
        if (this.visited) {
            this.ctx.fillRect(
                x + 1,
                y + 1,
                size / columns - 2,
                size / rows - 2
            );
        }
        if (this.goal) {
            this.ctx.fillStyle = "rgb(83, 247, 43)";
            this.ctx.fillRect(
                x + 1,
                y + 1,
                size / columns - 2,
                size / rows - 2
            );
        }
    }
}
