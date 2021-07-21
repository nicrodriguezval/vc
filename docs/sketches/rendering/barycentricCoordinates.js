let pg;
let pg2;
//Declaracion de variables para las coordenadas
var alpha;

var beta;

var gamma;

var alphaS;

var betaS;

var gammaS;

//Definición de coordenadas baricentricas a partir de tres puntos de un triangulo (a, b, c) y un punto arbitrario p=(x,y)
function barycentric(ax, ay, bx, by, cx, cy, x, y) {
    var d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
    alpha = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / d;
    beta = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / d;
    gamma = 1.0 - alpha - beta;
    alphaS = nf(alpha, 1, 2);
    betaS = nf(beta, 1, 2);
    gammaS = nf(gamma, 1, 2);
}

// Declaracion de variables usadas en la realizacion de la cuadricula en el canvas
var squares;
var squaresF;
var row;
var col;
var pointA;
var i;
var j;

//Algoritmo de Rasterizacion que emplea coordenadas baricentricas
function drawSquares() {
    //Inicializacion de contadores
    i = 0;
    j = 0;
    col = 0;
    row = squaresF;
    //Recorrer las columnas y las filas
    for (i = 0; i <= squares; i++) {
        col = 0;
        for (j = 0; j <= squares; j++) {
            //Grosor del trazo
            strokeWeight(1);
            //Si el punto medio de la celda que estoy analizando esta dentro del area cubierta por el triangulo
            if (inside_triangle(ax, ay, bx, by, cx, cy, col + pointA, row + pointA)) {
                //Calcular las coordenadas baricentricas del punto medio de la celda
                barycentric(ax, ay, bx, by, cx, cy, col + pointA, row + pointA);
                //Rellenar la celda con la interpolacion entre las coordenadas baricentricas y los colores definidos
                pg2.fill(239 * alpha, 247 * beta, 255 * gamma);
                //Dibujar la celda recien analizada
                pg2.rect(col, row, squaresF, squaresF);
            } else {
                //Si el punto medio no está en el area cubierta por el triangulo
                //Rellenar de color blanco la celda
                pg2.fill(255, 255, 255);
                //Dibujar la celda recien analizada
                pg2.rect(col, row, squaresF, squaresF);
            }
            //Pintar el en canvas el punto medio de la celda analizada
            strokeWeight(3);
            stroke(153, 153, 255);
            point(col + pointA, row + pointA);
            //Poner el color de trazo en negro para el siguiente ciclo
            stroke(0);
            //Actualizar la variable col con el valor de la ubicacion del inicio de la siguiente columna de celdas
            col += squaresF;
        }
        //Actualizar la variable row con el valor de la ubicacion del inicio de la siguiente fila de celdas
        row += squaresF;
    }
    //Poner el rellenado en transparenete para el siguiente ciclo del canvas
    pg2.fill(255, 255, 255, 0);
}

// Comprobación de si un punto (x, y) dado esta dentro del área que cubre un triangulo con vertices a, b, c
// 1. Calcula coordenadas baricentricas del punto p
// 2. Comprueba si los valores de alpha, beta y gamma tienen valores entre 0 y 1, es decir demostrando que p está dentro del triangulo
function inside_triangle(ax, ay, bx, by, cx, cy, x, y) {
    var d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
    var alpha = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / d;
    var beta = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / d;
    var gamma = 1.0 - alpha - beta;
    return !(alpha < 0 || alpha > 1 || beta < 0 || beta > 1 || gamma < 0 || gamma > 1);
}

// Declaracion de variables para definir los tres puntos que conforman el triangulo
var ax;

var ay;

var bx;

var by;

var cx;

var cy;
// Setup del canvas con la inicialización de variables y la creación del canvas
function setup() {
    alpha = 0;
    beta = 0;
    gamma = 0;
    alphaS = null;
    betaS = null;
    gammaS = null;
    //Cantidad de celdas en alto y ancho que habrá en la cuadrícula
    squares = 20;
    //Valor del tammaño de cada celda de la cuadricula inicial
    squaresF = 10;
    //Contador de la fila y la columna inicial de la cuadricula
    row = 0;
    col = 0;
    //Punto medio inicial
    pointA = 0;
    //Contadores de ciclos
    i = 0;
    j = 0;
    //Coordenadas del triangulo inicial
    ax = 0;
    ay = 0;
    bx = 0;
    by = 0;
    cx = 0;
    cy = 0;
    //Creación del canvas
    createCanvas(800, 400);
    pg = createGraphics(400, 400);
    pg2 = createGraphics(400, 400);
    //Definir cantidad de pixeles por celda de la cuadrícula
    squaresF = ((width/2) / squares);
    // Punto medio de la primer celda
    pointA = (squaresF / 2);
    //Coordenadas del triangulo inicial
    //Definición del modo de color y escala de este
    pg.colorMode(RGB, 255);
    //Coordenadas del triangulo inicial
    ax = width / 8;
    ay = 50;
    bx = ax * 3;
    by = 50;
    cx = ((bx - ax) / 2) + ax;
    cy = height - 11;
}

function draw() {
    //Poner fondo blanco en el canvas
    background(255);
    pg.background(100);
    //pg2.background(254);
    //Dibujar la cuadrícula y rasterizar el tríangulo actual
    drawSquares();
    //Grosor del trazado 
    pg.strokeWeight(1);
    
    //Tazar con color negro
    pg.stroke(0);
    pg2.stroke(0);
    //Rellenar con color negro el triangulo actual
    pg.fill(1);
    pg.triangle(ax, ay, bx, by, cx, cy);
    pg2.triangle(ax, ay, bx, by, cx, cy);
    
    //Calcular coordenadas baricentricas
    barycentric(ax, ay, bx, by, cx, cy, mouseX, mouseY);
    //Estilizar tamaño de texto y alineación del mismo en el canvas
    pg.textSize(20);
    pg.textAlign(LEFT, CENTER);
    //Mostrar en pantalla los valores calculados de alpha, beta y gamma
    pg.fill(163, 217, 255);
    pg.text("λ0: " + alphaS, 10, 60);
    pg.fill(220, 247, 99);
    pg.text("λ1: " + betaS, 10, 80);
    pg.fill(239, 199, 194);
    pg.text("λ2: " + gammaS, 10, 100);

    pg.strokeWeight(2);
    //Si el mouse está en el area dentro del triangulo llenar los subtriangulos que se forman entre el mouse y los vertices con el color respectivo
    if (inside_triangle(ax, ay, bx, by, cx, cy, mouseX, mouseY)) {
        pg.stroke(0, 0, 0);
        pg.fill(239, 199, 194);
        pg.triangle(ax, ay, mouseX, mouseY, bx, by);
        pg.fill(163, 217, 255);
        pg.triangle(bx, by, mouseX, mouseY, cx, cy);
        pg.fill(220, 247, 99);
        pg.triangle(cx, cy, mouseX, mouseY, ax, ay);
    } else {
        pg.stroke(1, 0, 0);
    }
    //Marcador de punto en la ubicación del cursor en el canvas
    pg.point(mouseX, mouseY);

    //Cambio de coordenadas de los vertices del triangulo segun el click con los botones central, derecho e izquierdo
    if (mouseIsPressed) {
        if (mouseButton == LEFT) {
            ax = mouseX;
            ay = mouseY;
        }
        if (mouseButton == RIGHT) {
            bx = mouseX;
            by = mouseY;
        }
        if (mouseButton == CENTER) {
            cx = mouseX;
            cy = mouseY;
        }
    }

    image(pg, 0, 0)
    image(pg2, 400, 0, 400, 400)
}