import Cell from "./cell.js";

let generationComplete = false;
let current;
let goal;

export default class Maze {
    constructor(size, rows, columns, canvas, ctx) {
        this.size = size;
        this.columns = columns;
        this.rows = rows;
        this.grid = [];
        this.stack = [];
        this.canvas = canvas;
        this.ctx = ctx;
    }

    //Crea el grid para el laberinto, un array de array de rows
    setup() {
        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.columns; c++) {
                // Se crea una nueva instancia de la clase Celda para cada elemento del grid, se hace push en el array del grid
                let cell = new Cell(r, c, this.grid, this.size, this.ctx);
                row.push(cell);
            }
            this.grid.push(row);
        }
        // Se setean los valores inicio y fin para el grid (1, 1) y (N, N)
        current = this.grid[0][0];
        this.grid[this.rows - 1][this.columns - 1].goal = true;
    }

    // Draw the canvas by setting the size and placing the cells in the grid array on the canvas.
    // Dibuja el grid en el canvas, seteando el siz
    draw() {
        canvas.width = this.size;
        canvas.height = this.size;
        canvas.style.background = "black";
        // Setea la primera celda (0, 0) como visitada
        current.visited = true;
        // Loop a traves del grid array y llama a al metodo show para dibujar cada instancia de celda del grid
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                let grid = this.grid;
                grid[r][c].show(this.size, this.rows, this.columns);
            }
        }
        // Esta variable asigna una celda aleatoria de entre las celdas vecinas correspondientes y no visitadas
        let next = current.checkNeighbours();
        // Si existe la celda vecina next (Si todavia falta alguna que no fue visitada)
        if (next) {
            next.visited = true;
            // Agregar la celda al stack para el backtracking
            this.stack.push(current);
            // Esta funcion es para pintar la celda correspondiente en el grid. Se para el parametro columna
            // para setear el size de la celda
            current.highlight(this.columns);
            // Esta funcion compara la celda actual con la celda next y remueve la muralla entre ambos
            // This function compares the current cell to the next cell and removes the relevant walls for each cell
            current.removeWalls(current, next);
            // Setea la celda next como actual
            current = next;

            // Si no hay celdas vecinas disponibes se comienza el backtracking utilizando el stack
        } else if (this.stack.length > 0) {
            let cell = this.stack.pop();
            current = cell;
            current.highlight(this.columns);
        }
        // Si ya no existen items en el stack y todas las celdas han sido visitadas, se puede finalizar la generacion del laberinto
        if (this.stack.length === 0) {
            generationComplete = true;
            return;
        }

        // Recursivamente llaa a la funcion draw, esta funcion va a ser llamada hasta que la pila este vacia
        window.requestAnimationFrame(() => {
            this.draw();
        });
        //     setTimeout(() => {rd
        //       this.draw();
        //     }, 10);
    }
}
