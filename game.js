// initialize 2D canvas (c)
// initialize game state (s)
// initialize keys states (u,r,d,l for directions, k for all the keyboard)
c = a.getContext`2d`, k = [u = r = d = l = s = 0]

// (initialize your global variables here)
c.width = document.documentElement.clientWidth;
c.height = document.documentElement.clientHeight;

// update u,l,d,r globals when an arrow key/wasd/zqsd is pressed or released
// update k[keyCode] if any other key is pressed/released
onkeydown = onkeyup = e => k[e.which] = self['lld*rlurdu'[e.which % 32 % 17]] = e.type[5]

function makeRect(x, y, width, height, speed, color) {
    if (!color) color = '#000000';
    return {
        x: x,
        y: y,
        w: width,
        h: height,
        s: speed,
        c: color,
        draw: function () {
            c.fillStyle = this.c;
            c.fillRect(this.x, this.y, this.w, this.h);
        }
    };
}
// Keep track of gameOver for restart
var gameOver = false;
var levelCols = 32;// level width, in tiles
var levelRows = 16;// level height, in tiles
var pCol = 1; // player starting column
var pRow = 7; // player starting row
var ct2 = 0;
var pS = 4;
var pL = c.width / levelCols;
var touch = false;
var done = true;

// p for player
pImg = new Image();
var p = sprite({
    context: c,
    width: 350,
    height: 70,
    image: pImg,
    numberOfFrames: 5,
    ticksPerFrame: 40,
    x: c.width / 4,
    y: c.height / 2,
    s: pS
});

pImg.src = "robot2.png"
p.scaleRatio = 1;
var toX;
var toY;
var onOff = -1;

var numnpcs = 5,

    npcs = [];
for (i = 0; i < numnpcs; i += 1) {
    spawnnpc();
    npcs[i].seq = [0, 0, 1, 1, 2, 2, 1, 1];
}
var room = 0;
// Adventure text
var story = 'Press enter to go inside';
var choose = "";
var choices = [["1", "2", "3", "4", "5"], ["test", "test2", 3, 4, 5]];

//endgame
var game = 2;
var mob = [false, false, false, false, false];

var level = [      // the 32x16 level - 1=wall, 0=empty space
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 2, 1],
    [1, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
// Note: If tight on space we could flip spots in the level to make different layouts. 
// use a [[i,j]] array for any changes and loop in reusable function.

// start game loop (60fps)
// the canvas is cleared and adjusted to fullscreen at each frame
// draw each screen in the switch's cases
// in each screen, you can make key presses update the game state
// ex: "press enter to open the menu" => `if(k[13])s=1;`
setInterval(e => {
    a.width = innerWidth, a.height = innerHeight;
    switch (s) {
        case 0: title();
            break;
        case 1: street(); if (k[13]) {
            goInside();
        }
            break;
        case 2: inside();
            break;
        case 3: mob = [false, false, false, false, false]; s=1;// ex: draw game over screen
            break;
    }
}, 16)

// handle click/touch events
// globals x and y contain the pointer's coordinates
// in each screen, you can make a click update the game state
// ex: "game over if we click on the bottom half of the screen" => `if(y>h/2)s=3;`
onclick = e => {
    x = e.pageX; y = e.pageY;
    switch (s) {
        case 0: if (y > c.h / 2) s = 1;
            break;
        case 1: toX = x; toY = y; ct = 600; touch = true; done = false;
            break;
        case 2: toX = x; toY = y; ct = 600; touch = true; done = false;
            break;
        case 3: // react to clicks on screen 3
            break;
    }
}
function upC(x) {
    if (x == 0) {
        return document.documentElement.clientWidth;
    } if (x == 1) {
        return document.documentElement.clientHeight;
    }
}

function tx(t, w, h, f, s) {
    c.textAlign = 'center';
    c.fillStyle = s;
    c.font = f + 'vw Arial';
    c.fillText(t, w, h);
}
//scenes
// Title
function title() {
    c.w = upC(0);
    c.h = upC(1);
    tx('Robot Mission 404', c.w / 2, c.h / 4, 6, '#FFA62F');
    tx('Click to go to street', c.w / 2, c.h / 2, 3, '#000000');
}

function street() {
    c.w = upC(0);
    c.h = upC(1);
    drawSt();
    tx('Robot Mission 404', c.w / 2, c.h / 6, 5, '#000000');
    tx(story, c.w / 2, c.h / 2, 2.5, '#FFA62F');
    if (!touch) { keyMove(); }
    if (touch && !done) { touchMove(toX, toY); }
    // p.update();
    //Note: To have better images don't use sprite sheets for movement just tween function
    // It requires less images, can use a sequence of frames/x/y movements instead
    p.render();
}
function drawSt() {
    let d = c.width / 5 / 3;
    c.fillStyle = '#000000';
    c.fillRect(0, c.height / 3, c.width, c.height / 3);
    c.fillStyle = '#FF66CC';
    c.fillRect(0, 0, c.width / 5, c.height / 3);
    c.fillRect(2 * c.width / 5, 0, c.width / 5, c.height / 3);
    c.fillRect(4 * c.width / 5, 0, c.width / 5, c.height / 3);
    c.fillRect(c.width / 5, 2 * c.height / 3, c.width / 5, c.height / 3);
    c.fillRect(3 * c.width / 5, 2 * c.height / 3, c.width / 5, c.height / 3);
    c.fillStyle = '#FFFFFF';
    c.fillRect(d, c.height / 3 - c.height / 12, c.width / 20, c.height / 12);
    c.fillRect((2 * c.width / 5) + d, c.height / 3 - c.height / 12, c.width / 20, c.height / 12);
    c.fillRect((4 * c.width / 5) + d, c.height / 3 - c.height / 12, c.width / 20, c.height / 12);
    c.fillRect((c.width / 5) + d, 2 * c.height / 3, c.width / 20, c.height / 12);
    c.fillRect((3 * c.width / 5) + d, 2 * c.height / 3, c.width / 20, c.height / 12);
}


function goInside() {
    if (p.y < c.height / 3) {
        building();
    } else if (p.y > c.height * .66) {
        building();
    } else {
        story = "Inside where? You're in the middle of the street!"
    }
}
// ToDo take in which building to draw different levels.
function building() {
    story = 'Mission: Enter 404 as 404 use 404 to 404.';
    p.y = pRow * c.w / 16;
    p.x = pCol *= c.w / 16;
    s = 2;
}

function inside() {
    c.w = upC(0);
    c.h = upC(1);

    //ToDo
    drawR();
    //player
    // p.w = c.w / levelCols;

    //npc
    let t = false;
    for (i = 0; i < npcs.length; i += 1) {
        npcs[i].update();
        npcs[i].render();
        if(game==2){
        if (p.isClose(npcs[i].x, npcs[i].y)) {
            // check for game state... adventure vs endgame.
            if (game == 1) {
                story = choices[room][i];
                choose = "Incoporate into memory file? Y or N";
                t = true;
            } else {
                npcs[i].seq = [1, 0, 3, 4, 3, 1];
                mob[i] = true;
            }
        }
        if(!mob[i]){npcs[i].seq =[0, 0, 1, 1, 2, 2, 1, 1]};
    }}
    if (!t) {
        // replace 404 with variables that hold current assignment
        story = 'Mission: Enter 404 as 404 use 404 to 404.';
        choose = "";
    }
    p.render();
    if (l || r || u || d) {
        touch = false;
    }
    if (!touch) { keyMove(); }
    if (touch && !done) { touchMove(toX, toY); } else {
        p.y += p.s;
    }
    bump(p);

    tx(story, c.w / 2, c.h * .07, 3, '#FFFFFF');
    tx(choose, c.w / 2, c.h * .11, 2, '#000000');
    if(k[88]){s=3};
}
function drawR() {
    var tileSize = c.w / levelCols;
    // converting X player position from tiles to pixels
    c.width = tileSize * levelCols;   // canvas width. Won't work without it even if you style it from CSS
    c.height = tileSize * levelRows; // canvas height. Same as before

    nI = 0;


    for (i = 0; i < levelRows; i++) {
        for (j = 0; j < levelCols; j++) {
            if (level[i][j] == 1) {
                c.fillStyle = "#ff0000";
                c.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
            } if (level[i][j] == 2 && nI < numnpcs) {
                if (game == 2 && mob[nI]) {
                    let n=p.x+tileSize*2
                    if(n>c.w*0.1&&n<c.w*.9&&!(npcs[nI].y>p.y+tileSize*5)){
                        npcs[nI].x = p.x-tileSize-nI*5;
                    }
                    if(npcs[nI].y+p.s<c.h*.9){
                        npcs[nI].y += p.s;
                    }           
                    bump(npcs[nI]);
                } else {
                    npcs[nI].x = j * tileSize; npcs[nI].y = i * tileSize;
                }
                nI++;
            }
        }
    }

}
function chase(npc) {
    npc.x = p.x;
    npc.y = p.y;
}
//Todo
// function run(){

// }

function bump(s) {
    // check for horizontal collisions
    var tileSize = c.w / levelCols;
    var baseCol = Math.floor(s.x / tileSize);
    var baseRow = Math.floor(s.y / tileSize);
    var colOverlap = s.x % tileSize;
    var rowOverlap = s.y % tileSize;

    if ((level[baseRow][baseCol + 1] && !level[baseRow][baseCol]) || (level[baseRow + 1][baseCol + 1] && !level[baseRow + 1][baseCol] && rowOverlap)) {
        s.x = (baseCol * tileSize);
    }
    if ((!level[baseRow][baseCol + 1] && level[baseRow][baseCol]) || (!level[baseRow + 1][baseCol + 1] && level[baseRow + 1][baseCol] && rowOverlap)) {
        s.x = ((baseCol + 1) * tileSize);
    }
    if ((level[baseRow + 1][baseCol] && !level[baseRow][baseCol]) || (level[baseRow + 1][baseCol + 1] && !level[baseRow][baseCol + 1] && colOverlap)) {
        s.y = (baseRow * tileSize);
    }
    if ((!level[baseRow + 1][baseCol] && level[baseRow][baseCol]) || (!level[baseRow + 1][baseCol + 1] && level[baseRow][baseCol + 1] && colOverlap)) {
        s.y = ((baseRow + 1) * tileSize);
    }
}

function sprite(options) {

    var that = {},
        frameIndex = 0,
        tickCount = 0,
        spot = 0,
        ticksPerFrame = options.ticksPerFrame || 0,
        numberOfFrames = options.numberOfFrames || 1;

    that.context = options.context;
    that.w = options.width;
    that.h = options.height;
    that.x = options.x;
    that.y = options.y;
    that.image = options.image;
    that.scaleRatio = 1;
    that.s = options.s;
    that.seq = [];

    // ToDo: that.sequence 
    // choose frames/movements (should be able to update depending on sequence)
    // replaces update with a tween like sprite animation
    // should change frame index according to sequence instead of looping spritesheet
    that.switch = function (i) {
        frameIndex = i;
    };

    that.update = function () {

        tickCount += 1;

        if (tickCount > ticksPerFrame) {

            tickCount = 0;

            // If the current frame index is in range
            if (frameIndex < numberOfFrames - 1) {
                // Go to the next frame
                frameIndex += 1;
                if (that.seq.length > 0) {
                    frameIndex = that.seq[spot];
                    spot += 1;
                }
            } else {
                frameIndex = 0;
            }
            if (spot > that.seq.length - 1) {
                spot = 0;
            }
        }
    };

    that.render = function () {

        // Draw the animation
        that.context.drawImage(
            that.image,
            frameIndex * that.w / numberOfFrames,
            0,
            that.w / numberOfFrames,
            that.h,
            that.x,
            that.y,
            that.w / numberOfFrames * that.scaleRatio,
            that.h * that.scaleRatio);
    };

    that.getFrameWidth = function () {
        return that.w / numberOfFrames;
    };
    that.isClose = function (x, y) {
        var dx = (that.x + that.getFrameWidth() / 2 * that.scaleRatio) - x,
            dy = (that.y + that.getFrameWidth() / 2 * that.scaleRatio) - y;

        var dist = Math.sqrt(dx * dx + dy * dy);


        if (dist < that.getFrameWidth() * that.scaleRatio) {
            return true;
        } else {
            return false;
        }
    }

    return that;
}

function spawnnpc() {

    var npcIndex,
        npcImg;

    // Create sprite sheet
    npcImg = new Image();

    npcIndex = npcs.length;

    // Create sprite
    npcs[npcIndex] = sprite({
        context: c,
        width: 256,
        height: 32,
        image: npcImg,
        numberOfFrames: 8,
        ticksPerFrame: 5
    });
    npcs[npcIndex].x = 0;
    npcs[npcIndex].y = 0;
    npcs[npcIndex].scaleRatio = 1.5;
    // Load sprite sheet
    npcImg.src = "man.png";
}



// [{x:14,y:12,w:c.w / levelCols},{x:4,y:2,w:c.w / levelCols}];

function keyMove() {
    if (u) { p.y -= p.s * 5; p.switch(4); };
    if (d) { p.y += p.s; p.switch(4); };
    if (r) { p.x += p.s; p.switch(3); };
    if (l) { p.x -= p.s; p.switch(2); };
    if (u && r) { p.switch(1); };
    if (u && l) { p.switch(0); };
    if (!u && !d && !r && !l) {
        p.seq = [1, 0];
        p.update();
        p.seq = [];
    };
}

function touchMove(x, y) {
    if ((p.x > x + p.s || p.x < x - p.s)
        || (p.y > y + p.s || p.y < y - p.s)) {
        if (p.x != x) {
            if (p.y != y) {
                p.switch(4)
                if (y > p.y) {
                    p.y += p.s;
                } else {
                    p.y -= p.s;
                }
            }
            if (x > p.x) {
                p.switch(1);
                p.x += p.s;
            } else {
                p.switch(0);
                p.x -= p.s;
            }
        }
    } else {
        done = true;
        touch = false;
    }
}
