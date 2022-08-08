"use strict";

//declarare variabile

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 50;
canvas.height = 400;

let startPosition = {x: 0, y: 0};
let lineCoordinates = {x: 0, y: 0};

let context = canvas.getContext("2d");
let startBackgroundColor = "transparent";
context.fillStyle = startBackgroundColor;
context.fillRect(0, 0, canvas.width, canvas.height);


let drawColor = "black";
let drawWidth = "2";
let isDrawing = false;
let isDrawingLine = false;
let isDrawingRectangle = false;
let isDrawingEllipse = false;
let restoreArray = [];
let index = -1;

//adaugare de event listener pe evenimentele de mouse

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

//functia de incepere desenare
function start(event) {
    isDrawing = true;
    context.beginPath();
    startPosition = getClientOffset(event);
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);

    if (event !== "mouseup" && event !== "mouseleave") {
        restoreArray.push(context.getImageData(0, 0, canvas.width, canvas.height));
        index++;
    }
}
//functia de desenare linie
const drawLine = () => {
    context.beginPath();
    context.moveTo(startPosition.x, startPosition.y);
    context.lineTo(lineCoordinates.x, lineCoordinates.y);
    context.stroke();
}
//functia de desenare dreptunghi
const drawRectangle = (event) => {
    context.beginPath();
    context.rect(startPosition.x, startPosition.y, event.clientX - startPosition.x - 25, event.clientY - startPosition.y - 100);
    context.stroke();
}
//functia de desenare elipsa
const drawEllipse = () => {
    context.beginPath();
    context.ellipse(startPosition.x, startPosition.y, Math.abs(event.clientX - startPosition.x - 25), Math.abs(event.clientY - startPosition.y - 100), Math.PI, 0, 2 * Math.PI);
    context.stroke();
}

//functia de desenare
function draw(event) {
    if (isDrawing && !isDrawingLine && !isDrawingRectangle && !isDrawingEllipse) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.strokeStyle = drawColor;
        context.lineWidth = drawWidth;
        context.lineCap = "round";
        context.lineJoin = "round"
        context.stroke();
    }
    if (isDrawing && isDrawingLine) {
        lineCoordinates = getClientOffset(event);
        clearCanvas();
        drawLine();
        context.putImageData(restoreArray[index], 0, 0);
    }
    if (isDrawing && isDrawingRectangle) {
        lineCoordinates = getClientOffset(event);
        clearCanvas();
        drawRectangle(event);
        context.putImageData(restoreArray[index], 0, 0);
    }
    if (isDrawing && isDrawingEllipse) {
        lineCoordinates = getClientOffset(event);
        clearCanvas();
        drawEllipse(event);
        context.putImageData(restoreArray[index], 0, 0);
    }
}
//functia de oprire desenare
function stop() {
    if (isDrawing) {
        context.stroke();
        context.closePath();
        isDrawing = false;
    }
}
// functia de schimbare culoare din color picker
function changeColorFromColorPicker() {
    let colorPickerValue = document.querySelector(".color-picker").value;
    console.log(colorPickerValue);
    drawColor = colorPickerValue;
    circle.style.background = drawColor;
}
//functia de schimbare culoare
function changeColor(element) {
    drawColor = element.style.background;
    circle.style.background = element.style.background;
}
//functia de curatare canvas
function clearCanvas() {
    context.fillStyle = startBackgroundColor;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
}
//functia de undo
function undo() {
    if (index <= 0) {
        clearCanvas();
    } else {
        context.putImageData(restoreArray[index], 0, 0);
        index--;
        restoreArray.pop();
    }
}
//functia de schimbare culoare background
function changeColorBk() {
    let color = document.getElementById('backgroundPick').value;
    let bkg = document.querySelector(".background_canvas");
    bkg.style.background = color;
}
//functia de salvare png
function save() {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png", 1);
    a.download = "image";
    a.click();
}

const getClientOffset = (event) => {
    const {pageX, pageY} = event.touches ? event.touches[0] : event;
    const x = pageX - canvas.offsetLeft;
    const y = pageY - canvas.offsetTop;

    return {
        x,
        y
    }
}

//Functiile handler pentru butoanele de linie, dreptunghi si elipse

let btnLine = document.querySelector("#btnLine");
let btnRectangle = document.querySelector("#btnRectangle");
let btnEllipse = document.querySelector("#btnEllipse");

function drawLineHandler() {
    isDrawingEllipse = false;
    isDrawingRectangle = false;
    btnRectangle.className = "btn btn-primary ms-2";
    btnEllipse.className = "btn btn-primary ms-2";
    isDrawingLine = !isDrawingLine;
    isDrawingLine ? btnLine.className += "btn btn-primary active ms-2" : btnLine.className = "btn btn-primary ms-2"
}

function drawRectangleHandler() {
    isDrawingEllipse = false;
    isDrawingLine = false;
    btnLine.className = "btn btn-primary ms-2";
    btnEllipse.className = "btn btn-primary ms-2";
    isDrawingRectangle = !isDrawingRectangle;
    isDrawingRectangle ? btnRectangle.className += "btn btn-primary active ms-2" : btnRectangle.className = "btn btn-primary ms-2"
}

function drawEllipseHandler() {
    isDrawingRectangle = false;
    isDrawingLine = false;
    btnLine.className = "btn btn-primary ms-2";
    btnRectangle.className = "btn btn-primary ms-2";
    isDrawingEllipse = !isDrawingEllipse;
    isDrawingEllipse ? btnEllipse.className += "btn btn-primary active ms-2" : btnEllipse.className = "btn btn-primary ms-2"
}
//desenare cu preview

const circle = document.querySelector('.circle');
window.addEventListener('mousemove', mouseMoveHandler);
window.addEventListener('mousedown', mouseDownHandler);
window.addEventListener('mouseup', mouseUpHandler);


function mouseMoveHandler(e) {
    circle.style.left = e.clientX - circle.offsetWidth / 2 + "px";
    circle.style.top = e.clientY - circle.offsetHeight / 2 + "px";
    circle.style.opacity = 1;
}

function mouseUpHandler(e) {
    circle.style.transform = "scale(1)";
    if (e.target.classList.contains('link')) {
        circle.style.transform = 'scale(5)';
        circle.style.opacity = 0;
    }
}

function mouseDownHandler() {
    circle.style.transform = "scale(1.5)";
}



