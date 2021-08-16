class SolveAStar {
    constructor(maze) {
        super(maze);

        this.maze = maze;
        this.start = maze[0][0];
        this.finish = maze[maze[0].length - 1][maze.length - 1];

        this.start.f = 0;
        this.start.g = 0;
        this.start.h = 0;
        this.open = [this.start];
        this.closed = [];

        //xoffset y yOffset deberian ser lo mismo, la matriz es cuadrada
        this.xOffset = this.maze.size / this.maze.rows;
        this.yOffset = this.maze.size / this.maze.columns;
    }

    adjacentCells(cell){
        const maze = this.maze;
        const inBounds = () => {
            if (cell.rowNum < 0 || cell.rowNum > maze.rows || cell.colNum < 0 || cell.colNum > maze.columns) {
                return false;
            } else {
                return true;
            }
        };

        const neighbors = [];
        let x;
        let y;
        const add = [];

        if (!cell.walls.topWall) {
            add.push([0, -this.yOffset]);
        }
        if (!cell.walls.rightWall) {
            add.push([this.xOffset, 0]);
        }
        if (!cell.walls.leftWall) {
            add.push([0, this.yOffset]);
        }
        if (!cell.walls.bottomWall) {
            add.push([-this.xOffset, 0]);
        }

        for (let i=0; i < add.length; i++) {
            x = cell.rowNum * this.xOffset + add[i][0];
            y = cell.colNum * this.yOffset + add[i][1];
            const neighborCell = this.findCell(x, y);
            if (inBounds() && neighborCell && !neighborCell.explored) {
                neighbors.push(neighborCell);
            }
        }
        if (neighbors.length > 0) {
            return neighbors;
        }
    }

    findCell(x, y) {
        const maze = this.maze;
        for (let i=0; i < maze.length; i++) {
            for (let j=0; j < maze[0].length; j++) {
                let cell = maze[i][j];
                if (cell.rowNum * this.xOffset === x && cell.colNum * this.yOffset === y) {
                    return cell;
                }
            }
        }
        return null;
    }

    neighborExist(neighbor, list) {
        for (let i=0; i < list.length; i++) {
            let cell = list[i];
            if (cell.rowNum * this.xOffset === neighbor.rowNum * this.xOffset && cell.colNum * this.yOffset === neighbor.colNum * this.yOffset) {
                return cell;
            }
        }
        return false;
    }

    path() {
        if (this.pathfinder === this.start) {
            this.maze.solving = false;
            this.maze.solved = true;
        } else if (!this.pathfinder) {
            this.pathfinder = this.finish.parent;
        } else {
            this.pathfinder.path = true;
            this.pathfinder = this.pathfinder.parent;
        }
    }

    draw(ctx) {
        const maze = this.maze;
        if (this.current === this.finish) {
            this.path();
        } else {
            this.algorithm();
        }
        maze.forEach( row => {
            row.forEach( cell => {
                cell.show(this.xOffset, this.maze.rows, this.maze.columns);
            });
        });
        this.current.highlight(this.maze.columns);
        //this.start.highlightStart(ctx);
        //this.finish.highlightEnd(ctx);
        ctx.strokeRect(0, 0, maze.w, maze.h);
    }

    algorithm() {
        if (this.current !== this.finish) {
            if (this.open.length > 0) {
                this.open.sort((a, b) => b.f - a.f);
                this.current = this.open.pop();
                this.current.explored = true;
                const neighbors = this.adjacentCells(this.current);
                if (neighbors) {
                    neighbors.forEach(neighbor => {
                        neighbor.parent = this.current;
                    });
                    for (let i = 0; i < neighbors.length; i++) {
                        if (neighbors[i] === this.finish) {
                            this.current = neighbors[i];
                            return;
                        }
                        neighbors[i].g = this.current.g
                            + Math.sqrt(Math.pow(neighbors[i].rowNum * xOffset - this.current.rowNum * xOffset, 2) + (neighbors[i].colNum * yOffset - this.current.colNum * yOffset, 2));
                        neighbors[i].h = Math.abs(neighbors[i].rowNum * xOffset - this.finish.rowNum * xOffset) + Math.abs(neighbors[i].colNum * yOffset - this.finish.colNum * yOffset);
                        neighbors[i].f = neighbors[i].g + neighbors[i].h;
                        const openListCell = this.neighborExist(neighbors[i], this.open);
                        const closedListCell = this.neighborExist(neighbors[i], this.closed);
                        if (!openListCell || !closedListCell) {
                            this.open.push(neighbors[i]);
                        }
                        this.closed.push(this.current);
                    }
                }
            }
        } else {
            this.maze.solving = false;
            this.maze.solved = true;
        }
    }
}

export default SolveAStar;
