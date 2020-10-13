let canvas;

// center point
let centerX = 0.0, centerY = 0.0;

let radius = 200, rotAngle = -90;
let accelX = 0.0, accelY = 0.0;
let deltaX = 0.0, deltaY = 0.0;
let springing = 0.0005, damping = 0.975;

//corner nodes
let nodes = 12;

//shape fill
let fillColor = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
let ascColor = [1, 1, 1];

//canvas blur
const MAX_BLUR = 15;
let blur = 0;
let ascBlur = 1;

//zero fill arrays
let nodeStartX = [];
let nodeStartY = [];
let nodeX = [];
let nodeY = [];
let angle = [];
let frequency = [];

// soft-body dynamics
let organicConstant = 1.0;

function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);

    //center shape in window
    centerX = width / 2;
    centerY = height / 2;

    //adjust mouse position
    mouseX = width / 2 + (Math.random() < 0.5 ? -1 : 1) * 80;
    mouseY = height / 2 + (Math.random() < 0.5 ? -1 : 1) * 80;

    //add style
    canvas.style("z-index", "-1");
    canvas.style('filter', `blur(${blur}px)`);
    canvas.position(0, 0);

    //initialize arrays to 0
    for (let i = 0; i < nodes; i++) {
        nodeStartX[i] = 0;
        nodeStartY[i] = 0;
        nodeY[i] = 0;
        nodeY[i] = 0;
        angle[i] = 0;
    }

    // iniitalize frequencies for corner nodes
    for (let i = 0; i < nodes; i++) {
        frequency[i] = random(5, 12);
    }

    noStroke();
    frameRate(30);
}

function draw() {
    //fade background
    fill(0, 100);
    rect(0, 0, width, height);
    drawShape();
    moveShape();
}

function drawShape() {
    //  calculate node  starting locations
    for (let i = 0; i < nodes; i++) {
        nodeStartX[i] = centerX + cos(radians(rotAngle)) * radius;
        nodeStartY[i] = centerY + sin(radians(rotAngle)) * radius;
        rotAngle += 360.0 / nodes;
    }

    // draw polygon
    curveTightness(organicConstant);
    fill(color(fillColor[0], fillColor[1], fillColor[2]));

    beginShape();
    for (let i = 0; i < nodes; i++) {
        curveVertex(nodeX[i], nodeY[i]);
    }
    for (let i = 0; i < nodes - 1; i++) {
        curveVertex(nodeX[i], nodeY[i]);
    }
    endShape(CLOSE);
}

function mouseMoved() {
    updateFill();
    canvas.style('filter', `blur(${blur}px)`);
    updateBlur();
}

function moveShape() {
    //move center point
    deltaX = mouseX - centerX;
    deltaY = mouseY - centerY;

    // create springing effect
    deltaX *= springing;
    deltaY *= springing;
    accelX += deltaX;
    accelY += deltaY;

    // move predator's center
    centerX += accelX;
    centerY += accelY;

    // slow down springing
    accelX *= damping;
    accelY *= damping;

    // change curve tightness
    organicConstant = 1 - ((abs(accelX) + abs(accelY)) * 0.1);

    //move nodes
    for (let i = 0; i < nodes; i++) {
        nodeX[i] = nodeStartX[i] + sin(radians(angle[i])) * (accelX * 2);
        nodeY[i] = nodeStartY[i] + sin(radians(angle[i])) * (accelY * 2);
        angle[i] += frequency[i];
    }
}

function updateFill() {
    for (let i = 0; i < 3; i++) {
        fillColor[i] = fillColor[i] + (Math.floor(Math.random() * 2) * ascColor[i]);
        if (fillColor[i] > 255) {
            fillColor[i] = 255;
            ascColor[i] = -1;
        }
        else if (fillColor[i] < 0) {
            fillColor[i] = 0;
            ascColor[i] = 1;
        }
    }
}

function updateBlur() {
    let factor = blur < 3 ? 1.05 : 1.2;
    blur = blur + (Math.floor(Math.random() * factor) * ascBlur);
    if (blur > MAX_BLUR) {
        blur = MAX_BLUR;
        ascBlur = -1;
    }
    else if (blur < 0) {
        blur = 0;
        ascBlur = 1;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }