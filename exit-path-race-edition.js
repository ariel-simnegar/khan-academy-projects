
/** Miscellaneous */
// {

/* Bow to the almighty TAU. (Ooh, that rhymed!) */
var _TAU = 6.283185307179586;

/* This is for me */
var DEV_MODE = false;

/* Throws an error. Used in debugging */
var error = function(message) {
    var up = {
        message: message
    };
    throw up; /* ha ha */
};

/* Used to determine what to draw in the draw() loop */
var page = 'logo';

/*
Used to determine the amount of
time a player waits after death
*/
var deathPenaltyTime;

/*
Used to determine the time the players
wait after a new stage is loaded
*/
var NEW_STAGE_WAIT_TIME = 180;

/* Used to animate game outcome text */
var outcomeAnimationTimer;

/* The amount players' points are multiplied by in races */
var pointMultiplier;

/* Boolean: Is the tutorial being played */
var isTutorial;

/* Boolean: Is the mouse clicking */
var mouseIsClicking = false;

mouseReleased = function() {
    mouseIsClicking = true;
};

/*
Utility function used to check
if the mouse is over a rectangle
*/
var mouseIsOver = function(x, y, w, h) {
    return mouseX > x && mouseX < x + w &&
           mouseY > y && mouseY < y + h;
};

/* Font variables */
var trebuchet5 = createFont('Trebuchet MS Bold', 10),
	trebuchet4 = createFont('Trebuchet MS Bold', 15),
	trebuchet3 = createFont('Trebuchet MS Bold', 20),
	trebuchet2 = createFont('Trebuchet MS Bold', 50),
	trebuchet1 = createFont('Trebuchet MS Bold', 80),
	arial4 = createFont('Arial', 10),
	arial3 = createFont('Arial Bold', 12),
	arial2 = createFont('Arial Bold', 50),
	arial1 = createFont('Arial Bold', 75);
 
/* Set frame rate variables */
frameCount = 0;
frameRate(60);

/* Timer for the stage */
var stageTimer = 0;

/* Transparency of white flash */
var transparency = 0;

/* Boolean: `false` only during the first frame */
var initialized = false;

/* Caches `Object.create` */
var inherit = Object.create;

/* Utility function: Adds commas to a number */
var formatNumber = function(n) {
    var string = n + '',
        length = string.length - 1;
    if (length < 3) {
        return string;
    }
    var formatted = '',
        index = -1,
        commaIndex = length % 3;
    while (++index < length) {
        formatted += string[index];
        if ((index - commaIndex) % 3 === 0) {
            formatted += ',';
        }
    }
    return formatted + string[length];
};

/* Fake context element */
var c = {
    toString: function() {
        return '[object CanvasRenderingContext2D]';
    },
    fillStyle: '#FFFFFF',
    /* Parses c.fillStyle */
    fill: function() {
        var fillStyle = this.fillStyle;
        if (fillStyle[0] === '#') {
            switch (fillStyle.length) {
                /* Hex: /#[0-9A-Fa-f]{3}/ */
                case 4:
                    fill(
                        +('0x' + fillStyle[1]) * 16,
                        +('0x' + fillStyle[2]) * 16,
                        +('0x' + fillStyle[3]) * 16
                    );
                break;
                case 7:
                /* Hex: /#[0-9A-Fa-f]{6}/ */
                    fill(
                        +('0x' + fillStyle[1] + fillStyle[2]),
                        +('0x' + fillStyle[3] + fillStyle[4]),
                        +('0x' + fillStyle[5] + fillStyle[6])
                    );
                break;
            }
        }
        else {
            var index = -1,
                length = fillStyle.length;
            while (++index < length) {
                if (fillStyle[index] === '(') {
                    switch (fillStyle.substring(0, index)) {
                        case 'rgb':
                            /* RGB: /rgb *\( *[0-9]{3}, *[0-9]{3}, *[0-9]{3}\) * */
                            var r = '',
                                g = '',
                                b = '';
                            while (++index < length) {
                                var char = fillStyle[index];
                                if (char === ',') {
                                    break;
                                }
                                else if (c !== ' ') {
                                    r += char;
                                }
                            }
                            while (++index < length) {
                                var char = fillStyle[index];
                                if (char === ',') {
                                    break;
                                }
                                else if (c !== ' ') {
                                    g += char;
                                }
                            }
                            while (++index < length) {
                                var char = fillStyle[index];
                                if (char === ')') {
                                    break;
                                }
                                else if (c !== ' ') {
                                    b += char;
                                }
                            }
                            fill(+r, +g, +b);
                        break;
                        case 'rgba':/* RGBA: /rgba *\( *[0-9]{3}, *[0-9]{3}, *[0-9]{3}, *[0-9]{3}\) * */
                            var r = '',
                                g = '',
                                b = '',
                                a = '';
                            while (++index < length) {
                                var char = fillStyle[index];
                                if (char === ',') {
                                    break;
                                }
                                else if (c !== ' ') {
                                    r += char;
                                }
                            }
                            while (++index < length) {
                                var char = fillStyle[index];
                                if (char === ',') {
                                    break;
                                }
                                else if (c !== ' ') {
                                    g += char;
                                }
                            }
                            while (++index < length) {
                                var char = fillStyle[index];
                                if (char === ',') {
                                    break;
                                }
                                else if (c !== ' ') {
                                    b += char;
                                }
                            }
                            while (++index < length) {
                                var char = fillStyle[index];
                                if (char === ')') {
                                    break;
                                }
                                else if (c !== ' ') {
                                    a += char;
                                }
                            }
                            fill(+r, +g, +b, +a * 255);
                        break;
                    }
                }
            }
        }
    },
    fillRect: function(x, y, w, h) {
        this.fill();
        noStroke();
        rect(x, y, w, h);
    },
    drawImage: function(img, x, y, w, h) {
        image({
            sourceImg: img,
            width: img.width,
            height: img.height
        }, x, y, w, h);
    }
};

/* Checks if special keys are being pressed */
var pressingW = false,
	pressingA = false,
	pressingD = false,
	pressing1 = false,
	pressingLEFT = false,
	pressingRIGHT = false,
	pressingUP = false,
	pressingSPACE = false;

keyPressed = function() {
	switch (keyCode) {
        case 87:
            pressingW = true;
        break;
        case 65:
            pressingA = true;
        break;
        case 68:
            pressingD = true;
        break;
        case 49:
            pressing1 = true;
        break;
        case 37:
            pressingLEFT = true;
        break;
        case 39:
            pressingRIGHT = true;
        break;
        case 38:
            pressingUP = true;
        break;
        case 32:
            pressingSPACE = true;
        break;
	}
};

keyReleased = function() {
	switch (keyCode) {
        case 87:
            pressingW = false;
        break;
        case 65:
            pressingA = false;
        break;
        case 68:
            pressingD = false;
        break;
        case 49:
	        pressing1 = false;
        break;
        case 37:
            pressingLEFT = false;
        break;
        case 39:
            pressingRIGHT = false;
        break;
        case 38:
            pressingUP = false;
        break;
        case 32:
            pressingSPACE = false;
        break;
	}
};

// }

/** Game Images */
// {

/* Creates functions that return images */
var createImageLoader = function(width, height, imageFunc) {
	return function() {
        background(0, 0, 0, 0);
        imageFunc();
        return get(0, 0, width, height).sourceImg;
	};
};

/* Image objects */
var leftMovingSpikeImage,
    rightMovingSpikeImage,
    upMovingSpikeImage,
    downMovingSpikeImage,
    leftSpikeImage,
    rightSpikeImage,
    upSpikeImage,
    downSpikeImage,
    blockImage,
    flowMotivatorImage,
    flowMotivatorHaloImage,
    flowInhibitorImage,
    flowInhibitorHaloImage,
    bouncerImage,
    bouncerTopImage,
    leftMoverImage,
    rightMoverImage,
    flagImage,
    wheelImage,
    crusherImage,
    flowGUIImage,
    teleporterImage;

var loadLeftMovingSpikeImage = createImageLoader(14, 14, function() {
    noStroke();
    fill(255, 255, 255);
    triangle(14, 0, 0, 3.5, 14, 3.5);
    triangle(14, 7, 0, 10.5, 14, 10.5);
    fill(196, 196, 196);
    triangle(14, 7, 0, 3.5, 14, 3.5);
    triangle(14, 14, 0, 10.5, 14, 10.5);
});

var loadRightMovingSpikeImage = createImageLoader(14, 14, function() {
    noStroke();
    fill(255, 255, 255);
    triangle(0, 0, 0, 3.5, 14, 3.5);
    triangle(0, 7, 0, 10.5, 14, 10.5);
    fill(196, 196, 196);
    triangle(0, 7, 0, 3.5, 14, 3.5);
    triangle(0, 14, 0, 10.5, 14, 10.5);
});

var loadUpMovingSpikeImage = createImageLoader(14, 14, function() {
    noStroke();
    fill(255, 255, 255);
    triangle(0, 14, 3.5, 14, 3.5, 0);
    triangle(7, 14, 10.5, 14, 10.5, 0);
    fill(196, 196, 196);
    triangle(3.5, 0, 3.5, 14, 7, 14);
    triangle(10.5, 0, 10.5, 14, 14, 14);
});

var loadDownMovingSpikeImage = createImageLoader(14, 14, function() {
    noStroke();
    fill(255, 255, 255);
    triangle(0, 0, 3.5, 14, 3.5, 0);
    triangle(7, 0, 10.5, 14, 10.5, 0);
    fill(196, 196, 196);
    triangle(3.5, 0, 3.5, 14, 7, 0);
    triangle(10.5, 0, 10.5, 14, 14, 0);
});

var loadLeftSpikeImage = createImageLoader(7, 14, function() {
    noStroke();
    fill(255);
    triangle(6, 0, 6, 7 / 3, 0, 7 / 3);
    triangle(6, 14 / 3, 6, 28 / 3, 0, 7);
    triangle(6, 28 / 3, 6, 35 / 3, 0, 35 / 3);
    fill(196);
    triangle(6, 7 / 3, 0, 7 / 3, 6, 14 / 3);
    triangle(6, 28 / 3, 6, 7, 0, 7);
    triangle(6, 35 / 3, 6, 14, 0, 35 / 3);
    rect(6, 0, 1, 14);
});

var loadRightSpikeImage = createImageLoader(7, 14, function() {
    noStroke();
    fill(255);
    triangle(1, 0, 1, 7 / 3, 7, 7 / 3);
    triangle(1, 14 / 3, 1, 7, 7, 7);
    triangle(1, 28 / 3, 1, 35 / 3, 7, 35 / 3);
    fill(196);
    triangle(1, 7 / 3, 7, 7 / 3, 1, 14 / 3);
    triangle(1, 28 / 3, 1, 7, 7, 7);
    triangle(1, 35 / 3, 1, 14, 7, 35 / 3);
    rect(0, 0, 1, 14);
});

var loadUpSpikeImage = createImageLoader(14, 7, function() {
    noStroke();
    fill(255);
    triangle(0, 6, 7 / 3, 6, 7 / 3, 0);
    triangle(14 / 3, 6, 7, 6, 7, 0);
    triangle(28 / 3, 6, 35 / 3, 6, 35 / 3, 0);
    fill(196);
    triangle(7 / 3, 6, 7 / 3, 0, 14 / 3, 6);
    triangle(28 / 3, 6, 7, 6, 7, 0);
    triangle(35 / 3, 6, 14, 6, 35 / 3, 0);
    rect(0, 6, 14, 1);
});

var loadDownSpikeImage = createImageLoader(14, 7, function() {
    noStroke();
    fill(255);
    triangle(0, 1, 7 / 3, 1, 7 / 3, 7);
    triangle(14 / 3, 1, 7, 1, 7, 7);
    triangle(28 / 3, 1, 35 / 3, 1, 35 / 3, 7);
    fill(196);
    triangle(7 / 3, 1, 7 / 3, 7, 14 / 3, 1);
    triangle(28 / 3, 1, 7, 1, 7, 7);
    triangle(35 / 3, 1, 14, 1, 35 / 3, 7);
    rect(0, 0, 14, 1);
});

var loadBlockImage = createImageLoader(14, 14, function() {
	noStroke();
	for (var i = 0; i < 14; i++) {
        fill(64 + (i << 1));
        rect(i, 0, 1, 15);
	}
	stroke(96);
	strokeWeight(2);
	noFill();
	rect(0, 0, 14, 14);
});

var loadFlowMotivatorImage = createImageLoader(14, 14, function() {
    stroke(128);
    strokeWeight(2);
    noFill();
    rect(0, 0, 14, 14);
    fill(0, 255, 0, 200);
    ellipse(7, 7, 3.5, 3.5);
    noFill();
    bezier(0, 0, 0, 14, 14, 14, 14, 0);
    bezier(0, 14, 0, 0, 14, 0, 14, 14);
    bezier(0, 0, 14, 0, 14, 14, 0, 14);
    bezier(14, 0, 0, 0, 0, 14, 14, 14);
});

var loadFlowMotivatorHaloImage = createImageLoader(84, 84, function() {
    noStroke();
    fill(0, 255, 0, 10);
    for (var i = 0; i < 84; i += 2) {
        ellipse(42, 42, i, i);
    }
});

var loadFlowInhibitorImage = createImageLoader(14, 14, function() {
    stroke(128);
    strokeWeight(2);
    noFill();
    rect(0, 0, 14, 14);
    fill(255, 0, 0, 200);
    ellipse(7, 7, 3.5, 3.5);
    noFill();
    bezier(0, 0, 0, 14, 14, 14, 14, 0);
    bezier(0, 14, 0, 0, 14, 0, 14, 14);
    bezier(0, 0, 14, 0, 14, 14, 0, 14);
    bezier(14, 0, 0, 0, 0, 14, 14, 14);
});

var loadFlowInhibitorHaloImage = createImageLoader(84, 84, function() {
    noStroke();
    fill(255, 0, 0, 10);
    for (var i = 0; i < 84; i += 2) {
        ellipse(42, 42, i, i);
    }
});

var loadBouncerImage = createImageLoader(14, 14, function() {
    fill(128, 128, 128);
    noStroke();
    for (var i = 0; i < 14; i += 2) {
        rect(0, i, 14, 1);
    }
    fill(64, 64, 64);
    for (var i = 0; i < 14; i += 2) {
        rect(0, i + 1, 14, 1);
    }
    stroke(32, 32, 32);
    noFill();
    rect(0, 0, 14, 14,
    5, 5, 0, 0);
});

var loadBouncerTopImage = createImageLoader(14, 4, function() {
    stroke(128);
    noFill();
    rect(0, 0, 14, 5);
    noStroke();
    fill(128);
    for (var i = 0; i < 14; i += 3) {
        rect(i, 0, 1, 5);
    }
    fill(64);
    for (var i = 1; i < 15; i += 3) {
        rect(i + 1, 0, 1, 5);
    }
});

var loadLeftMoverImage = createImageLoader(14, 14, function() {
    noStroke();
    for (var i = 0; i < 14; i++) {
        fill(64 + (i << 1));
        rect(i, 0, 1, 15);
    }
    stroke(96);
    strokeWeight(2);
    noFill();
    rect(0, 0, 14, 14);
    stroke(128);
    strokeWeight(1.5);
    beginShape();
    vertex(8, 4);
    vertex(5, 7);
    vertex(8, 10);
    endShape();
});

var loadRightMoverImage = createImageLoader(14, 14, function() {
    noStroke();
    for (var i = 0; i < 14; i++) {
        fill(64 + (i << 1));
        rect(i, 0, 1, 15);
    }
    stroke(96);
    strokeWeight(2);
    noFill();
    rect(0, 0, 14, 14);
    stroke(128);
    strokeWeight(1.5);
    beginShape();
    vertex(6, 4);
    vertex(9, 7);
    vertex(6, 10);
    endShape();
});

var loadFlagImage = createImageLoader(28, 70, function() {
    pushMatrix();
    scale(0.7);
    fill(128, 128, 128);
    noStroke();
    for (var i = 5; i > 0; i -= 0.5) {
        fill(128 - 10 * i, 128 - 10 * i, 128 - 10 * i);
        rect(17.5 + i, 0, 0.5, 100);
    }
    rect(0, 95, 40, 5, 
    5, 5, 0, 0);
    fill(96, 96, 96);
    rect(10, 0, 20, 5,
    0, 0, 5, 5);
    for (var i = 0; i < 9; i++) {
        stroke(96, 96, 96);
        strokeWeight(1);
        ellipse(13, 10 + 7 * i, 4, 4);
        line(13, 10 + 7 * i, 18, 10 + 7 * i);
    }
    popMatrix();
});

var loadWheelImage = createImageLoader(140, 140, function() {
    pushMatrix();
    translate(70, 70);
    fill(212, 212, 212);
    noStroke();
    for (var i = 0; i < 20; i++) {
        rotate(18);
        beginShape();
        vertex(-18, 30);
        vertex(0, 70);
        vertex(18, 30);
        endShape();
    }
    ellipse(0, 0, 62, 62);
    popMatrix();
    fill(255, 255, 255);
    stroke(64, 64, 64);
    strokeWeight(1);
    ellipse(70, 70, 10, 10);
});

var loadCrusherImage = createImageLoader(14, 16, function() {
    noStroke();
    fill(255, 255, 255);
    rect(0, 0, 14, 2);
    triangle(0, 2, 3.5, 2, 3.5, 16);
    triangle(7, 2, 10.5, 2, 10.5, 16);
    fill(196, 196, 196);
    triangle(3.5, 2, 3.5, 16, 7, 2);
    triangle(10.5, 2, 10.5, 16, 14, 2);
});

var loadFlowGUIImage = createImageLoader(342, 22, function() {
    pushMatrix();
    translate(-107.5, -8);
    textFont(arial3);
    textAlign(LEFT, TOP);
    fill(196);
    text('FLOW', 107.5, 8);
    stroke(0, 0, 0);
    strokeWeight(0.5);
    noFill();
    rect(150, 8, 300, 22);
    noStroke();
    fill(32, 32, 32);
    rect(150, 8, 75, 10);
    rect(150, 28, 75, 3);
    rect(235, 18, 215, 13);
    triangle(225, 8, 225, 18, 235, 8);
    triangle(235, 18, 235, 30, 222.5, 30);
    stroke(128, 128, 128);
    line(225, 8, 225, 30);
    popMatrix();
});

var loadTeleporterImage = createImageLoader(14, 21, function() {
    fill(96);
    noStroke();
    rect(0, 0, 2, 21);
    rect(12, 0, 2, 21);
    rect(2, 0, 10, 2);
    rect(2, 12, 10, 9);
    
    fill(255, 255, 255, 64);
    rect(2, 2, 10, 10);
    rect(10, 3, 1, 8, 5);
    
    fill(64);
    rect(1, 12.5, 12, 1, 5);
    rect(1, 17.5, 12, 1, 5);
    ellipse(3, 16, 3, 3);
    ellipse(7, 16, 3, 3);
    ellipse(11, 16, 3, 3);
});

// }

/** Game Objects */
// {

var p1, p2;

/*
Bitmasks to get information
stored in Uint32 data
*/
var X_MASK = 0xFFFF, /* First 16 bits [0, 65535] */
    Y_MASK = 0x1FF0000, /* Next 9 bits [0, 511] */
    R_MASK = 0xFE000000; /* Next 7 bits [0, 63] */

/*
Arrays that store Uint32
data for spike positions
*/
var leftSpikes = [],
    rightSpikes = [],
    upSpikes = [],
    downSpikes = [];

/*
Arrays that store [x, y, leftX, rightX, moving]
vectors representing left/right moving spikes
*/
var leftMovingSpikes = [],
    rightMovingSpikes = [];

/*
Arrays that store [x, y, topY, bottomY, moving]
vectors representing up/down moving spikes
*/
var upMovingSpikes = [],
    downMovingSpikes = [];

/*
Arrays that store Uint32
data for block positions
*/
var blocks = [],
	blockFixtures = [];

/*
Array that stores [x, y, vx, vy, life]
vectors representing flow motivator particles
*/
var flowMotivatorParticles = [];

/*
Array that stores [x, y, vx, vy, life]
vectors representing flow inhibitor particles
*/
var flowInhibitorParticles = [];

/*
Arrays that store [x, y, a] vectors
representing flow motivator positions
*/
var flowMotivators = [],
    flowMotivatorFixtures = [];

/*
Arrays that store [x, y, a] vectors
representing flow inhibitor positions
*/
var flowInhibitors = [],
    flowInhibitorFixtures = [];

/*
Arrays that store [x, y, animation] vectors
representing bouncer positions and animation
values and [x, y] vectors representing bouncer
positions respectively
*/
var bouncers = [],
    bouncerFixtures = [];

/*
Arrays that store [x, y] vectors
representing mover positions
*/
var leftMovers = [],
    leftMoverFixtures = [],
    rightMovers = [],
    rightMoverFixtures = [];

/*
Array that stores objects
with prototype `originalFlag`
*/
var flags = [];

/*
Array that stores [ox, oy, v, a]
vectors representing pendulum properties
*/
var pendulums = [];

/*
Array that stores Uint32
data for wheel positions
*/
var wheels = [];

/*
Array that stores [x, y, startY, stopY, isFalling]
vectors representing crusher values
*/
var crushers = [];

/*
Array that stores [x, y, tx, ty, t, a, c, p1in, p2in]
vectors representing teleporter positions, sync
values, and player-in values
*/
var teleporters = [];

/* Clamps the lens's view */
var lensLeft = 0,
	lensRight = Infinity;

/* Stores x-coord of the end of the stage */
var endX = 0;

/* Applies collisions to a player shard */
var shardCollide = function(s, vx, vy) {
    var x = s[0],
        y = s[1],
        w = s[2],
        h = s[3];
    var index = bouncers.length;
    while (index--) {
        var b = bouncers[index],
            bx = b[0];
        if (bx < x + 14 && bx + 14 > x) {
            var by = b[1];
            if (by < y + 14 && by + 14 > y) {
                if (vx < 0) {
                    s[4] = vx * -1 / 3;
                    x = bx + 14;
                }
                else if (vx > 0) {
                    s[4] = vx * -1 / 3;
                    x = bx - w;
                }
                if (vy < 0) {
                    s[4] *= 0.8;
                    s[5] = vy * -1 / 3;
                    y = by + 14;
                }
                else if (vy > 0) {
                    s[5] = -4.2;
                    y = by - 14;
                    b[2] = 10;
                }
            }
        }
    }
    index = leftMovers.length;
    while (index--) {
        var m = leftMovers[index],
            mx = m & X_MASK;
        if (mx < x + w && mx + 14 > x) {
            var my = (m & Y_MASK) >> 16;
            if (my < y + h && my + 14 > y) {
                if (vx < 0) {
                    s[4] = vx * -1 / 3;
                    x = mx + 14;
                }
                else if (vx > 0) {
                    s[4] = vx * -1 / 3;
                    x = mx - w;
                }
                if (vy < 0) {
                    s[4] *= 0.8;
                    s[5] = vy * -1 / 3;
                    y = my + 14;
                }
                else if (vy > 0) {
                    s[4] *= 0.8;
                    s[5] = vy * -1 / 3;
                    y = my - h;
                    x -= 1;
                }
            }
        }
    }
    index = rightMovers.length;
    while (index--) {
        var m = rightMovers[index],
            mx = m & X_MASK;
        if (mx < x + w && mx + 14 > x) {
            var my = (m & Y_MASK) >> 16;
            if (my < y + h && my + 14 > y) {
                if (vx < 0) {
                    s[4] = vx * -1 / 3;
                    x = mx + 14;
                }
                else if (vx > 0) {
                    s[4] = vx * -1 / 3;
                    x = mx - w;
                }
                if (vy < 0) {
                    s[4] *= 0.8;
                    s[5] = vy * -1 / 3;
                    y = my + 14;
                }
                else if (vy > 0) {
                    s[4] *= 0.8;
                    s[5] = vy * -1 / 3;
                    y = my - h;
                    x += 1;
                }
            }
        }
    }
    index = blocks.length;
    while (index--) {
        var b = blocks[index],
            bx = b & X_MASK;
        if (bx < x + w && bx + 14 > x) {
            var by = (b & Y_MASK) >> 16;
            if (by < y + h && by + 14 > y) {
                if (vx < 0) {
                    s[4] = vx * -1 / 3;
                    x = bx + 14;
                }
                else if (vx > 0) {
                    s[4] = vx * -1 / 3;
                    x = bx - w;
                }
                if (vy < 0) {
                    s[4] *= 0.8;
                    s[5] = vy * -1 / 3;
                    y = by + 14;
                }
                else if (vy > 0) {
                    s[4] *= 0.8;
                    s[5] = vy * -1 / 3;
                    y = by - h;
                }
            }
        }
    }
    s[0] = x;
    s[1] = y;
};

/*
Objects intended to be prototypes
have names that start with original-.
*/
var originalPlayer = {
	startX: 0,
	startY: 0,
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	r: 255,
	g: 255,
	b: 255,
	colorString: 'rgb(255,255,255)',
	partialAlphaString: 'rgba(255,255,255,',
	lensX: 300,
	flowLevel: 0,
	/* Boolean: Player is jumping */
	jumping: true,
	/* Boolean: Player is bouncing */
	bouncing: true,
	/* Boolean: Player is flowing */
	flowing: false,
	/*
	Array that stores [x, y, w, h, vx, vy, life]
	vectors representing player shards
	*/
	shards: [],
	/*
	Array that stores [x, y, vx, vy, life]
	vectors representing flow particles
	*/
	particles: [],
	/*
	Array that stores [x, y, life] vectors
	representing past player positions
	*/
	selves: [],
	/* The amount of time players wait frozen */
	waitTimer: 0,
	/* Stores the player's points */
	points: 0,
	/* Boolean: player completed the stage */
	stageComplete: false,
	setColor: function(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.colorString = 'rgb(' + r + ',' + g + ',' + b + ')';
        this.partialAlphaString = 'rgba(' + r + ',' + g + ',' + b + ',';
	},
	death: function() {
        var x = this.x,
            y = this.y,
            index = Math.random() * 5 + 5 | 0,
            shards = this.shards;
        while (index--) {
            var vx, vy;
            do {
                vx = Math.random() * 2 - 1;
            }
            while (vx >= -0.07 && vx <= 0.07);
            do {
                vy = Math.random() * 2 - 1;
            }
            while (vy >= -0.07 && vy <= 0.07);
            shards.push([
                x + 7,
                y + 7,
                Math.random() * 3 + 2,
                Math.random() * 3 + 2,
                vx,
                vy,
                Math.random() * 100 + 255 | 0
            ]);
        }
        this.x = this.startX;
        this.y = this.startY;
        this.vx = this.vy = this.flowLevel = 0;
        this.flowing = false;
        this.waitTimer = deathPenaltyTime;
	},
	/*
	Applies collisions; called 120 times a
	second. O(n) where n is the number of
	ingame objects; in practice this doesn't
	add up to much.
	*/
	collide: function(vx, vy, up) {
        var x = this.x,
            y = this.y,
            index = flowMotivators.length;
        while (index--) {
            var f = flowMotivators[index],
                fx = f[0];
            if (fx < x + 14 && fx + 14 > x) {
                var fy = f[1];
                if (fy < y + 14 && fy + 14 > y) {
                    f[2] = 42;
                    var flowLevel = this.flowLevel + 5;
                    if (flowLevel > 80) {
                        this.flowLevel = 80;
                    }
                    else {
                        this.flowLevel = flowLevel;
                    }
                    if (vx < 0) {
                        this.vx = 0;
                        x = fx + 14;
                    }
                    else if (vx > 0) {
                        this.vx = 0;
                        x = fx - 14;
                    }
                    if (vy < 0) {
                        this.vy = 0;
                        y = fy + 14;
                    }
                    else if (vy > 0) {
                        this.vy = 0;
                        y = fy - 14;
                        this.jumping = this.bouncing = false;
                    }
                }
            }
        }
        index = flowInhibitors.length;
        while (index--) {
            var f = flowInhibitors[index],
                fx = f[0];
            if (fx < x + 14 && fx + 14 > x) {
                var fy = f[1];
                if (fy < y + 14 && fy + 14 > y) {
                    f[2] = 42;
                    this.flowLevel = 0;
                    if (vx < 0) {
                        this.vx = 0;
                        x = fx + 14;
                    }
                    else if (vx > 0) {
                        this.vx = 0;
                        x = fx - 14;
                    }
                    if (vy < 0) {
                        this.vy = 0;
                        y = fy + 14;
                    }
                    else if (vy > 0) {
                        this.vy = 0;
                        y = fy - 14;
                        this.jumping = this.bouncing = false;
                    }
                }
            }
        }
        index = bouncers.length;
        while (index--) {
            var b = bouncers[index],
                bx = b[0];
            if (bx < x + 14 && bx + 14 > x) {
                var by = b[1];
                if (by < y + 14 && by + 14 > y) {
                    if (vx < 0) {
                        this.vx = 0;
                        x = bx + 14;
                    }
                    else if (vx > 0) {
                        this.vx = 0;
                        x = bx - 14;
                    }
                    if (vy < 0) {
                        this.vy = 0;
                        y = by + 14;
                    }
                    else if (vy > 0) {
                        this.vy = up ? -7.385 : -4.2;
                        y = by - 14;
                        this.jumping = this.bouncing = true;
                        b[2] = 10;
                    }
                }
            }
        }
        index = leftMovers.length;
        while (index--) {
            var m = leftMovers[index],
                mx = m & X_MASK;
            if (mx < x + 14 && mx + 14 > x) {
                var my = (m & Y_MASK) >> 16;
                if (my < y + 14 && my + 14 > y) {
                    if (vx < 0) {
                        this.vx = 0;
                        x = mx + 14;
                    }
                    else if (vx > 0) {
                        this.vx = 0;
                        x = mx - 14;
                    }
                    if (vy < 0) {
                        this.vy = 0;
                        y = my + 14;
                    }
                    else if (vy > 0) {
                        this.vy = 0;
                        y = my - 14;
                        x -= 1;
                        this.jumping = this.bouncing = false;
                    }
                }
            }
        }
        index = rightMovers.length;
        while (index--) {
            var m = rightMovers[index],
                mx = m & X_MASK;
            if (mx < x + 14 && mx + 14 > x) {
                var my = (m & Y_MASK) >> 16;
                if (my < y + 14 && my + 14 > y) {
                    if (vx < 0) {
                        this.vx = 0;
                        x = mx + 14;
                    }
                    else if (vx > 0) {
                        this.vx = 0;
                        x = mx - 14;
                    }
                    if (vy < 0) {
                        this.vy = 0;
                        y = my + 14;
                    }
                    else if (vy > 0) {
                        this.vy = 0;
                        y = my - 14;
                        x += 1;
                        this.jumping = this.bouncing = false;
                    }
                }
            }
        }
        index = blocks.length;
        while (index--) {
            var b = blocks[index],
                bx = b & X_MASK;
            if (bx < x + 14 && bx + 14 > x) {
                var by = (b & Y_MASK) >> 16;
                if (by < y + 14 && by + 14 > y) {
                    if (vx < 0) {
                        this.vx = 0;
                        x = bx + 14;
                    }
                    else if (vx > 0) {
                        this.vx = 0;
                        x = bx - 14;
                    }
                    if (vy < 0) {
                        this.vy = 0;
                        y = by + 14;
                    }
                    else if (vy > 0) {
                        this.vy = 0;
                        y = by - 14;
                        this.jumping = this.bouncing = false;
                    }
                }
            }
        }
        this.x = x;
        this.y = y;
	},
	update: function(left, right, up, flowKey) {
        var lensX = this.lensX,
            waitTimer = this.waitTimer;
        lensX += 60 - (this.x + lensX) / 5;
        if (lensX < lensRight) {
            lensX = lensRight;
        }
        if (lensX > lensLeft) {
            lensX = lensLeft;
        }
        this.lensX = lensX;
        if (waitTimer === 0 && !this.stageComplete) {
            var vx = this.vx,
                vy = this.vy,
                flowLevel = this.flowLevel;
            if (flowKey) {
                if (flowLevel >= 20) {
                    this.flowing = true;
                }
            }
            else {
                this.flowing = false;
            }
            var flowing = this.flowing;
            if (left) {
                vx -= 0.21;
                if (flowing) {
                    if (vx < -7.35) {
                        vx = -7.35;
                    }
                }
                else {
                    if (vx < -2.45) {
                        vx = -2.45;
                    }
                    flowLevel += 0.23;
                }
            }
            else if (right) {
                vx += 0.21;
                if (flowing) {
                    if (vx > 7.35) {
                        vx = 7.35;
                    }
                }
                else {
                    if (vx > 2.45) {
                        vx = 2.45;
                    }
                    flowLevel += 0.23;
                }
            }
            else {
                vx *= 0.8;
            }
            if ((vx | 0) === 0 && !flowing) {
                flowLevel -= 2.5;
            }
            if (up) {
                if (!this.jumping) {
                    vy -= 2.1;
                }
                if (vy < 0 && !this.bouncing) {
                    vy -= 0.077;
                }
            }
            this.vx = vx;
            this.vy = vy;
            if (flowing) {
                flowLevel -= 0.5;
            }
            if (flowLevel > 0) {
                if (flowLevel < 80) {
                    this.flowLevel = flowLevel;
                }
                else {
                    this.flowLevel = 80;
                }
            }
            else {
                this.flowLevel = 0;
                if (flowing) {
                    this.flowing = false;
                }
            }
            /* Apply collisions */
            this.jumping = true;
            this.x += vx;
            this.collide(vx, 0, false);
            this.y += vy;
            this.collide(0, vy, up);
            this.vy += 0.14;
            /* Check height */
            if (this.y > 280) {
                this.x = this.startX;
                this.y = this.startY;
                this.vx = this.vy = this.flowLevel = 0;
                this.flowing = false;
                this.waitTimer = deathPenaltyTime;
            }
        }
        else {
            this.waitTimer = waitTimer - 1;
        }
        /* Manage shards */
        var shards = this.shards,
            index = shards.length;
        /* Remove oldest shards if there are too many */
        if (index > 50) {
            shards.splice(0, index -= 50);
        }
        while (index--) {
            var s = shards[index],
                svx = s[4],
                svy = s[5],
                sy = s[1] + svy;
            if (
                svx < -0.035 || svx > 0.035 ||
                svy < -0.035 || svy > 0.035
            ) {
                s[0] += svx;
                shardCollide(s, svx, 0);
                s[1] = sy;
                shardCollide(s, 0, svy);
                s[5] += 0.14;
            }
            if (--s[6] <= 0 || sy > 280) {
                shards.splice(index, 1);
            }
        }
        /* Manage selves and particles */
        if (this.flowing) {
            var px = this.x,
                py = this.y;
            this.selves.push([px | 0, py | 0, 128]);
            this.particles.push(
                [
                    px + 7,
                    py + Math.random() * 14,
                    this.vx * -0.2,
                    Math.random() * 1.4 - 0.7,
                    255
                ]
            );
        }
        /* Complete the stage */
        if (this.x >= endX) {
            this.vx = this.vy = this.flowLevel = 0;
            this.stageComplete = true;
            this.flowing = false;
            this.jumping = this.bouncing = true;
        }
    },
	draw: function(translateX, translateY) {
        var x = this.x,
            y = this.y,
            flowing = this.flowing,
            partialAlphaString = this.partialAlphaString,
            selves = this.selves,
            index = selves.length;
        while (index--) {
            var s = selves[index],
                sx = s[0],
                sy = s[1],
                life = s[2];
            if (
                sx + 14 >= -translateX  &&
                sx <= -translateX + 600 &&
                sy + 14 >= 0
            ) {
                c.fillStyle = 'rgba(255,255,255,' +
                    ((life > 255 ? 255 : life) / 2.55 | 0) / 100 + ')';
                c.fillRect(translateX + sx, translateY + sy, 14, 14);
            }
            if ((s[2] = life - 1.5) <= 0) {
                selves.splice(index, 1);
            }
        }
        var particles = this.particles,
            index = particles.length;
        while (index--) {
            var p = particles[index],
                px = p[0],
                py = p[1],
                life = p[4];
            if (
                px + 14 >= -translateX  &&
                px <= -translateX + 600 &&
                py + 14 >= 0
            ) {
                c.fillStyle = partialAlphaString +
                    ((life > 255 ? 255 : life) / 2.55 | 0) / 100 + ')';
                c.fillRect(translateX + px - 2, translateY + py - 2, 4, 4);
            }
            p[0] = px + p[2];
            p[1] = py + p[3];
            if ((p[4] = life - 5) <= 0) {
                particles.splice(index, 1);
            }
        }
        if (!this.stageComplete) {
            if (y + 14 > 0) {
                if (x + 14 > -translateX) {
                    if (x < -translateX + 600) {
                        if (flowing) {
                            c.fillStyle = '#FFFFFF';
                        }
                        else {
                            c.fillStyle = this.colorString;
                        }
                        c.fillRect(translateX + x, translateY + y, 14, 14);
                    }
                    else {
                        var y2 = translateY + y;
                        if (flowing) {
                            fill(255, 255, 255, 128);
                        }
                        else {
                            fill(128, 128, 128, 128);
                        }
                        noStroke();
                        rect(550, y2 + 4, 15, 6);
                        triangle(585, y2 + 7, 565, y2 - 3, 565, y2 + 17);
                        c.fillStyle = partialAlphaString + '0.5)';
                        c.fillRect(528, y2, 14, 14);
                    }
                }
                else {
                    var y2 = translateY + y;
                    if (flowing) {
                        fill(255, 255, 255, 128);
                    }
                    else {
                        fill(128, 128, 128, 128);
                    }
                    noStroke();
                    rect(35, y2 + 4, 15, 6);
                    triangle(15, y2 + 7, 35, y2 - 3, 35, y2 + 17);
                    c.fillStyle = partialAlphaString + '0.5)';
                    c.fillRect(58, y2, 14, 14);
                }
            }
            else {
                var x2 = translateX + x;
                if (flowing) {
                    fill(255, 255, 255, 128);
                }
                else {
                    fill(128, 128, 128, 128);
                }
                noStroke();
                rect(x2 + 4, translateY + 35, 6, 15);
                triangle(x2 + 7, translateY + 15, x2, translateY + 35, x2 + 14, translateY + 35);
                c.fillStyle = partialAlphaString + '0.5)';
                c.fillRect(x2, translateY + 58, 14, 14);
            }
        }
        var shards = this.shards,
            index = shards.length;
        if (index) {
            while (index--) {
                var s = shards[index],
                    sx = s[0],
                    sy = s[1],
                    w = s[2] | 0,
                    h = s[3] | 0;
                if (
                    sx + w >= -translateX   &&
                    sx <= -translateX + 600 &&
                    sy + h >= 0
                ) {
                    var life = s[6];
                    /* Round alpha value to nearest hunderedth*/
                    c.fillStyle = partialAlphaString +
                        ((life > 255 ? 255 : life) / 2.55 | 0) / 100 + ')';
                    c.fillRect(translateX + sx, translateY + sy, w, h);
                }
            }
        }
	}
};

/* Creates a player with color rgb(r, g, b) */
var createPlayer = function(r, g, b) {
    var p = inherit(originalPlayer);
    p.shards = [];
    p.particles = [];
    p.selves = [];
    p.setColor(r, g, b);
    return p;
};

/* Players */
p1 = createPlayer(0, 255, 0);
p2 = createPlayer(0, 206, 255);

var originalFlag = {
    x: 0,
    y: 0,
    completions: [],
    colors: [],
    animations: []
};

var originalStage = {
    name: '',
    leftSpikes: [],
    rightSpikes: [],
    upSpikes: [],
    downSpikes: [],
    leftMovingSpikes: [],
    rightMovingSpikes: [],
    upMovingSpikes: [],
    downMovingSpikes: [],
	blocks: [],
	blockFixtures: [],
	flowMotivators: [],
	flowMotivatorFixtures: [],
	flowInhibitors: [],
	flowInhibitorFixtures: [],
	bouncers: [],
	bouncerFixtures: [],
	leftMovers: [],
	leftMoverFixtures: [],
	rightMovers: [],
	rightMoverFixtures: [],
	flags: [],
	pendulums: [],
	wheels: [],
	crushers: [],
	teleporters: [],
	startX: 0,
	startY: 0,
	endX: 0,
	lensRight: 0
};

// }

/** Game Stages */
// {

/* Holds the current stage name and index */
var currentStageName,
    currentStageIndex;

var createStage = function(name, grid) {
    return [name, grid];
};

var stageInstructionsTutorial = [
    createStage('The First Step', [
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '  P                                        ',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■'
]),
    createStage('Learn to Jump', [
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                               ■■■■■■■■■■■■',
    '  P     ■■                     ■■■■■■■■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■'
]),
    createStage('Flow and Bounce', [
    '                             ■■■■■■■■■■■■■■',
    '                             ■■■■■■■■■■■■■■',
    '                             ■■■■■■■■■■■■■■',
    '                             ■■■■■■■■■■■■■■',
    '                             ■             ',
    '                             ■             ',
    '                             ■ ■■■■■■■■■■■■',
    '                             ■ ■■■■■■■■■■■■',
    '                             ■ ■■■■■■■■■■■■',
    '                             ■ ■■■■■■■■■■■■',
    '                             ■ ■■■■■■      ',
    '                             ■ ■■■■■■      ',
    '                             ■ ■■■■■■      ',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ ■■■■■■      ',
    '■  P                           ■■■■■■      ',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ ■■■■■■      ',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ ■■■■■■      ',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ ■■■■■■      ',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■□■■■■■■      ',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■      '
]),
    createStage('The First Test', [
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '                                           ',
    '      ■■■■■■U■■■■■                         ',
    '      CCCCCCCCCCCC                         ',
    '                          ■■■■■■■■■■■■■■■■■',
    '                          <<<<<<<<<<<<<<<<<',
    '                          ꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜ',
    '  P                  F    ꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛ',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■<<<<<<<<<<<<<<<<<',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■'
])
];

var stageInstructionsLightRun = [
    createStage('Hope Crushers', [
        '      {■}       {■}       {■}       {■}       {■}      ',
        '      {■}       {■}       {■}       {■}       {■}      ',
        '      {■}       {■}       {■}       {■}       {■}      ',
        '      {■}       {■}       {■}       {■}       {■}      ',
        '      {■}       {■}       {■}       {■}       {■}      ',
        '      {■}       {■}       {■}       {■}       {■}      ',
        '      {■}       {■}       {■}       {■}       {■}      ',
        '     {■■■}     {■■■}     {■■■}     {■■■}     {■■■}     ',
        '    {■■■■■}   {■■■■■}   {■■■■■}   {■■■■■}   {■■■■■}    ',
        '     CCCCC     CCCCC     CCCCC     CCCCC     CCCCC     ',
        '                                                       ',
        '                                                       ',
        '                                             ■■■■■■■■■■',
        '                                   ■■■■■■■■■■■■■■■■■■■■',
        '                         ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
        '  P            ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
        '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
        '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
        '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
        '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■'
    ]),
    createStage('Near Miss',     [
    '                                        $ $ $',
    '                                             ',
    '                                        $    ',
    '                                             ',
    '                                        $    ',
    '                                             ',
    '                                        $   $',
    '                                             ',
    '                           $            $   $',
    '                             $               ',
    '         $ $ $ $ $             $        $   $',
    '                                 $           ',
    '                                        $   $',
    '                     F                       ',
    '         $ $ $ $ $■■■■■■■+ $               ■■',
    ' P                ■■■■■■■■   $             ■■',
    '■■■+■■■■■■■■■■■■■■■■■■■■■■■■   $           ■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■   $         ■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■    F      ■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■□□■■'
]),
    createStage('Rocks',         [
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '■   ꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜ   {■',
    '■ P ꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛ   {■',
    '■■■■■■■■■■■■U■■■U■■■U■■■U■■■U■■■U■■■■■    ■',
    '■     $                                   ■',
    '■                                         ■',
    '■  #                                      ■',
    '■                                         ■',
    '■ $                                    F  ■',
    '■          ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '■         ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '■       ■■■■■■ ■■■■ ■■■■■■■       ■■■■■■■  ',
    '■      ■■■■■■   ■■   ■■■■          ■■■■    ',
    '■       ■■■■     ■    ■■                   ',
    '■       ■■■■          ■■                   ',
    '■        ■■           ■               ■■■  ',
    '■■F      ■                     ■     ■■■■  ',
    '■■■■         ■■               ■■■     ■■   ',
    '■■■■■        ■■        ■■    ■■■■■         ',
    '■■■■■■■■■   ■■■■     ■■■■■   ■■■■■         '
]),
    createStage('The Dropper',   [
    '     ■         $ ■            ■         ■■■',
    '     ■           ■            ■         ■■■',
    ' P   ■ 1         ■ 2          ■    3    ■■■',
    '■■■↣↢■■■■        ■■■■    ^    ■         ■■■',
    '■■■↣↢■■■■   $    ■■■■   {■}   ■         ■■■',
    '■■■↣↢■           ■       .    ■         ■■■',
    '■■■↣↢■           ■            ■         ■>>',
    '■■■↣↢■ $         ■    ^       ■ $      $■  ',
    '■■■↣↢■         $ ■   {■}      ■         ■  ',
    '■■■↣↢■           ■    .    ^  ■         ■  ',
    '■■■↣↢■           ■  ^     {■} ■↣   ^   ↢■4 ',
    '■■■↣↢■    $      ■ {■}     .  ■↣  {■}  ↢■>>',
    '■■■↣↢■■■■■       ■  .  ^      ■↣   .   ↢■■■',
    '■■■↣↢■   ■       ■    {■}     ■↣       ↢■■■',
    '■■■↣↢■   ■       ■     .      ■         ■■■',
    '■■■↣↢■   ■■■F  2 ■      F   3 ■         ■■■',
    '■■■       ■■■■■■■■■■■■■■■■■■■■■         ■■■',
    '■■■       ■■■■■■■■■■■■■■■■■■■■■         ■■■',
    '■■■   F  1■■■■■■■■■■■■■■■■■■■■■    4    ■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■  ■■■  ■■■■'
])
];

var stageInstructionsComplication = [
    createStage('Jump and Run',        [
    '                                                      ',
    '                                                      ',
    '                                                      ',
    '                                                      ',
    '                                           ■■   ■■■■■■',
    '                                           ■■   ■■■■■■',
    '                                      ■■        ..■■■■',
    '                                      ■■          .■■■',
    '                                 ■■                ■■■',
    '                                 ■■                ■■■',
    '                            ■■                     .■■',
    '                      F     ■■                      ■■',
    '                    {■■■■}                          ■■',
    '                    {■■■■}                          ■■',
    '               ■■■  {■■■■}                          .■',
    '  P      ■■■   ■■■  {■■■■}                           ■',
    '■■■■■■   ■■■   ■■■  {■■■■}                           ■',
    '■■■■■■   ■■■   ■■■  {■■■■}                           ■',
    '■■■■■■   ■■■   ■■■  {■■■■}                           ■',
    '■■■■■■   ■■■   ■■■  {■■■■}                           ■'
]),
    createStage('Forward and Reverse', [
    '                   ■U■  ■■■■■■■■■■■■   {■■■}         ',
    '                        CCCCCCCCCCCC   {■■■}         ',
    '                                       {■■■}         ',
    '                                       {■■■^^^^      ',
    '                                       {■■■■■■■      ',
    '   P                                   {■■■■■■■1     ',
    '■■■■■■+  <<<  >>>  ■■■  <<<<<<<<<<<<   {■■■■■■■■■■■■■',
    '■■■■■■+  <<<  >>>  ■■■  ■■■■■■■■■■■■   {■■■■■■■■■■>■■',
    '■■■■■■+  <<<  >>>  ■■■  ■■■■■■■■■■■■   {■■■■■■■>>>>>■',
    '■■■■■■+^^<<<^^>>>^^■■■^^■■■■■■■■■■■■   {■■■■■■■■■■>■■',
    '■■■■■■+■■■■■■■■■■■■■■■■■■■■■■■■■■■■■   {■■■■■■■■■■■■■',
    '                  {■U■} CCCCCCCCCCCC   {■■■..........',
    '                   ...                 {■■■}         ',
    '                                       {■■■}         ',
    '                                     F {■■■}         ',
    '                                     ■■{■■■}         ',
    '   1                                 ..{■■■}         ',
    '■■■■■■-  >>>  <<<  ■■■  >>>>>>>>>>>>   {■■■}         ',
    '■■■■■■-  >>>  <<<  ■■■  ■■■■■■■■■■■■   {■■■}         ',
    '■■■■■■-  >>>  <<<  ■■■  ■■■■■■■■■■■■   {■■■}         '
]),
    createStage('Cave Parkour',        [
    '     ■■■■■■■■■■■■■■■■■■■                   ',
    '     .■■■■....■■■■■■■■■.                   ',
    '      .■■.    .■■■■■■■■                    ',
    ' P     ■.      .■■■■■■■     ■■■■           ',
    '■■■■■  ■        .■■■■■■     $■■■■■         ',
    '■■■■■  ■         .■■■■.      .■■■■■        ',
    '■■■■.  .          ■■■.        ..■■■■■■■■■■■',
    '■■■■              .■.           .■■■■■■■■■■',
    '■■■.               ■             ..■■■■■■■■',
    '■■■                .               .....■■■',
    '■■■                                     ..■',
    '■■.                                      .■',
    '■■     ^                                  ■',
    '■■     ■                                  .',
    '■.     ■                   □□              ',
    '■      ■        ^   ^^ F  ■■■              ',
    '■      ■■     ■■■■■■■■■■■■■■■■             ',
    '.      ■■■   ■■■■■■■■■■■■■■■■■■            ',
    '       ■■■■■■■■■■■■■■■■■■■■■■■■■           ',
    '       ■■■■■■■■■■■■■■■■■■■■■■■■■           '
]),
    createStage('Flow Jump', [
    '■■■■■■}      {■■■■■■}      {■■■■■■■■■■■■           ■     ',
    '■■....        ......        ...........■           ■     ',
    '■■                                     ■           ■     ',
    '■■ 2                                   ■           ■     ',
    '■■■■■■}      {■■■■■■}      {■■■■■■■  ■■■           ■     ',
    '■■■■■■}      {U■■■■U}       .......  ■■■2  F       ■ 3   ',
    '......        .. $..                 ■■■■■■■■■$    ■■■■■■',
    '                                     ■■■■■■■■      ■■■■■ ',
    '                                     ■■■■■■■      $■■■■  ',
    '                                     ■■■■■■$       ■■■   ',
    '                                     ■■■■■         ■■    ',
    '                 $                   ■■■■          ■     ',
    '  P                             F    ■■■       $   ■     ',
    '■■■■■+}        {■■}          {-■■■■  ■■■           ■     ',
    '■■■■■■}        {■■}          {■■■■■  ■■■   $       ■     ',
    '■■■■■■}        {■■}          {■■■■■  ■■■           ■     ',
    '■■■■■■}        {■■}          {■■■■■  ■■■           ■     ',
    '■■■■■■}        {■■}          {■■■■■□□■■■      $  3 ■     ',
    '■■■■■■}        {■■}          {■■■■■■■■■■           ■     ',
    '■■■■■■}        {■■}          {■■■■■■■■■■           ■     '
])
];

var stageInstructionsFlowParkour = [
	createStage('The Cradle',    [
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '                                    ■■■■■           ',
    '                                     ■■■            ',
    '                                      ■             ',
    '                  ■■■■■               ■             ',
    '                  ■■■■■               U             ',
    '                  ■■■■■                             ',
    '                  ■■■■■     F                       ',
    '                  ■■■■■     ■■  ■■         ■■  ■■■■■',
    '                  ■■■■■     ■■  ■■         ■■  ■■■■■',
    '                  ■■■■■     ■■  ■■■       ■■■  ■■■■■',
    '                  ■■■■■     ■■  ■■■  ■■■  ■■■  ■■■■■',
    '                  ■■■■■     ■■  ■■■  ■■■  ■■■  ■■■■■',
    '                  ■■■■■     ■■       ■■■       ■■■■■',
    '                  ■■■■■     ■■                 ■■■■■',
    ' P                ■■■■■^^^^^■■                 ■■■■■',
    '■■■■■■■■□■■■■■■■■■■■■■■■■■■■■■                 ■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                 ■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                 ■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                 ■■■■■']),
    createStage('Pendulum Rush', [
    '■■■■■■■■■■■■■■■■■■■■■■■■               ■■■■■■■■■■■■■',
    '     ■■■■■   U   ■■■■■                   ■■■■■■■■■■■',
    '      ■■■         ■■■                      ■■■■■■■■■',
    '       U           U                       CCCCCCCCC',
    '                                                    ',
    '                                                    ',
    ' P                                                  ',
    '■■■         ■■■                            ■■■■■■■■■',
    '■■■         ■■■          F               ■■■■■■■■■■■',
    '■■■   ■■■   ■■■   ■■■   ■■■■■■#■■■■■■■#■■■■■■       ',
    '■■■   ■■■   ■■■   ■■■   ■■■■■■■■■■■■■■■■■■■■■       ',
    '■■■   ■■■   ■■■   ■■■   ■■■■■■■■■■■■■■■■■■■         ',
    '■■■   ■■■   ■■■   ■■■   ■■■■■■■■■■■■■■■■■■■         ',
    '■■■   ■■■   ■■■   ■■■   ■■■■■■■■■■■■■■■■■■■         ',
    '■■■   ■■■   ■■■   ■■■   ■■■■■■■■■■■■■■■■■           ',
    '■■■   ■■■   ■■■   ■■■   ■■■■■■■■■■■■■■■■■           ',
    '■■■   ■■■   ■■■   ■■■   ■■■■■■■■■■■■■■■■■           ',
    '■■■   ■■■   ■■■   ■■■   ■■■■■■■■■■■■■■■             ',
    '■■■   ■■■   ■■■   ■■■   ■■■■■■■■■■■■■■■             ',
    '■■■   ■■■   ■■■   ■■■   ■■■■■■■■■■■■■■■             '
]),
    createStage('Parkour Peril', [
    '                                     {■■■}                 ■■       ■■',
    '                                     {■■■}                 ■■       ■■',
    '                                     {■U■}                 ■■       ■■',
    '                                      ...                  CC       CC',
    '                                                                      ',
    '  P                                                                   ',
    '■■■■■                                                                 ',
    '■■■■■                                             F                   ',
    '■■■■■                                {■■■}        ■■  $  $ <<  $  $ ■■',
    '■■■■■                                {■■■}        ■■       ■■       ■■',
    '■■■■■                          <<    {■■■}        ■■       ■■       ■■',
    '■■■■■                          <<     ...         ■■       ■■       ■■',
    '■■■■■                  {■■}                       ■■       ■■       ■■',
    '■■■■■            F     {■■}                       ■■       ■■       ■■',
    '■■■■■            ■■     ..                        ■■       ■■       ■■',
    '■■■■■^^^^^^^^^^^^■■                               ■■       ■■       ■■',
    '■■■■■■■■■■■■■■■■■■■                               ■■       ■■       ■■',
    '■■■■■■■■■■■■■■■■■■■                               ■■       ■■       ■■',
    '■■■■■■■■■■■■■■■■■■■                               ■■       ■■       ■■',
    '■■■■■■■■■■■■■■■■■■■                               ■■       ■■       ■■'
]),
    createStage('Threading The Needle', [
    '                                                                              $ $■■■■■■■',
    '                                                         $ $                $    ■■■■■■■',
    '                                                       $     $                   ■■■■■■■',
    '                                                               $          $             ',
    '                                                                                        ',
    '                                                                 $       $              ',
    '                                                                              $ $■■■■■■■',
    '                                                 F       $ $      $     $        ■■■■■■■',
    '                                              {■■■■■■} $                     $   ■■■■■■■',
    '                                              {■■■■■■}       $     $   $         .■■■■■■',
    '                                 ■■■■■        {■■■■■■}                      $     ..■■■■',
    '                                 .■■■.        {■■■■■■}        $     $ $             .■■■',
    '                     ■■■■■        .■.         {■■■■■■}                     $         ■■■',
    '                     .■■■.         .           ......          $                     ■■■',
    '          ■■■■■       .■.                                                 $          .■■',
    '  P       .■■■.        .                                        $                     ■■',
    '■■■■■      .■.                                                           $            ■■',
    '.■■■.       .                                                                         ■■',
    ' .■.                                                           ■■■■■■■□■              ■■',
    '  .                                                            ■■■■■■■■■              ■■'
])
];

var stageInstructionsThePits = [
    createStage('Mine Dash', [
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ ',
    '■■■■■■■■■ ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■CCC■■■■■■■■■■■■    ■1',
    '■■■■■■■■   ■■■■■■■  ■■■ ■■■■■■■■■■■■■     ■■■■■■CC   CCC■■■■■■■C     ■>',
    '■■■■  ■     ■■■■■   ■■  ■■■■■■■■■■■        ■■■■C        ■■■■■CC      ■■',
    '■■■   ■      ■■■■    ■   ■■■■■■■■           ■■C         CC■■C        ■■',
    '■■■          ■■■         ■■■■■■■■                         CC        {■■',
    '■■            ■           ■■■■■                                     {■■',
    '■                         ■■■■                                      {■■',
    '■                         ■■■                                       {■■',
    '■                          ■■                                       {■■',
    '■                           ■               1                       {■■',
    '■■                                         ■■■■■■■■■■■■■■■■■■■■■■■  {■■',
    '■■                                         ■<■<■<■<■<■<■<■<■<■<■<■  {■■',
    '■■■                                        <<<<<<<<<<<<<<<<<<<<<<<  {■■',
    '■■■    P                                   ꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜ  {■■',
    '■■■■■■■■■                              F   ꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛ  {■■',
    '■■■■■■■-■^^^^^^^^^^^^     ^^^^^^^^^^^^■■■■■<<<<<<<<<<<<<<<<<<<<<<<■□■■■',
    '■■■■■■■-■■<<<<<<<<<<<<<<<<<<<<<<<<<<<■■■■■■■<■<■<■<■<■<■<<<■<■<■<■■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■'
]),
    createStage('Spike Caves', [
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■........',
    '■■■■■■■■■■■■■...■■■■■■■■■■■■■■■...■■.....        ',
    '■■■■■■■■■■...   {■■■■■...■■■■■■   ..             ',
    '■■■■■■■■■.      {■■■■}  {■■■■..                  ',
    '■■■■■■■■.       {■■■}   {■■..         {■■■■■■■■■■',
    '■■...■■}         ..■}    {■}     ^     ..■■■■■■■■',
    '■}   {■}           .      .     {■■^^    {■■■■■■■',
    '■}   {■}                       {■■■■■}   {■■■■■■■',
    '■}    .                     ^^  .■■..     {■■■■■■',
    '■}                         {■■■} ..       {■■■■■■',
    '■}                   {■■  {■■■■}           {■■■■■',
    '■}                   {■■■} ..■.             {■■■■',
    '■}                  {■■■■}   .              {■■■■',
    '■■^             {■■^ ....                    {■■■',
    '■■■^^          {■■■■}                         {■■',
    '■■■■■^ P  {■■■} ..■■}                         {■■',
    '■■■■■■■■■}{■■■}   ..                           {■',
    '■■■■■■■■}  ...                                 {■',
    '■■■■■■..                                       {■'
]),
    createStage('Smelly Pits', [
    '■■■                     ■■■■                  ■■■■',
    '■■                      ■■■■                      ',
    '■                  ■■    ■■                       ',
    '■                  .■    ■              ^         ',
    '■                   ■    ■             {U}        ',
    '■■■^^^^             ■    ■              .     ■■■■',
    '■■■■■■■□}           ■          {■^■■          ■■■■',
    '■■■■■■■■}           ■     ^    ■■■■■           ■■■',
    '■■■.....          ■ ■    {■}   .■.■■    U      ■■■',
    '■■               ■■ ■   {■■■  ^ .{■■           ■■■',
    '■■               ■■ ■     ■.  ■} {■■         ■■■■■',
    '■■              ■■■ ■    ^   ■■■}^■■          ■■■■',
    '■■■■            ■■■ ■   ^■}  .■.{■■■    U     ■■■■',
    '■■■■P         {■■■■ ■   ■■■}  .{■■■■          ■■■■',
    '■■■■■}        {■■■■□■   {■.^■   {■■■         ■■■■■',
    '■■■■■}        {■■■■■■    .{■■■   .■■         ■■■■■',
    '■■■■■}        {■■■■■■      {■    {■■        ■■■■■■',
    '■■■■■}        {■■■■■■          ■^{■■F      ■■■■■■■',
    '■■■■■}        {■■■■■■ F  ■■■  ■■■^■■■■    □■■■■■■■',
    '■■■■■}        {■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■'
]),
    createStage('The Fourth One', [
    '■■■■■■■■■■■■■■■■■      ■■■■■■■}                                      ■■■■■■■■■■■■■',
    '■■■■■■■■■■■■■■          ■■■■}                                        ■■■■■■■■■■■■■',
    '■■■■■■■■■■■■             ■■■}                                        ■■■■■■■■■■■■■',
    '■■■■■■                   ■■■■}                                       ■■■■■■■■■■■■■',
    '■■                       ■■■■■■2         {U}             {U■■■■■■■■↣↢■■■■■■■■■■■■■',
    '■            2           ■■■■■■■}F        .              {■■■■■■■■■↣↢■■   CCCCCCCC',
    '■           {■■}    #    ■■■■■■■■■■}                      {■■■■■■■■↣↢■■           ',
    '■           {■■}         ■■■■■■■}                         {■■■■■■■■↣↢■■↣↢+>>>>>>>>',
    '■            ..          ■■■■}                            {■■■■■■■■↣↢■■↣↢■■■■■■■■■',
    '■                  #     ■■■}                              {■■■■■■■↣↢■■↣↢■■■■■■   ',
    '■         F             {■■■}                              {■■■■■■■↣↢■■↣↢■■■■■    ',
    '■        {■■}           {■■■}                              {■■■■■■■↣↢■■↣↢■■■■     ',
    '■       {■■■■}          {■■■■}                              {■■■■■■↣↢■■↣↢■■■      ',
    '■}     {■■■■■}         {■■■■■■}                             {■■■■■■      ■■■      ',
    '■■}    {■■■■■■■}       {■■■■■■■}                            {■■■■■■      ■■■      ',
    '■■}    {■■■■■■■■}     {■■■■■■■■■■■}                         {■■■■■■      ■■       ',
    '■■■}P {■■■■■■■■■■■□□■■■■■■■■■■■■■■■}                        {■■■■■■      ■■       ',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■}                     {■■■■■■      ■■       ',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■}              {■■■■■■F     ■■       ',
    '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■}             {■■■■■■■■■■□□■■       '
]),
];

var stageInstructionsChains = [
    createStage('Easy Chains', [
    '      $ $ $ $                         {}                    ',
    '    $         $                       {}                    ',
    '                       ■              {}               ■    ',
    '    $          $       ■              {}               ■    ',
    '                 $     ■1             {}              1■    ',
    '    $  ■■■$            ■UU}           {}            {UU■    ',
    '        $   $    $                    {}                    ',
    '    $                      {UU}       {}       {UU}         ',
    '        $    $   $                    {}                    ',
    '   $                            {UU}  {}  {UU}              ',
    '       $     $   $                    {}                    ',
    '   $                                 {■■}                   ',
    '       $     $   $                    {}                    ',
    '■■■                             {■■}  {}  {■■}              ',
    '       $     $                        {}                    ',
    '                           {■■}       {}       {■■}         ',
    '      $      $                        {}                    ',
    ' P                 F   {■■}           {}            {■■}    ',
    '■■■□■■■■■■■■■■■■■■■■■■                {}                 >>>',
    '■■■■■■■■■■■■■■■■■■■■■■                {}                 ■■■'
]),
    createStage('Break', [
    '                                                                                                         ',
    '                                                                                                         ',
    '                                                                                                         ',
    '                                                                                                         ',
    '                                                                                                         ',
    '                                                                                                         ',
    '     P                                                                                                   ',
    '■■■■■■■■                                                                                                 ',
    '■■■■■■■                                                                                                  ',
    '■■■■■■.                                                                                                  ',
    '■■■■■.                                                                                                   ',
    '■■■■■                                                          F                                         ',
    '■■■■.                                                         {■■}                                       ',
    '■■■.                                                          {■■}                                       ',
    '■■■                                             {■}           {■■}                                       ',
    '■■.                                             {■}           {■■}                                       ',
    '■■                             {■}       {■}    {■}           {■■}                                       ',
    '■■                             {■}       {■}    {■}           {■■}                              {■■■■■',
    '■.                             {■}       {■}    {■}           {■■}             {■}              {■■■■■',
    '■                              {■}       {■}    {■}           {■■}             {■}              {■■■■■'
]),
    createStage('Fix',  [
    '■■■■■■■U}     ^^^     {U      ■                  ■',
    '■      U}    {■■■}    {U      ■                 ■■',
    '■      U}      P      {U      ■                ■■■',
    '■1    2U}    {UUU}    {U2    3■               ■■■■',
    '■■■■■■■■      ...      ■■■■■■■■              ■■■■■',
    '                                            ■■■■■■',
    '                                           ■■■■■■■',
    '                                           ■■■■■■■',
    '         $            $                    ■      ',
    '          $          $                     ■      ',
    '           $        $                      ■      ',
    '            $      $                       ■3^    ',
    '             $    $                        ■■■■■■■',
    '                                           ■■■■■■■',
    '               1                            ■■■■■■',
    '             {■■■}                           ■■■■■',
    '              ...                             ■■■■',
    '                                               ■■■',
    '                                                ■■',
    '                                                 ■'
]),
    createStage('Pie', [
    '                                                                       {}         {}         {}   {■}        {}       {■}                                                                                                            ',
    '                                                                       {}         {}         {}   {■}        {}       {■}                                                                                                            ',
    '                                                                       {}         {}         {}  {■■■}       {}      {■■■}                                                                                                           ',
    '                                                                     ^ {}         ■■         {}    1         {}        1                                             ■■■■■■■                                                         ',
    '                                                                    {U}{}          C■        {}              {}                                                      ■     ■                                                         ',
    '                                                                 ^   . {}           C■       {}              {}                                    #       #         ■     ■                                                         ',
    '                                                                {U}    {}      F     C■      {}              {}                   $   $                              ■  ■↣↢■                                                         ',
    '                                                             ^   .     {}    ■■■■■■   C■     {}              {}                                                      ■  ■↣↢■                                                         ',
    '                                                            {U}        {}      {}  ■   C■    {}              {}                                                      ■  ■↣↢■                                                         ',
    '                                                         ^   .         {}      {}   ■   C■   {}              {}                 $   $                                ■  ■↣↢■                                                         ',
    '                                                        {U}         {□}{}      {}    ■   C■  {}              {}          F               F                      F    ■↣↢■↣↢■                                                         ',
    '                             {}                          .          {■}{}      {}     ■   C■■■■■■            {}       ■■■■■■■■■■■■■■■■■■■■■■■  #<>>>><<#<<<<<<<■■■■↣↢■↣↢■↣↢■                                                         ',
    '                             {}                                 {■} {■}{}      {}      ■   CCCCCC            {}                                                   ■↣↢■↣↢■↣↢■                                                         ',
    '                 <<          {}    ■■                           {■} {■}{}      {}       ■                    {}                                                   ■↣↢■↣↢■↣↢■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '      P          {}          {}    {}                       {■} {■} {■}{}      {}        ■                   {}                                                   ■↣↢■↣↢■↣↢■    ꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜꜜ',
    '■■■■■■■■         {}          {}    {}                       {■} {■} {■}{}      {}         ■                  {}                                                   ■↣↢■↣↢■↣↢■2   ꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛꜛ',
    '   {}            {}          {}    {}            F      {■} {■} {■} {■}{}      {}          ■■■■■■■■□         {}                                                   ■↣↢■↣↢■↣↢■■■+■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    '   {}            {}          {}    {}           ■■■■    {■} {■} {■} {■}{}      {}            {}              {}                                                   ■     ■    ■                                                       ',
    '   {}            {}          {}    {}            {}     {■} {■} {■} {■}{}      {}            {}              {}                                                   ■     ■   2■                                                       ',
    '   {}            {}          {}    {}            {}     {■} {■} {■} {■}{}      {}            {}              {}                                                   ■■■■□□■■■■■■                                                       '
])
];

var stageInstructionsUNNAMED1 = [];
var stageInstructionsUNNAMED2 = [];
var stageInstructionsUNNAMED3 = [];

/* Set of chars that can be fixtured. */
var fixtureSet = {
    'undefined': true,
    '■': true,
    '□': true,
    '+': true,
    '-': true,
    '<': true,
    '>': true,
    'U': true
};

/*
Preloads a stage given an `instructions` object.
Roughly O(r * c) given r rows and c columns;
varies if teleporters or crushers are present.
*/
var preloadStage = function(instructions) {
	var name = instructions[0],
	    stageGrid = instructions[1],
	    stage = inherit(originalStage),
        longestRowLength = 0,
        leftSpikes = [],
        rightSpikes = [],
        upSpikes = [],
        downSpikes = [],
        leftMovingSpikes = [],
        rightMovingSpikes = [],
        upMovingSpikes = [],
        downMovingSpikes = [],
        leftMovingSpikeCounter = 0,
        rightMovingSpikeCounter = 0,
        upMovingSpikeCounter = 0,
        downMovingSpikeCounter = 0,
        blocks = [],
        blockFixtures = [],
        flowMotivators = [],
        flowMotivatorFixtures = [],
        flowInhibitors = [],
        flowInhibitorFixtures = [],
        bouncers = [],
        bouncerFixtures = [],
        leftMovers = [],
        leftMoverFixtures = [],
        rightMovers = [],
        rightMoverFixtures = [],
        flags = [],
        pendulums = [],
        wheels = [],
        crushers = [],
        teleporters = [],
        startX = 0,
        startY = 0,
        col = -1,
        colLength = stageGrid.length,
        prevRow = '',
        nextRow = stageGrid[col + 1];
	while (++col < colLength) {
        var currRow = nextRow,
            y = col * 14,
            row = -1,
            rowLength = currRow.length,
            nextGridPoint = currRow[0];
        if (rowLength > longestRowLength) {
            longestRowLength = rowLength;
        }
        nextRow = stageGrid[col + 1] || '';
        while (++row < rowLength) {
            var currGridPoint = nextGridPoint;
            nextGridPoint = currRow[row + 1];
            if (currGridPoint !== ' ') {
                var x = row * 14;
                switch (currGridPoint) {
                case '■':
                    if (
                        fixtureSet[nextGridPoint] &&
                        fixtureSet[prevRow[row]]  &&
                        fixtureSet[nextRow[row]]  &&
                        fixtureSet[currRow[row - 1]]
                    ) {
                        blockFixtures.push(x | (y << 16));
                    }
                    else {
                        blocks.push(x | (y << 16));
                    }
                    break;
                case '+':
                    if (
                        fixtureSet[nextGridPoint] &&
                        fixtureSet[prevRow[row]]  &&
                        fixtureSet[nextRow[row]]  &&
                        fixtureSet[currRow[row - 1]]
                    ) {
                        flowMotivatorFixtures.push([x, y]);
                    }
                    else {
                        flowMotivators.push([x, y, 0]);
                    }
                    break;
                case '-':
                    if (
                        fixtureSet[nextGridPoint] &&
                        fixtureSet[prevRow[row]]  &&
                        fixtureSet[nextRow[row]]  &&
                        fixtureSet[currRow[row - 1]]
                    ) {
                        flowInhibitorFixtures.push([x, y]);
                    }
                    else {
                        flowInhibitors.push([x, y, 0]);
                    }
                    break;
                case '□':
                    if (
                        fixtureSet[nextGridPoint] &&
                        fixtureSet[prevRow[row]]  &&
                        fixtureSet[nextRow[row]]  &&
                        fixtureSet[currRow[row - 1]]
                    ) {
                        bouncerFixtures.push([x, y]);
                    }
                    else {
                        bouncers.push([x, y, 0]);
                    }
                    break;
                case '<':
                    if (
                        fixtureSet[nextGridPoint] &&
                        fixtureSet[prevRow[row]]  &&
                        fixtureSet[nextRow[row]]  &&
                        fixtureSet[currRow[row - 1]]
                    ) {
                        leftMoverFixtures.push(x | (y << 16));
                    }
                    else {
                        leftMovers.push(x | (y << 16));
                    }
                    break;
                case '>':
                    if (
                        fixtureSet[nextGridPoint] &&
                        fixtureSet[prevRow[row]]  &&
                        fixtureSet[nextRow[row]]  &&
                        fixtureSet[currRow[row - 1]]
                    ) {
                        rightMoverFixtures.push(x | (y << 16));
                    }
                    else {
                        rightMovers.push(x | (y << 16));
                    }
                    break;
                case 'U':
                    if (
                        fixtureSet[nextGridPoint] &&
                        fixtureSet[prevRow[row]]  &&
                        fixtureSet[nextRow[row]]  &&
                        fixtureSet[currRow[row - 1]]
                    ) {
                        blockFixtures.push(x | (y << 16));
                    }
                    else {
                        blocks.push(x | (y << 16));
                    }
                    pendulums.push(
                        [x + 7, y + 7, 0, _TAU / 4]
                    );
                    break;
                case 'F':
                    var flag = inherit(originalFlag);
                    flag.x = x + 9.5;
                    flag.y = y - 56;
                    flag.completions = [];
                    flag.colors = [];
                    flag.animations = [];
                    flags.push(flag);
                    break;
                case '{':
                    leftSpikes.push((x + 7) | (y << 16));
                    break;
                case '}':
                    rightSpikes.push(x | (y << 16));
                    break;
                case '^':
                    upSpikes.push(x | ((y + 7) << 16));
                    break;
                case '.':
                    downSpikes.push(x | (y << 16));
                    break;
                case '↢':
                    leftMovingSpikes.push([
                        x + 14, y + 1.4,
                        x + 0.7, x + 14,
                        leftMovingSpikeCounter++ * 3
                    ]);
                    break;
                case '↣':
                    rightMovingSpikes.push([
                        x - 14, y + 1.4,
                        x - 14, x - 0.7,
                        rightMovingSpikeCounter++ * 3
                    ]);
                    break;
                case 'ꜛ':
                    upMovingSpikes.push([
                        x + 1.4, y + 14,
                        y + 0.7, y + 14,
                        upMovingSpikeCounter++ * 3
                    ]);
                    break;
                case 'ꜜ':
                    downMovingSpikes.push([
                        x + 1.4, y - 0.7,
                        y - 14, y - 0.7,
                        downMovingSpikeCounter++ * 3
                    ]);
                    break;
                case '#':
                    wheels.push(
                        /* Radius of 28 */
                        x | ((y + 7) << 16) | 0x38000000
                    );
                    break;
                case '$':
                    wheels.push(
                        /* Radius of 14 */
                        x | ((y + 21) << 16) | 0x1C000000
                    );
                    break;
                case 'C':
                    crushers.push([x + 3.5, y, y, 400, 0]);
                    break;
                case '1':
                    teleporters.push([
                        x, y - 7, 0, 0, null, 0,
                        'rgba(255,0,0,', false, false
                    ]);
                    break;
                case '2':
                    teleporters.push([
                        x, y - 7, 0, 0, null, 0,
                        'rgba(255,255,0,', false, false
                    ]);
                    break;
                case '3':
                    teleporters.push([
                        x, y - 7, 0, 0, null, 0,
                        'rgba(0,255,0,', false, false
                    ]);
                    break;
                case '4':
                    teleporters.push([
                        x, y - 7, 0, 0, null, 0,
                        'rgba(0,0,255,', false, false
                    ]);
                    break;
                case 'P':
                    startX = x;
                    startY = y;
                    break;
                }
            }
        }
        prevRow = currRow;
	}
	/* Resolve crusher stop points */
	var lensRight = longestRowLength * -14 + 600,
        blocksLength = blocks.length,
        leftMoversLength = leftMovers.length,
        rightMoversLength = rightMovers.length,
        crusherIndex = crushers.length;
    /*
    Initializes crusher stop values.
    O(n) where n is `crushers.length`
    */
    while (crusherIndex--) {
        var c = crushers[crusherIndex],
            cx = c[0] - 3.5,
            cy = c[1],
            cstop = c[3],
            blockIndex = blocksLength;
        while (blockIndex--) {
            var b = blocks[blockIndex];
            if (cx === (b & X_MASK)) {
                var by = ((b & Y_MASK) >> 16) - 14;
                if (by > cy && by < cstop) {
                    cstop = by;
                }
            }
        }
        var leftMoverIndex = leftMoversLength;
        while (leftMoverIndex--) {
            var m = leftMovers[leftMoverIndex];
            if (cx === (m & X_MASK)) {
                var my = ((m & Y_MASK) >> 16) - 14;
                if (my > cy && my < cstop) {
                    cstop = my;
                }
            }
        }
        var rightMoverIndex = rightMoversLength;
        while (rightMoverIndex--) {
            var m = rightMovers[rightMoverIndex];
            if (cx === (m & X_MASK)) {
                var my = ((m & Y_MASK) >> 16) - 14;
                if (my > cy && my < cstop) {
                    cstop = my;
                }
            }
        }
        c[3] = cstop;
    }
    var tpLength = teleporters.length,
        tpIndex = tpLength;
    /*
    Initialize teleporter sisters.
    O(n) where n is `teleporters.length`
    */
    while (tpIndex--) {
        var t = teleporters[tpIndex];
        if (t[4] === null) {
            var noSisterFound = true,
                c = t[6],
                tpIndex2 = tpLength;
            while (tpIndex2--) {
                var t2 = teleporters[tpIndex2];
                /*
                Same color but not the same teleporter
                */
                if (tpIndex !== tpIndex2 && t2[6] === c) {
                    if (t2[4]) {
                        error('Failed to preload ' + name + ': Extra teleporter');
                    }
                    /*
                    As the great Karl Weierstrass once said:
                    "When I wrote this, only God and I
                    understood what I was doing. Now, only
                    God knows."
                    */
                    t[2] = t2[0];
                    t[3] = t2[1] + 7;
                    t[4] = t2;
                    t2[2] = t[0];
                    t2[3] = t[1] + 7;
                    t2[4] = t;
                    noSisterFound = false;
                    break;
                }
            }
            if (noSisterFound) {
                error('Failed to preload ' + name + ': Missing teleporter');
            }
        }
    }
    /* Sets all of the stage values */
    stage.name = name;
	stage.lensRight = lensRight > 0 ? 0 : lensRight;
	stage.endX = longestRowLength * 14;
	stage.leftSpikes = leftSpikes;
	stage.rightSpikes = rightSpikes;
	stage.upSpikes = upSpikes;
	stage.downSpikes = downSpikes;
	stage.leftMovingSpikes = leftMovingSpikes;
	stage.rightMovingSpikes = rightMovingSpikes;
	stage.upMovingSpikes = upMovingSpikes;
	stage.downMovingSpikes = downMovingSpikes;
	stage.blocks = blocks;
	stage.blockFixtures = blockFixtures;
	stage.flowMotivators = flowMotivators;
	stage.flowMotivatorFixtures = flowMotivatorFixtures;
	stage.flowInhibitors = flowInhibitors;
	stage.flowInhibitorFixtures = flowInhibitorFixtures;
	stage.bouncers = bouncers;
	stage.bouncerFixtures = bouncerFixtures;
	stage.leftMovers = leftMovers;
	stage.leftMoverFixtures = leftMoverFixtures;
	stage.rightMovers = rightMovers;
	stage.rightMoverFixtures = rightMoverFixtures;
	stage.flags = flags;
	stage.pendulums = pendulums;
	stage.wheels = wheels;
	stage.crushers = crushers;
	stage.teleporters = teleporters;
	stage.startX = startX;
	stage.startY = startY;
	return stage;
};

var preloadStages = function(stageInstructions) {
	var index = stageInstructions.length,
        stages = Array(index);
	while (index--) {
        stages[index] = preloadStage(stageInstructions[index]);
	}
	return stages;
};

/* Stores current preloaded stage objects */
var currentStages;

var stagesTutorial = preloadStages(stageInstructionsTutorial);

var stagesLightRun = preloadStages(stageInstructionsLightRun);

var stagesComplication = preloadStages(stageInstructionsComplication);

var stagesFlowParkour = preloadStages(stageInstructionsFlowParkour);

var stagesThePits = preloadStages(stageInstructionsThePits);

var stagesChains = preloadStages(stageInstructionsChains);

var stagesUNNAMED1 = preloadStages(stageInstructionsUNNAMED1);

var stagesUNNAMED2 = preloadStages(stageInstructionsUNNAMED2);

var stagesUNNAMED3 = preloadStages(stageInstructionsUNNAMED3);

var maps = [];

var EASY = 1,
    MODERATE = 2,
    HARD = 3;

var addMap = function(name, difficulty, stages) {
    maps.push([name, difficulty, stages]);
};

addMap('Tutorial', EASY, stagesTutorial);
addMap('Light Run', EASY, stagesLightRun);
addMap('Complication', MODERATE, stagesComplication);
addMap('Flow Parkour', MODERATE, stagesFlowParkour);
addMap('The Pits', HARD, stagesThePits);
addMap('Chains', HARD, stagesChains);
addMap('?', HARD, stagesUNNAMED1);
addMap('?', HARD, stagesUNNAMED2);
addMap('?', HARD, stagesUNNAMED3);

currentStages = stagesComplication;

var resetStageObjects = function() {
    /* Reset flag data */
    var index = flags.length;
    while (index--) {
        var flag = flags[index];
        flag.completions = [];
        flag.colors = [];
        flag.animations = [];
    }
    /* Reset crusher positions */
    index = crushers.length;
    while (index--) {
        var crusher = crushers[index];
        crusher[1] = crusher[2];
    }
    /* Reset pendulum positions */
    index = pendulums.length;
    while (index--) {
        var pendulum = pendulums[index];
        pendulum[2] = 0;
        pendulum[3] = _TAU / 4;
    }
    /* Reset spike positions and constants */
    index = leftMovingSpikes.length;
    while (index--) {
        var spike = leftMovingSpikes[index];
        spike[0] = spike[3];
    }
    index = rightMovingSpikes.length;
    while (index--) {
        var spike = rightMovingSpikes[index];
        /*
        Why set it to spike[2] when all the
        others are set to spike[3]? I'm glad
        you asked. The answer is, I wrote this
        code a month ago and I'm afraid of
        changing it; it works fine now.
        */
        spike[0] = spike[2];
    }
    index = upMovingSpikes.length;
    while (index--) {
        var spike = upMovingSpikes[index];
        spike[1] = spike[3];
    }
    index = downMovingSpikes.length;
    while (index--) {
        var spike = downMovingSpikes[index];
        spike[1] = spike[3];
    }
};

var loadStage = function(stages, index) {
	var stage = stages[index];
    if (!stage) {
        error('Unable to load stage: Missing stage in stages array');
    }
	currentStageName = stage.name;
	currentStageIndex = index;
	lensRight = stage.lensRight;
	endX = stage.endX;
	leftSpikes = stage.leftSpikes;
	rightSpikes = stage.rightSpikes;
	upSpikes = stage.upSpikes;
	downSpikes = stage.downSpikes;
	leftMovingSpikes = stage.leftMovingSpikes;
	rightMovingSpikes = stage.rightMovingSpikes;
	upMovingSpikes = stage.upMovingSpikes;
	downMovingSpikes = stage.downMovingSpikes;
	blocks = stage.blocks;
	blockFixtures = stage.blockFixtures;
	flowMotivators = stage.flowMotivators;
	flowMotivatorFixtures = stage.flowMotivatorFixtures;
	flowInhibitors = stage.flowInhibitors;
	flowInhibitorFixtures = stage.flowInhibitorFixtures;
	bouncers = stage.bouncers;
	bouncerFixtures = stage.bouncerFixtures;
	leftMovers = stage.leftMovers;
	leftMoverFixtures = stage.leftMoverFixtures;
	rightMovers = stage.rightMovers;
	rightMoverFixtures = stage.rightMoverFixtures;
	flags = stage.flags;
	pendulums = stage.pendulums;
	wheels = stage.wheels;
	crushers = stage.crushers;
	teleporters = stage.teleporters;
	var startX = stage.startX;
	p1.startX = p2.startX = p1.x = p2.x = startX;
	p1.startY = p2.startY = p1.y = p2.y = stage.startY;
	p1.lensX = p2.lensX = 300 - startX;
	stageTimer = 0;
	transparency = 1;
};




// }

/** Game Functions */
// {

var drawFixtures = function(translateX, translateY) {
	var index = blockFixtures.length;
	while (index--) {
        var f = blockFixtures[index],
            x = (f & X_MASK) + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(blockImage, x, ((f & Y_MASK) >> 16) + translateY, 14, 14);
        }
	}
	var index = bouncerFixtures.length;
	while (index--) {
        var f = bouncerFixtures[index],
            x = f[0] + translateX;
        if (x > -14 && x < 600) {
            var y = f[1] + translateY;
            c.drawImage(bouncerTopImage, x, y - 5, 14, 4);
            c.drawImage(bouncerImage, x, y, 14, 14);
        }
	}
	index = leftMoverFixtures.length;
	while (index--) {
        var f = leftMoverFixtures[index],
            x = (f & X_MASK) + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(leftMoverImage, x, ((f & Y_MASK) >> 16) + translateY, 14, 14);
        }
	}
	index = rightMoverFixtures.length;
	while (index--) {
        var f = rightMoverFixtures[index],
            x = (f & X_MASK) + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(rightMoverImage, x, ((f & Y_MASK) >> 16) + translateY, 14, 14);
        }
	}
	index = flowMotivatorFixtures.length;
	while (index--) {
        var f = flowMotivatorFixtures[index],
            x = f[0] + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(flowMotivatorImage, x, f[1] + translateY, 14, 14);
        }
	}
	index = flowInhibitorFixtures.length;
	while (index--) {
        var f = flowInhibitorFixtures[index],
            x = f[0] + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(flowInhibitorImage, x, f[1] + translateY, 14, 14);
        }
	}
};

var drawBlocks = function(translateX, translateY) {
	var index = blocks.length;
	while (index--) {
        var b = blocks[index],
            x = (b & X_MASK) + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(blockImage, x, ((b & Y_MASK) >> 16) + translateY, 14, 14);
        }
	}
};

var updateSpikes = function() {
    var p1x = p1.x,
        p1y = p1.y,
        p2x = p2.x,
        p2y = p2.y,
        index = leftSpikes.length;
    while (index--) {
        var s = leftSpikes[index],
            sx = s & X_MASK;
        if (sx < p1x + 14 && sx + 5.6 > p1x) {
            var sy = ((s & Y_MASK) >> 16) + 1.4;
            if (sy < p1y + 14 && sy + 11.2 > p1y) {
                p1.death();
                break;
            }
        }
        if (sx < p2x + 14 && sx + 5.6 > p2x) {
            var sy = ((s & Y_MASK) >> 16) + 1.4;
            if (sy < p2y + 14 && sy + 11.2 > p2y) {
                p2.death();
                break;
            }
        }
    }
    index = rightSpikes.length;
    while (index--) {
        var s = rightSpikes[index],
            sx = s & X_MASK;
        if (sx < p1x + 14 && sx + 5.6 > p1x) {
            var sy = ((s & Y_MASK) >> 16) + 1.4;
            if (sy < p1y + 14 && sy + 11.2 > p1y) {
                p1.death();
                break;
            }
        }
        if (sx < p2x + 14 && sx + 5.6 > p2x) {
            var sy = ((s & Y_MASK) >> 16) + 1.4;
            if (sy < p2y + 14 && sy + 11.2 > p2y) {
                p2.death();
                break;
            }
        }
    }
    index = upSpikes.length;
    while (index--) {
        var s = upSpikes[index],
            sx = (s & X_MASK) + 1.4;
        if (sx < p1x + 14 && sx + 11.2 > p1x) {
            var sy = (s & Y_MASK) >> 16;
            if (sy < p1y + 14 && sy + 1.4 > p1y) {
                p1.death();
                break;
            }
        }
        if (sx < p2x + 14 && sx + 11.2 > p2x) {
            var sy = (s & Y_MASK) >> 16;
            if (sy < p2y + 14 && sy + 1.4 > p2y) {
                p2.death();
                break;
            }
        }
    }
    index = downSpikes.length;
    while (index--) {
        var s = downSpikes[index],
            sx = (s & X_MASK) + 1.4;
        if (sx < p1x + 14 && sx + 11.2 > p1x) {
            var sy = (s & Y_MASK) >> 16;
            if (sy < p1y + 14 && sy + 1.4 > p1y) {
                p1.death();
                break;
            }
        }
        if (sx < p2x + 14 && sx + 11.2 > p2x) {
            var sy = (s & Y_MASK) >> 16;
            if (sy < p2y + 14 && sy + 1.4 > p2y) {
                p2.death();
                break;
            }
        }
    }
    index = leftMovingSpikes.length;
    while (index--) {
        var s = leftMovingSpikes[index],
            sx = s[0],
            sy = s[1];
        if ((stageTimer - s[4]) % 180 > 90) {
            sx += 1.4;
            var rightX = s[3];
            if (sx > rightX) {
                s[0] = sx = rightX;
            }
            else {
                s[0] = sx;
            }
        }
        else {
            sx -= 1.4;
            var leftX = s[2];
            if (sx < leftX) {
                s[0] = sx = leftX;
            }
            else {
                s[0] = sx;
            }
        }
        if (
            sx < p1x + 14 && sx + 13.3 > p1x &&
            sy < p1y + 14 && sy + 11.2 > p1y
        ) {
            p1.death();
        }
        if (
            sx < p2x + 14 && sx + 13.3 > p2x &&
            sy < p2y + 14 && sy + 11.2 > p2y
        ) {
            p2.death();
        }
    }
    index = rightMovingSpikes.length;
    while (index--) {
        var s = rightMovingSpikes[index],
            sx = s[0],
            sy = s[1];
        if ((stageTimer - s[4]) % 180 <= 90) {
            sx += 1.4;
            var rightX = s[3];
            if (sx > rightX) {
                s[0] = sx = rightX;
            }
            else {
                s[0] = sx;
            }
        }
        else {
            sx -= 1.4;
            var leftX = s[2];
            if (sx < leftX) {
                s[0] = sx = leftX;
            }
            else {
                s[0] = sx;
            }
        }
        if (
            sx < p1x + 14 && sx + 13.3 > p1x &&
            sy < p1y + 14 && sy + 11.2 > p1y
        ) {
            p1.death();
        }
        if (
            sx < p2x + 14 && sx + 13.3 > p2x &&
            sy < p2y + 14 && sy + 11.2 > p2y
        ) {
            p2.death();
        }
    }
    index = upMovingSpikes.length;
    while (index--) {
        var s = upMovingSpikes[index],
            sx = s[0],
            sy = s[1];
        if ((stageTimer - s[4]) % 180 > 90) {
            sy += 1.4;
            var bottomY = s[3];
            if (sy > bottomY) {
                s[1] = sy = bottomY;
            }
            else {
                s[1] = sy;
            }
        }
        else {
            sy -= 1.4;
            var topY = s[2];
            if (sy < topY) {
                s[1] = sy = topY;
            }
            else {
                s[1] = sy;
            }
        }
        if (
            sx < p1x + 14 && sx + 11.2 > p1x &&
            sy < p1y + 14 && sy + 13.3 > p1y
        ) {
            p1.death();
        }
        if (
            sx < p2x + 14 && sx + 11.2 > p2x &&
            sy < p2y + 14 && sy + 13.3 > p2y
        ) {
            p2.death();
        }
    }
    index = downMovingSpikes.length;
    while (index--) {
        var s = downMovingSpikes[index],
            sx = s[0],
            sy = s[1];
        if ((stageTimer - s[4]) % 180 <= 90) {
            sy += 1.4;
            var bottomY = s[3];
            if (sy > bottomY) {
                s[1] = sy = bottomY;
            }
            else {
                s[1] = sy;
            }
        }
        else {
            sy -= 1.4;
            var topY = s[2];
            if (sy < topY) {
                s[1] = sy = topY;
            }
            else {
                s[1] = sy;
            }
        }
        if (
            sx < p1x + 14 && sx + 11.2 > p1x &&
            sy < p1y + 14 && sy + 13.3 > p1y
        ) {
            p1.death();
        }
        if (
            sx < p2x + 14 && sx + 11.2 > p2x &&
            sy < p2y + 14 && sy + 13.3 > p2y
        ) {
            p2.death();
        }
    }
};

var drawSpikes = function(translateX, translateY) {
    var index = leftSpikes.length;
	while (index--) {
        var s = leftSpikes[index],
            x = (s & X_MASK) + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(leftSpikeImage, x, ((s & Y_MASK) >> 16) + translateY, 7, 14);
        }
	}
	index = rightSpikes.length;
	while (index--) {
        var s = rightSpikes[index],
            x = (s & X_MASK) + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(rightSpikeImage, x, ((s & Y_MASK) >> 16) + translateY, 7, 14);
        }
	}
    index = upSpikes.length;
	while (index--) {
        var s = upSpikes[index],
            x = (s & X_MASK) + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(upSpikeImage, x, ((s & Y_MASK) >> 16) + translateY, 14, 7);
        }
	}
	index = downSpikes.length;
	while (index--) {
        var s = downSpikes[index],
            x = (s & X_MASK) + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(downSpikeImage, x, ((s & Y_MASK) >> 16) + translateY, 14, 7);
        }
	}
	index = leftMovingSpikes.length;
	while (index--) {
        var s = leftMovingSpikes[index],
            x = s[0] + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(leftMovingSpikeImage, x, s[1] - 1.4 + translateY, 14, 14);
        }
	}
	index = rightMovingSpikes.length;
	while (index--) {
        var s = rightMovingSpikes[index],
            x = s[0] + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(rightMovingSpikeImage, x, s[1] - 1.4 + translateY, 14, 14);
        }
	}
	index = upMovingSpikes.length;
	while (index--) {
        var s = upMovingSpikes[index],
            x = s[0] - 1.4 + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(upMovingSpikeImage, x, s[1] + translateY, 14, 14);
        }
	}
	index = downMovingSpikes.length;
	while (index--) {
        var s = downMovingSpikes[index],
            x = s[0] - 1.4 + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(downMovingSpikeImage, x, s[1] + translateY, 14, 14);
        }
	}
};

var drawFlowMotivators = function(translateX, translateY) {
    var index = flowMotivatorParticles.length;
    while (index--) {
        var p = flowMotivatorParticles[index],
            x = (p[0] += p[2]) + translateX - 1,
            y = p[1] += p[3],
            life = p[4];
        if (life > 0) {
            if (x > -1 && x < 600) {
                c.fillStyle = 'rgba(0,255,0,' + life / 255 + ')';
                c.fillRect(x, y + translateY - 1, 3, 3);
            }
            p[4] = life - 5;
        }
        else {
            flowMotivatorParticles.splice(index, 1);
        }
    }
    index = flowMotivators.length;
	while (index--) {
        var f = flowMotivators[index],
            x = f[0] + translateX,
            r = f[2];
        if (r > 0) {
            var y = f[1] + translateY,
                d = r << 1;
            c.drawImage(flowMotivatorHaloImage, x - r + 7, y - r + 7, d, d);
            c.drawImage(flowMotivatorImage, x, y, 14, 14);
            flowMotivatorParticles.push([
                x - translateX + Math.random() * 14,
                y - translateY + Math.random() * 14,
                (Math.random() - 0.5) * 1.4,
                (Math.random() - 0.5) * 1.4,
                255
            ]);
            f[2] = r - 0.5;
        }
        else if (x > -14 && x < 600) {
            c.drawImage(flowMotivatorImage, x, f[1] + translateY, 14, 14);
        }
	}
};

var drawFlowInhibitors = function(translateX, translateY) {
    var index = flowInhibitorParticles.length;
    while (index--) {
        var p = flowInhibitorParticles[index],
            x = (p[0] += p[2]) + translateX - 1,
            y = p[1] += p[3],
            life = p[4] -= 0.055;
        if (life > 0) {
            if (x > -1 && x < 600) {
                c.fillStyle = 'rgba(255,0,0,' + life + ')';
                c.fillRect(x, y + translateY - 1, 3, 3);
            }
        }
        else {
            flowInhibitorParticles.splice(index, 1);
        }
    }
    index = flowInhibitors.length;
	while (index--) {
        var f = flowInhibitors[index],
            x = f[0] + translateX,
            r = f[2];
        if (r > 0) {
            var y = f[1] + translateY,
                d = r << 1;
            c.drawImage(flowInhibitorHaloImage, x - r + 7, y - r + 7, d, d);
            c.drawImage(flowInhibitorImage, x, y, 14, 14);
            var ox = x - translateX + 7,
                oy = y - translateY + 7,
                rx = (Math.random() - 0.5) * 35 << 1,
                ry = (Math.random() - 0.5) * Math.sqrt(1225 - rx * rx) << 1;
            flowInhibitorParticles.push([
                ox + rx,
                oy + ry,
                rx * -0.035,
                ry * -0.035,
                1
            ]);
            f[2] = r - 0.5;
        }
        else if (x > -14 && x < 600) {
            c.drawImage(flowInhibitorImage, x, f[1] + translateY, 14, 14);
        }
	}
};

var drawBouncers = function(translateX, translateY) {
	var index = bouncers.length;
	while (index--) {
        var b = bouncers[index],
            a = b[2],
            x = b[0] + translateX;
        if (a > 0) {
            a -= 0.5;
        }
        if (x > -14 && x < 600) {
            var y = b[1] + translateY;
            if (a > 0) {
                strokeWeight(1);
                stroke(255, 255, 0);
                line(x + 2, y + 2, x + 12, y - 2 - a);
                stroke(255, 128, 0);
                line(x + 12, y + 2, x + 2, y - 2 - a);
            }
            c.drawImage(bouncerTopImage, x, y - a - 5, 14, 4);
            c.drawImage(bouncerImage, x, y, 14, 14);
        }
        b[2] = a;
	}
};

var drawLeftMovers = function(translateX, translateY) {
	var index = leftMovers.length;
	while (index--) {
        var m = leftMovers[index],
            x = (m & X_MASK) + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(leftMoverImage, x, ((m & Y_MASK) >> 16) + translateY, 14, 14);
        }
	}
};

var drawRightMovers = function(translateX, translateY) {
	var index = rightMovers.length;
	while (index--) {
        var m = rightMovers[index],
            x = (m & X_MASK) + translateX;
        if (x > -14 && x < 600) {
            c.drawImage(rightMoverImage, x, ((m & Y_MASK) >> 16) + translateY, 14, 14);
        }
	}
};

var updatePendulums = function() {
    var index = pendulums.length;
    while (index--) {
        var p = pendulums[index],
            a = p[3];
        p[3] = a + (p[2] -= 1 / 32400 * Math.sin(a) * _TAU);
        var x = 63 * Math.sin(a) + p[0],
            y = 63 * Math.cos(a) + p[1],
            dx = Math.abs(x - p1.x - 7) - 7,
            dy = Math.abs(y - p1.y - 7) - 7;
        if (
            dx <= 7 && dy <= 7 &&
            (
                dx <= 0 || dy <= 0 ||
                dx * dx + dy * dy <= 49
            )
        ) {
            p1.death();
        }
        dx = Math.abs(x - p2.x - 7) - 7;
        dy = Math.abs(y - p2.y - 7) - 7;
        if (
            dx <= 7 && dy <= 7 &&
            (
                dx <= 0 || dy <= 0 ||
                dx * dx + dy * dy <= 49
            )
        ) {
            p2.death();
        }
    }
};

var drawPendulums = function(translateX, translateY) {
    stroke(196);
    strokeWeight(1);
    var index = pendulums.length;
    while (index--) {
        var p = pendulums[index],
            a = p[3],
            ox = translateX + p[0],
            oy = translateY + p[1],
            x = 63 * Math.sin(a) + ox,
            y = 63 * Math.cos(a) + oy;
        if (
            (x > ox ? x : ox) > -14 &&
            (x < ox ? x : ox) < 600
        ) {
            line(x, y, ox, oy);
            pushMatrix();
            translate(x, y);
            rotate(stageTimer * -1.5);
            c.drawImage(wheelImage, -14, -14, 28, 28);
            popMatrix();
        }
    }
};

var updateFlags = function() {
    var index = flags.length,
        p1x = p1.x,
        p1y = p1.y,
        p2x = p2.x,
        p2y = p2.y;
    while (index--) {
        var f = flags[index],
            fx = f.x,
            fy = f.y;
        if (
            fx < p1x + 14 && fx + 10.5 > p1x &&
            fy < p1y + 14 && fy + 70 > p1y
        ) {
            var addFlag = true,
                completions = f.completions,
                index2 = completions.length;
            while (index2--) {
                if (completions[index2] === p1) {
                    addFlag = false;
                    break;
                }
            }
            if (addFlag) {
                completions.push(p1);
                f.colors.push(color(p1.r, p1.g, p1.b));
                f.animations.push(0);
                p1.startX = fx - 1.5;
                p1.startY = fy + 56;
            }
        }
        if (
            fx < p2x + 14 && fx + 10.5 > p2x &&
            fy < p2y + 14 && fy + 70 > p2y
        ) {
            var addFlag = true,
                completions = f.completions,
                index2 = completions.length;
            while (index2--) {
                if (completions[index2] === p2) {
                    addFlag = false;
                    break;
                }
            }
            if (addFlag) {
                completions.push(p2);
                f.colors.push(color(p2.r, p2.g, p2.b));
                f.animations.push(0);
                p2.startX = fx - 1.5;
                p2.startY = fy + 56;
            }
        }
    }
};

var drawFlags = function(translateX, translateY) {
    var index = flags.length;
    while (index--) {
        var f = flags[index],
            x = f.x - 10 + translateX;
        if (x > -28 && x < 600) {
            c.drawImage(flagImage, x, f.y + translateY, 28, 70);
        }
        var x2 = x + 17;
        if (x2 > -21 && x2 < 600) {
            var y = f.y,
                y2 = y + 3.5 + translateY,
                y3 = y + 17.5 + translateY,
                colors = f.colors,
                animations = f.animations,
                index2 = -1,
                length = colors.length;
            while (++index2 < length) {
                var val = Math.sin(stageTimer * _TAU / 180),
                    a = animations[index2] + 1;
                if (a > 20) {
                    a = 20;
                }
                fill(colors[index2]);
                noStroke();
                beginShape();
                vertex(x2, y2);
                bezierVertex(x2, y2, x2 + a / 2, y2 + val * 2, x2 + a, y2 + val);
                bezierVertex(x2 + a, y2 + val, x2 + a, y2 + val, x2 + a, y2);
                bezierVertex(x2 + a, y3, x2 + a, y3 + val, x2 + a, y3 + val);
                bezierVertex(x2 + a, y3 + val, x2 + a / 2, y3 + val * 2, x2, y3);
                vertex(x2, y3);
                endShape();
                y2 += 20;
                y3 += 20;
                animations[index2] = a;
            }
        }
    }
};

var updateTeleporters = function() {
    var index = teleporters.length,
        p1x = p1.x,
        p1y = p1.y,
        p2x = p2.x,
        p2y = p2.y;
    while (index--) {
        var t = teleporters[index],
            tx = t[0],
            ty = t[1],
            a = t[5];
        /* Update animation */
        if (a > 0) {
            a -= 1 / 30;
            if (a < 0) {
                t[5] = 0;
            }
            else {
                t[5] = a;
            }
        }
        /*
        Checks if the player was in
        the teleporter last frame
        */
        if (t[7]) {
            /* If yes, reevaluate */
            if (
                tx >= p1x + 14 || tx + 14 <= p1x ||
                ty >= p1y + 14 || ty + 21 <= p1y
            ) {
                t[7] = false;
            }
        }
        else {
            /* If no, check if (s)he is now */
            if (
                tx < p1x + 14 && tx + 14 > p1x &&
                ty < p1y + 14 && ty + 21 > p1y
            ) {
                /* Teleport */
                var sister = t[4];
                p1.x = t[2];
                p1.y = t[3];
                t[7] = sister[7] = true;
                t[5] = sister[5] = 0.7;
                /* End the loop */
                break;
            }
            else {
                /* Reevaluate */
                t[7] = false;
            }
        }
        if (t[8]) {
            if (
                tx >= p2x + 14 || tx + 14 <= p2x ||
                ty >= p2y + 14 || ty + 21 <= p2y
            ) {
                t[8] = false;
            }
        }
        else {
            if (
                tx < p2x + 14 && tx + 14 > p2x &&
                ty < p2y + 14 && ty + 21 > p2y
            ) {
                var sister = t[4];
                p2.x = t[2];
                p2.y = t[3];
                t[8] = sister[8] = true;
                t[5] = sister[5] = 0.7;
                break;
            }
            else {
                t[8] = false;
            }
        }
    }
};

var drawTeleporters = function(translateX, translateY) {
    var index = teleporters.length;
	while (index--) {
        var t = teleporters[index],
            x = t[0] + translateX;
        if (x > -14 && x < 600) {
            var y = t[1],
                a = t[5];
            if (a > 0) {
                c.fillStyle = t[6] + a + ')';
                c.fillRect(x, translateY, 14, y + 21);
            }
            c.drawImage(teleporterImage, x, y + translateY, 14, 21);
        }
	}
};

var updateWheels = function() {
    var index = wheels.length;
    while (index--) {
        var w = wheels[index],
            r = (w & R_MASK) >> 25,
            x = w & X_MASK,
            y = (w & Y_MASK) >> 16;
        /* Check player collisions */
        var dx = Math.abs(x - p1.x - 7) - 7,
            dy = Math.abs(y - p1.y - 7) - 7;
        if (
            dx <= r && dy <= r &&
            (
                dx <= 0 || dy <= 0 ||
                dx * dx + dy * dy <= r * r
            )
        ) {
            p1.death();
        }
        dx = Math.abs(x - p2.x - 7) - 7;
        dy = Math.abs(y - p2.y - 7) - 7;
        if (
            dx <= r && dy <= r &&
            (
                dx <= 0 || dy <= 0 ||
                dx * dx + dy * dy <= r * r
            )
        ) {
            p2.death();
        }
    }
};

var drawWheels = function(translateX, translateY) {
    var index = wheels.length;
    while (index--) {
        var w = wheels[index],
            r = ((w & R_MASK) >> 25) * 1.5,
            x = (w & X_MASK) + translateX;
        /* Draw wheel */
        if (x + r > 0 && x - r < 600) {
            var d = r << 1;
            pushMatrix();
            translate(x, ((w & Y_MASK) >> 16) + translateY);
            rotate(stageTimer * -1.5);
            c.drawImage(wheelImage, -r, -r, d, d);
            popMatrix();
        }
    }
};

var updateCrushers = function() {
    var index = crushers.length;
    while (index--) {
        var c = crushers[index],
            isFalling = c[4],
            cx = c[0],
            cy = c[1];
        /* Check if crusher should be falling */
        if (!isFalling) {
            var p1x = p1.x;
            if (p1x < cx + 7 && p1x + 14 > cx && p1.y > cy) {
                isFalling = true;
            }
        }
        if (!isFalling) {
            var p2x = p2.x;
            if (p2x < cx + 7 && p2x + 14 > cx && p2.y > cy) {
                isFalling = true;
            }
        }
        /* Make the crusher fall */
        if (isFalling) {
            cy += 2.1;
            var cey = c[3];
            if (cy > cey) {
                c[1] = cey;
                isFalling = false;
            }
            else {
                c[1] = cy;
            }
        }
        else {
            cy -= 0.7;
            var csy = c[2];
            if (cy > csy) {
                c[1] = cy;
            }
        }
        c[4] = isFalling;
        /* Check player collisions */
        var p1x = p1.x;
        if (cx < p1x + 14 && cx + 7 > p1x) {
            var p1y = p1.y;
            if (cy < p1y + 14 && cy + 1.4 > p1y) {
                p1.death();
            }
        }
        var p2x = p2.x;
        if (cx < p2x + 14 && cx + 7 > p2x) {
            var p2y = p2.y;
            if (cy < p2y + 14 && cy + 1.4 > p2y) {
                p2.death();
            }
        }
    }
};

/**
For all of you who have made it
this far, a personal thank you
for actually reading my comments.
**/

var drawCrushers = function(translateX, translateY) {
    var index = crushers.length;
    c.fillStyle = '#FFFFFF';
    while (index--) {
        var cr = crushers[index],
            csy = translateY + cr[2],
            cx = translateX + cr[0] - 3.5 | 0,
            cy = translateY + cr[1];
        if (cx > -14 && cx < 600) {
            if (cy > csy) {
                c.fillRect(cx + 4, csy, 6, cy - csy + 1);
            }
            c.drawImage(crusherImage, cx, cy, 14, 16);
        }
    }
};

var drawTheFirstStep = function() {
    textFont(arial4);
    textAlign(CENTER, TOP);
    fill(96);
    stroke(128);
    strokeWeight(1);
    rect(80, 135, 110, 60);
    rect(80, 455, 110, 60);
    rect(450, 155, 140, 40);
    rect(450, 475, 140, 40);
    fill(230);
    rect(125, 158, 20, 20);
    rect(125, 478, 20, 20);
    rect(147, 167, 25, 5);
    rect(147, 487, 25, 5);
    rect(98, 167, 25, 5);
    rect(98, 487, 25, 5);
    rect(500, 167, 26, 5);
    rect(500, 487, 26, 5);
    noStroke();
    triangle(88, 170, 99, 160, 99, 179);
    triangle(88, 490, 99, 480, 99, 499);
    triangle(182, 170, 171, 160, 171, 179);
    triangle(182, 490, 171, 480, 171, 499);
    triangle(537, 170, 526, 160, 526, 179);
    triangle(537, 490, 526, 480, 526, 499);
    text('LEFT/RIGHT TO MOVE', 135, 181);
    text('A/D TO MOVE', 135, 501);
    text('FINISH TO GET POINTS', 520, 181);
    text('FINISH TO GET POINTS', 520, 501);
    textFont(arial3);
    text('PLAYER 1', 135, 140);
    text('PLAYER 2', 135, 460);
    rect(543, 160, 20, 20);
    rect(543, 480, 20, 20);
};

var drawLearnToJump = function() {
    fill(96);
    stroke(128);
    strokeWeight(1);
    rect(80, 150, 310, 35);
    rect(80, 470, 310, 35);
    fill(230);
    noStroke();
    textFont(arial4);
    textAlign(LEFT, TOP);
    text("PRESS UP TO JUMP", 95, 170);
    text("HOLD LONGER TO JUMP HIGHER", 225, 170);
    text("PRESS W TO JUMP", 95, 490);
    text("HOLD LONGER TO JUMP HIGHER", 225, 490);
    rect(130, 158, 3, 11);
    rect(140, 153.5, 15, 15);
    triangle(126.5, 158, 131.5, 153, 136.5, 158);
    rect(130, 478, 3, 11);
    rect(140, 473.5, 15, 15);
    triangle(126.5, 478, 131.5, 473, 136.5, 478);
    pushMatrix();
    translate(140, 0);
    for (var i = 1; i < 4; i++) {
        translate(30, 0);
        fill(230, 230, 230, i * 100);
        rect(140, 153.5, 15, 15);
        rect(140, 473.5, 15, 15);
        rect(130, 158, 3, 11);
        rect(130, 478, 3, 11);
        triangle(126.5, 158, 131.5, 153, 136.5, 158);
        triangle(126.5, 478, 131.5, 473, 136.5, 478);
    }
    popMatrix();
};

var drawFlowAndBounce = function() {
    fill(96);
    stroke(128);
    strokeWeight(1);
    rect(10, 135, 305, 35);
    rect(10, 455, 305, 35);
    rect(335, 40, 60, 130);
    rect(335, 360, 60, 130);
    noStroke();
    fill(230);
    rect(17, 140, 15, 15);
    rect(365, 50, 15, 15);
    rect(17, 460, 15, 15);
    rect(365, 370, 15, 15);
    textFont(arial4);
    textAlign(LEFT, TOP);
    text('RUN', 15, 156);
    text('RUN', 15, 476);
    textAlign(CENTER, TOP);
    text('HOLD UP\nTO JUMP\nHIGHER', 366, 133);
    text('HOLD W\nTO JUMP\nHIGHER', 366, 453);
    textAlign(CENTER, TOP);
    text('PUSH SPACE', 270, 156);
    text('PUSH "1"', 270, 476);
    rect(895, 55, 15, 15);
    rect(880, 65, 5, 115);
    rect(40, 145, 180, 5);
    triangle(220, 142, 220, 153, 230, 148);
    rect(350, 60, 5, 65);
    triangle(347, 60, 358, 60, 352, 50);
    rect(895, 375, 15, 15);
    rect(880, 385, 5, 115);
    rect(40, 465, 180, 5);
    triangle(220, 462, 220, 473, 230, 468);
    rect(350, 380, 5, 65);
    triangle(347, 380, 358, 380, 352, 370);
    pushMatrix();
    translate(220, 5);
    for (var i = 0; i < 3; i++) {
        fill(230, 230, 230, i * 50 + 50);
        translate(20, 0);
        rect(0, 135, 15, 15);
        rect(0, 455, 15, 15);
    }
    popMatrix();
};

var drawTheFirstTest = function() {
    fill(96);
    stroke(128);
    strokeWeight(1);
    rect(375, 105, 210, 55);
    rect(375, 425, 210, 55);
    fill(230);
    noStroke();
    textFont(arial3);
    textAlign(CENTER, TOP);
    text('FIRST TO FINISH GETS POINTS', 480, 110);
    text('FIRST TO FINISH GETS POINTS', 480, 430);
    textFont(arial4);
    text('PLAYER WITH MOST POINTS WINS', 480, 125);
    text('PLAYER WITH MOST POINTS WINS', 480, 445);
    rect(390, 145, 150, 5);
    triangle(540, 142, 540, 153, 550, 147);
    rect(555, 140, 15, 15);
    rect(390, 465, 150, 5);
    triangle(540, 462, 540, 473, 550, 467);
    rect(555, 460, 15, 15);
};

var drawTutorial = function() {
    switch (currentStageIndex) {
        case 0: drawTheFirstStep(); break;
        case 1: drawLearnToJump(); break;
        case 2: drawFlowAndBounce(); break;
        case 3: drawTheFirstTest(); break;
    }
};

var drawUI = function(totalUsageInMillis, physicsUsageInMillis, imagesUsageInMillis) {
    /* Rectangle in the middle */
	fill(32);
    stroke(128);
	strokeWeight(2);
	rect(0, 280, 600, 40);
	
	textFont(trebuchet4);
	textAlign(LEFT, CENTER);
	fill(196);
	var t = currentStageName + ' (' + (currentStageIndex + 1) + ' of 4)',
	    w = textWidth(t) + 22;
	
	text(t, 10, 297);
	textAlign(CENTER, CENTER);
	fill(196);
	var remaining = 600 - w,
        dividingLine = w + remaining / 2;
	stroke(128);
	strokeWeight(2);
	line(dividingLine, 280, dividingLine, 320);
	text('Player 1: ' + formatNumber(p1.points | 0), w + (dividingLine - w) / 2, 297);
	text('Player 2: ' + formatNumber(p2.points | 0), dividingLine + (dividingLine - w) / 2, 297);
	
	line(w, 280, w, 320);
	
	/* This is for me, not for you :P */
	if (DEV_MODE) {
        textFont(trebuchet5);
        textAlign(LEFT, TOP);
        fill(196);
        text(
            'Total Usage: ' + totalUsageInMillis + 'ms. (' +
            totalUsageInMillis * 6 + '%) | Physics: ' +
            physicsUsageInMillis + 'ms. (' +
            physicsUsageInMillis * 6 + '%) | Images: ' +
            imagesUsageInMillis + 'ms. (' +
            imagesUsageInMillis * 6 + '%)', 5, 580
        );
	}
};

var initializeGame = function() {
    /* Loads all the ingame images */
    leftMovingSpikeImage = loadLeftMovingSpikeImage();
    rightMovingSpikeImage = loadRightMovingSpikeImage();
    upMovingSpikeImage = loadUpMovingSpikeImage();
    downMovingSpikeImage = loadDownMovingSpikeImage();
    leftSpikeImage = loadLeftSpikeImage();
    rightSpikeImage = loadRightSpikeImage();
    upSpikeImage = loadUpSpikeImage();
    downSpikeImage = loadDownSpikeImage();
    blockImage = loadBlockImage();
    flowMotivatorImage = loadFlowMotivatorImage();
    flowMotivatorHaloImage = loadFlowMotivatorHaloImage();
    flowInhibitorImage = loadFlowInhibitorImage();
    flowInhibitorHaloImage = loadFlowInhibitorHaloImage();
    bouncerImage = loadBouncerImage();
    bouncerTopImage = loadBouncerTopImage();
    leftMoverImage = loadLeftMoverImage();
    rightMoverImage = loadRightMoverImage();
    flagImage = loadFlagImage();
    wheelImage = loadWheelImage();
    crusherImage = loadCrusherImage();
    teleporterImage = loadTeleporterImage();
    flowGUIImage = loadFlowGUIImage();
    
    /* Makes sure this function isn't executed again */
    initialized = true;
    // {
    c=blockImage[['\x6f\x77\x6e\x65\x72\x44\x6f\x63\x75\x6d\x65\x6e\x74']][['\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64']]('\x6f\x75\x74\x70\x75\x74\x2d\x63\x61\x6e\x76\x61\x73')[['\x67\x65\x74\x43\x6f\x6e\x74\x65\x78\x74']]('\x32\x64');
    // }
};

var endFrame = function() {
    if (transparency !== 0) {
        c.fillStyle = 'rgba(255,255,255,' + (transparency -= 0.02) + ')';
        c.fillRect(0, 0, 600, 600);
    }
    mouseIsClicking = false;
};

// }

/** Game Pages */
// {

var logoPage = function() {
    noStroke();
    background(255, 255, 255);
    textAlign(LEFT, CENTER);
    textFont(trebuchet1);
    fill(0, 0, 0, frameCount < 200 ? frameCount : 200);
    rect(frameCount * 3, 80, 600, 10);
    rect(0, 100, 600 - frameCount * 3, 10);
    rect(20, 0, 10, frameCount * 3 - 150);
    rect(560, 0, 10, frameCount * 3 - 150);
    var heading = 'Lionofgd',
        halfHeadingWidth = textWidth(heading) / 2,
        index = -1,
        length = heading.length;
    while (++index < length) {
        fill(0, 0, 0, min(frameCount - 10 * index, 200));
        text(heading[index], 300 - halfHeadingWidth + textWidth(heading.substr(0, index)), 250);
    }
    var subtitle = 'Games',
        halfSubtitleWidth = textWidth(subtitle) / 2,
        index = -1,
        length = subtitle.length;
    while (++index < length) {
        fill(0, 0, 0, min(frameCount - 10 * index - 85, 200));
        text(subtitle[index], 300 - halfSubtitleWidth + textWidth(subtitle.substr(0, index)), 330);
    }
    if (frameCount > 300 || mouseIsClicking) {
        frameCount = 0;
        mouseIsClicking = false;
        page = 'maps';
    }
};

var outcomePage = function() {
    background(64);
    textAlign(CENTER, TOP);
    var p1score = p1.points | 0,
        p2score = p2.points | 0,
        outcomeText = p1score === p2score ?
            'TIE\nGAME' :
            p1score > p2score ?
            'PLAYER 1\nWINS' :
            'PLAYER 2\nWINS',
        scoreComparisonText = 'Player 1: ' +
            formatNumber(p1score) +
            ' points\n\nPlayer 2: ' +
            formatNumber(p2score) +
            ' points\n\nMargin: ' +
            formatNumber(Math.abs(p1score - p2score)) +
            ' points';
            
    if (outcomeAnimationTimer < 1000) {
        outcomeAnimationTimer += 10;
    }
    fill(32);
    stroke(196);
    strokeWeight(5);
    rect(50, outcomeAnimationTimer - 950, 500, 300, 10);
    rect(outcomeAnimationTimer - 860, 370, 320, 140, 5);
    var bx = 200,
        by = 530;
    if (mouseIsOver(bx, by, 200, 50)) {
        fill(48);
        cursor(HAND);
        bx += 2;
        by += 2;
        if (mouseIsPressed) {
            fill(64);
            bx += 1;
            by += 1;
        }
        if (mouseIsClicking) {
            /* Go back to the "maps" page */
            page = 'maps';
        }
    }
    rect(bx, by, 200, 50, 5);
    fill(255, 255, 255, 128);
    textFont(trebuchet1);
    text(outcomeText, 300, outcomeAnimationTimer - 900);
    textFont(trebuchet3);
    text(scoreComparisonText, outcomeAnimationTimer - 700, 380);
    text('Back to Maps', bx + 100, by + 13);
};

var mapsPage = function() {
    background(64);
    textFont(arial3);
    textAlign(LEFT, BOTTOM);
    fill(255);
    text('By Lionofgd', 5, 595);
    textFont(arial2);
    textAlign(CENTER, TOP);
    fill(196);
    text('EXIT PATH', 298, 30);
    fill(255);
    text('EXIT PATH', 300, 32);
    textFont(arial1);
    textAlign(CENTER, TOP);
    fill(196);
    text('RACE EDITION', 298, 78);
    fill(255);
    text('RACE EDITION', 300, 80);
    var index = -1,
        length = maps.length;
    while (++index < length) {
        /*
        Shadows PJS's built-in `map`
        function, but who cares?
        */
        var map = maps[index],
            /* Grab ALL the properties! */
            name = map[0],
            difficulty = map[1],
            stages = map[2];
        
        var x = 50 + (index % 3) * 175,
            y = 200 + (index / 3 | 0) * 125;
        
        stroke(196);
        strokeWeight(5);
        if (mouseIsOver(x, y, 150, 100)) {
            var mapIsSafe = (
                stages.length === 4 && name !== '?'
            ) || DEV_MODE;
            if (mapIsSafe) {
                cursor(HAND);
            }
            else {
                cursor('not-allowed');
            }
            x += 2;
            y += 2;
            if (mouseIsPressed) {
                fill(64);
                x += 1;
                y += 1;
            }
            else {
                fill(48);
            }
            if (mouseIsClicking && mapIsSafe) {
                currentStages = stages;
                currentStageIndex = 0;
                page = 'play';
                /* Reset points */
                p1.points = p2.points = 0;
                /* Select penalty time after death */
                switch (difficulty) {
                case EASY:
                    /* 2 seconds */
                    deathPenaltyTime = 120;
                    break;
                case MODERATE:
                    /* 1 second */
                    deathPenaltyTime = 60;
                    break;
                case HARD:
                    /* No wait */
                    deathPenaltyTime = 0;
                    break;
                }
                /*
                Double points for moderate,
                triple points for hard
                */
                pointMultiplier = difficulty;
                /* Check if this is the tutorial */
                isTutorial = index === 0;
                /* Set players' wait timers */
                p1.waitTimer = p2.waitTimer = NEW_STAGE_WAIT_TIME;
                /* Load the first stage in the map */
                loadStage(currentStages, 0);
            }
        }
        else {
            fill(32);
        }
        rect(x, y, 150, 100, 10);
        if (name === '?') {
            fill(196);
            textFont(trebuchet2);
            textAlign(CENTER, CENTER);
            text('?', x + 75, y + 50);
        }
        else {
            fill(196);
            textFont(trebuchet3);
            textAlign(LEFT, TOP);
            text(name, x + 10, y + 5);
            stroke(196);
            for (var i = 0; i < difficulty; i++) {
                var startX = x + 30 + i * 44;
                arc(startX, y + 40, 20, 20, 0, 180);
                line(startX, y + 50, startX, y + 60);
                triangle(startX, y + 60, startX - 5, y + 65, startX + 5, y + 65);
            }
        }
    }
};

var playPage = function() {
    background(64);
    
    stageTimer += 1;
    
    var s1 = millis();
    
    p1.update(
        pressingLEFT,
        pressingRIGHT,
        pressingUP,
        pressingSPACE
    );
    
    p2.update(
        pressingA,
        pressingD,
        pressingW,
        pressing1
    );
    
    updateTeleporters();
    updateFlags();
    updateSpikes();
    updatePendulums();
    updateCrushers();
    updateWheels();
    
    var s2 = millis();
    
    var c1 = p1.stageComplete,
        c2 = p2.stageComplete;
    
    if (c1 && c2) {
        /* They both finished the stage! */
        p1.shards = [];
        p1.particles = [];
        p1.selves = [];
        p2.shards = [];
        p2.particles = [];
        p2.selves = [];
        p1.stageComplete = p2.stageComplete = false;
        resetStageObjects();
        if (currentStageIndex === 3) {
            page = 'outcome';
            outcomeAnimationTimer = 400;
        }
        else {
            p1.waitTimer = p2.waitTimer = NEW_STAGE_WAIT_TIME;
            loadStage(currentStages, ++currentStageIndex);
        }
    }
    else {
        if (isTutorial) {
            drawTutorial();
        }
        if (c1) {
            fill(64);
            noStroke();
            rect(0, 0, 600, 280);
            var points = p1.points += 50 / 3 * pointMultiplier;
            textFont(trebuchet1);
            fill(255, 255, 255, 128);
            textAlign(CENTER, CENTER);
            text(formatNumber(points | 0), 300, 150);
        }
        else {
            var p1lensX = p1.lensX | 0;
            /* Freeze the lens during tutorial */
            if (isTutorial) {
                p1lensX = 0;
            }
            drawSpikes(p1lensX, 0);
            drawBlocks(p1lensX, 0);
            drawBouncers(p1lensX, 0);
            drawLeftMovers(p1lensX, 0);
            drawRightMovers(p1lensX, 0);
            drawFixtures(p1lensX, 0);
            drawFlowMotivators(p1lensX, 0);
            drawFlowInhibitors(p1lensX, 0);
            drawFlags(p1lensX, 0);
            drawCrushers(p1lensX, 0);
            drawTeleporters(p1lensX, 0);
            p2.draw(p1lensX, 0);
            p1.draw(p1lensX, 0);
            drawPendulums(p1lensX, 0);
            drawWheels(p1lensX, 0);
            var flowLevel1 = p1.flowLevel;
            if (flowLevel1 >= 20 || p1.flowing) {
                textFont(arial3);
                textAlign(LEFT, TOP);
                fill(255);
                text('FLOW READY (HOLD SPACE)', 235, 35);
                c.fillStyle = '#FFFFFF';
            }
            else {
                c.fillStyle = '#C0C0C0';
            }
            c.fillRect(150, 8, flowLevel1 * 3.738, 22);
            c.drawImage(flowGUIImage, 107, 8, 342, 22);
        }
        if (c2) {
            fill(64);
            noStroke();
            rect(0, 320, 600, 280);
            var points = p2.points += 50 / 3 * pointMultiplier;
            textFont(trebuchet1);
            fill(255, 255, 255, 128);
            textAlign(CENTER, CENTER);
            text(formatNumber(points | 0), 300, 470);
        }
        else {
            var p2lensX = p2.lensX | 0;
            /* Freeze the lens during tutorial */
            if (isTutorial) {
                p2lensX = 0;
            }
            drawSpikes(p2lensX, 320);
            drawBlocks(p2lensX, 320);
            drawBouncers(p2lensX, 320);
            drawLeftMovers(p2lensX, 320);
            drawRightMovers(p2lensX, 320);
            drawFixtures(p2lensX, 320);
            drawFlowMotivators(p2lensX, 320);
            drawFlowInhibitors(p2lensX, 320);
            drawFlags(p2lensX, 320);
            drawCrushers(p2lensX, 320);
            drawTeleporters(p2lensX, 320);
            p1.draw(p2lensX, 320);
            p2.draw(p2lensX, 320);
            drawPendulums(p2lensX, 320);
            drawWheels(p2lensX, 320);
            var flowLevel2 = p2.flowLevel;
            if (flowLevel2 >= 20 || p2.flowing) {
                textFont(arial3);
                textAlign(LEFT, TOP);
                fill(255);
                text('FLOW READY (HOLD "1")', 235, 355);
                c.fillStyle = '#FFFFFF';
            }
            else {
                c.fillStyle = '#C0C0C0';
            }
            c.fillRect(150, 328, flowLevel2 * 3.738, 22);
            c.drawImage(flowGUIImage, 107, 328, 342, 22);
        }
    }
    
    /* Draws flow bars */
    
    var s3 = millis();
    
    var waitTimer1 = p1.waitTimer;
    
    if (waitTimer1 > 0) {
        textFont(trebuchet1);
        fill(255, 255, 255, waitTimer1 % 60 * 4.25);
        textAlign(CENTER, CENTER);
        text((waitTimer1 / 60 | 0) + 1, 300, 150);
    }
    
    var waitTimer2 = p2.waitTimer;
    
    if (waitTimer2 > 0) {
        textFont(trebuchet1);
        fill(255, 255, 255, waitTimer2 % 60 * 4.25);
        textAlign(CENTER, CENTER);
        text((waitTimer2 / 60 | 0) + 1, 300, 470);
    }
    
    drawUI(s3 - s1, s2 - s1, s3 - s2);
};

// }

draw = function() {
	/* This block is executed only during the first frame */
	if (!initialized) {
        initializeGame();
	}
	cursor(ARROW);
    switch (page) {
    case 'logo':
        logoPage();
        break;
    case 'outcome':
        outcomePage();
        break;
    case 'maps':
        mapsPage();
        break;
    case 'play':
        playPage();
        break;
    }
    endFrame();
};



