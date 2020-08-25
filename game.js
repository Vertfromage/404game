// initialize 2D canvas (c)
// initialize game state (s)
// initialize keys states (u,r,d,l for directions, k for all the keyboard)
c = a.getContext`2d`, k = [u = r = d = l = s = 0]
// (initialize your global variables here)
c.w = innerWidth;
c.h = innerHeight;
// update u,l,d,r globals when an arrow key/wasd/zqsd is pressed or released
// update k[keyCode] if any other key is pressed/released
onkeydown = onkeyup = e => k[e.which] = self['lld*rlurdu'[e.which % 32 % 17]] = e.type[5]

// Keep track of gameOver for restart
var levelCols = 32;// level width, in tiles
var levelRows = 16;// level height, in tiles
var pCol = 2; // player starting column
var pRow = 12; // player starting row
var ct2 = 0;
var pS = 4;
var pL = c.width / levelCols;
var touch;
var done;
var gameOver = false;
var testing = false;
var tool;
var tS;

// p for player
var p = makeSprite(c, 350, 70, "robot2.png", 5, 40, c.w / 4, c.h / 2, 1, pS);
var toX, toY = 0,
    onOff = -1, numnpcs = 5,
    npcs = [],
    bd = [];
for (let i = 0; i < numnpcs; i += 1) {
    spawnnpc();
    npcs[i].seq = [0, 0, 1, 1, 2, 2, 1, 1];
}
var totalNPC = 5;
for (let i = 0; i < 5; i += 1) {
    if (i > 2) {
        spawnb("buildFlip.png");
    } else {
        spawnb("build.png");
    }
    bd[i].seq = [0];
}
var R = 0;
// Adventure text
var story;
var choose;
var speak = ["This is a ", "Ahh! You're an ", "You have a ", "You're here to ", ""];
var choices = [["Peaceful Town", "Alien", "Warp Tunnel", "Destroy all life!", "Ahhh! What are you?!"], ["Mob's Hideout", "Robo Cop", "Laser Gun", "Fight the Mob!", "Can I pay you off?"], ["Government Facility", "Escaped Experiment", "Self Destruct", "Destroy the Evidence.", "I'm going to be in so much trouble!"], ["Delightful Bakery", "Bad Trip", "Cool Jet Pack", "Try the Brownies?", "Yikes!"], ["Enviromental Organization", "Volunteer", "Vacuum", "Clean Up Trash", "I can't believe my eyes!"]];
var data;

//endgame
var game;
var mob;
var health;

var level = [[      // L1
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [4, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [4, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
],
//L2
[
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 1, 2, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 2, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 1, 2, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 2, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [4, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
    [4, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [4, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
],
//L3
[
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 0, 0, 1],
    [1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    
],
//L4
[
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 2, 1, 0, 0, 1, 0, 1, 2, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 2, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 2, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1],
    [4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 2, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [4, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [4, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
],
//L5
[
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 2, 0, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 2, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [4, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 2, 1, 1, 1],
    [4, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],

];
// start game loop (60fps)
// the canvas is cleared and adjusted to fullscreen at each frame
setInterval(e => {
    a.width = innerWidth, a.height = innerHeight;
    switch (s) {
        case 0: title();
            break;
        case 1: street(); if (k[13]) { testing = true; }
            break;
        case 2: inside();
            break;
        case 3: s = 1;// back to street;
            break;
        case 4: endScreen(); if (k[13]) {
            s = 0;
        }
            break;
        case 5: mapEditor();
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
        case 0: s = 1;
            break;
        case 1: toX = x; toY = y; ct = 600; touch = true; done = false;
            break;
        case 2: toX = x; toY = y; ct = 600; touch = true; done = false;
            break;
        case 3: // react to clicks on screen 3
            break;
        case 5: toX = x; toY = y; tapped(x, y, false); break;
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
    c.w = a.width;
    c.h = a.height;
    data = ["404", "404", "404", "404"];
    touch = false;
    done = true;
    story = 'Robot Mission 404';
    choose = "";
    game = 1;
    mob = [false, false, false, false, false];
    health = 100;
    c.fillStyle = '#241007';
    c.fillRect(0, 0, c.w, c.h);
    tx(story, c.w / 2, c.h * .45, 6, '#dc21ff');
    tx('Click to go to street', c.w / 2, c.h * .6, 3, "#f5e2b4");
}

function endScreen() {
    tx(story + 'Self-destruct!', a.width / 2, a.height / 4, 6, '#dc21ff');
    // click to restart?
    tx("Press enter to restart.", a.width / 2, a.height / 2, 3, '#000000');
    if (k[88]) { s = 0 };
}

function street() {
    c.w = a.width;
    c.h = a.height;
    mob = [false, false, false, false, false];
    c.fillStyle = "#f5e2b4";
    c.fillRect(0, 0, c.w, c.h);
    c.fillStyle = '#241007';
    c.fillRect(0, c.h / 3, c.w, c.h / 3);
    let bX, bY = 0;
    for (i = 0; i < bd.length; i++) {
        if (i > 2) {
            bY = 2 * c.h / 3;
            bX = (i - 2) * 2 * c.w / 5 - c.w / 5 + c.w / 50;
        } else {
            bX = i * 2 * c.w / 5 + c.w / 50;
        }
        bd[i].x = bX
        bd[i].y = bY;
        bd[i].scaleRatio = c.w * .0202;
        bd[i].update();
        bd[i].render();
        let cent = bd[i].w / 2;
        if (p.isClose(bX + cent, bY + cent, 1)) {
            R = i;
            if (testing) {
                s = 5;
            } else {
                building();
            }
        }
    }
    tx('Robot Mission 404', c.w / 2, c.h / 2, 5, '#dc21ff');
    story = 'Mission: Enter ' + data[0] + ' as ' + data[1] + ' use ' + data[2] + ' to ' + data[3];
    tx(story, c.w / 2, c.h * .6, 2.5, "#f5e2b4");
    if (!touch) { keyMove(); }
    if (touch && !done) { touchMove(toX, toY); }
    p.render();
}

// ToDo take in which building to draw different levels.
function building() {
    p.x = pCol * a.width / 32;
    p.y = pRow * a.height / 16;
    s = 2;
}
function complete() {
    for (i in data) {
        if (data[i] == 404) {
            return false;
        }
    }
    return true;
}

function inside() {
    c.w = a.width;
    c.h = a.height;
    drawR();
    //npc
    let t = false;
    for (i = 0; i < npcs.length; i ++) {
        npcs[i].update();
        npcs[i].render();

        if (p.isClose(npcs[i].x, npcs[i].y, 1)) {
            // check for game state... adventure vs endgame.
            if (game == 1) {
                story = speak[i] + choices[R][i] + "!";
                choose = "Incoporate into memory file? Y or N";
                t = true;
                if (k[89] && i != 4) {
                    data[i] = choices[R][i];
                } else if (k[78]) {
                    data[i] = "404";
                } else if (i == 4 && k[78]) {
                    data[2] = "404";
                }
            } if (game == 2) {
                {
                    npcs[i].newSeq([1, 0, 3, 4, 3, 1]);
                    mob[i] = true;
                    // if using tool, result... pop from array after timer counts down/animation.
                }
            }
        }
    }
    if (!t) {
        story = 'Mission: Enter ' + data[0] + ' as ' + data[1] + ' use ' + data[2] + ' to ' + data[3];
        choose = "";
        if (complete() && game == 1) {
            choose = "Memory restored. Start mission? Y ? N"
            if (k[89]) {
                // assign tool,location, goal, make tool sprite,
                // makeTool(); 
                game = 2;
            }
        }
        if (game == 2) {
            choose = "Health: " + Math.floor(health);
        }
    }
    // if game == 2 and key pressed for tool play tool animation. 
    if(game==2){
        // if(tool==1||tool==2){
        //     tS.update();
        //     tS.render();
        //     // if(tool==2){
        //     //     tS.x+=p.s;
        //     // }
        // }
        if(k[13]){
            console.log("c.w "+c.w+"c.h "+c.h);
            console.log(npcs);
        }
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

    tx(story, a.width/ 2, c.h * .06, 2, "#f5e2b4");
    tx(choose, a.width / 2, c.h * .11, 1.8, '#000000');
    let tile = a.width / levelCols
    if (p.y > tile * 12 && p.x < tile * 1 + tile / 4) {
        s = 3;
    }
    // if game==2 check for mission complete, if complete story = mission complete s=4
    if (health < 0) { story = "Mission Incomplete, "; s = 4 };
}
function drawR() {
    c.fillStyle = "#f5e2b4";
    c.fillRect(0, 0, a.width, a.height);
    var tileSize = a.width / levelCols;
    // converting X player position from tiles to pixels
    c.width = tileSize * levelCols;   // canvas width. Won't work without it even if you style it from CSS
    c.height = tileSize * levelRows; // canvas height. Same as before

    var nI = 0;

    for (i = 0; i < levelRows; i++) {
        for (j = 0; j < levelCols; j++) {
            let box = level[R][i][j];
            if (box != 0 && box != 2) {
                switch (box) {
                    case 1: c.fillStyle = '#dc21ff';
                        break;
                    case 4: c.fillStyle = "#000000";
                        break;
                }
                c.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
            } if (box == 2 && nI < numnpcs) {
                c.fillRect(npcs[nI].x, npcs[nI].y, tileSize, tileSize);
                if (game == 2 && mob[nI]) {
                    let n = p.x - nI * 5 - tileSize * 2;
                    // boolean to make sure move leaves you inside 
                    let b = (n<c.width-tileSize&&n>tileSize);
                    if (npcs[nI].isClose(p.x, p.y, 3) && !(npcs[nI].y > p.y + tileSize * 3)&& b) {
                        npcs[nI].x = n;
                        health -= .02;
                    }
                    if (npcs[nI].y + p.s < c.height-tileSize) {
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
// Endgame
function makeTool(){
    switch(data[2]){
        case "Warp Tunnel":;
        case "Vacuum":tool=1; tS=makeSprite(c, 24, 4, "warp.png", 4, 5, p.x, p.y, 10, 0);
        break;
        case "Laser Gun":tool=2; tS=makeSprite(c, 90, 15, "fire.png", 6, 5, p.x, p.y, 6, 0);tS.seq=[0,1,2,3,4,4,4,4,5];
        break;
        case "Cool Jet Pack": tool=3;
        break;
        case "Self Destruct":tool=4;
        break;
    }
    console.log(tool);
}

function mapEditor() {
    drawR();
    for (i = 0; i < npcs.length; i += 1) {
        npcs[i].update();
        npcs[i].render();

    }
    if (k[13]) {
        console.log(level[R]);
        s=2;testing=false;
    }
    if (u) { tapped(toX, toY, true) };
}
function tapped(x, y, t) {
    var tileSize = a.width / levelCols;
    var baseCol = Math.floor(x / tileSize);
    var baseRow = Math.floor(y / tileSize);
    let cur = level[R][baseRow][baseCol];
    switch (cur) {
        case 0: cur = 1;
            break;
        case 1: cur = 0;
            break;
        case 2: cur = 0;
            break;
    }
    if (t) { cur = 2; }
    level[R][baseRow][baseCol] = cur;
}

function bump(s) {
    // check for horizontal collisions
    var tileSize = a.width / levelCols;
    var baseCol = Math.floor(s.x / tileSize);
    var baseRow = Math.floor(s.y / tileSize);
    var colOverlap = s.x % tileSize;
    var rowOverlap = s.y % tileSize;

    if(baseRow>16){
        // console.log("s.y "+s.y); Only with resize
        return;
    }
    if(baseCol>32){
        // console.log("s.x "+s.x );
        return;
    }

    // To check for 2 during game==2 store possible searches is var loop to turn 2's to 0's
    let ch = [level[R][baseRow][baseCol], level[R][baseRow][baseCol + 1], level[R][baseRow + 1][baseCol], level[R][baseRow + 1][baseCol + 1]];

    // for (i of ch) {
    //     if (ch[i] == 2) {
    //         ch[i] = 0;
    //     }
    // }
    if ((ch[1] && !ch[0]) || (ch[3] && !ch[2] && rowOverlap)) {
        s.x = (baseCol * tileSize);
    }
    if ((!ch[1] && ch[0]) || (!ch[3] && ch[2] && rowOverlap)) {
        s.x = ((baseCol + 1) * tileSize);
    }
    if ((ch[2] && !ch[0]) || (ch[3] && !ch[1] && colOverlap)) {
        s.y = (baseRow * tileSize);
    }
    if ((!ch[2] && ch[0]) || (!ch[3] && ch[1] && colOverlap)) {
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

    that.newSeq = function(seq){
        spot=0;
        that.seq= seq;
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
            } else if(that.seq.length<1){
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
    that.isClose = function (x, y, t) {
        var dx = (that.x + that.getFrameWidth() / 2 * that.scaleRatio) - (x + that.getFrameWidth() / 2),
            dy = (that.y + that.getFrameWidth() / 2 * that.scaleRatio) - (y + that.getFrameWidth() / 2);

        var dist = Math.sqrt(dx * dx + dy * dy);


        if (dist < that.getFrameWidth() * that.scaleRatio * t) {
            return true;
        } else {
            return false;
        }
    }

    return that;
}
function makeSprite(c, w, h, img, f, t, x, y, r, s) {
    let i;
    i = new Image();
    sp = sprite({
        context: c,
        width: w,
        height: h,
        image: i,
        numberOfFrames: f,
        ticksPerFrame: t,
        s: s
    });
    sp.x = x;
    sp.y = y;
    sp.scaleRatio = r;
    i.src = img;
    return sp;
}

function spawnnpc() {
    let i = npcs.length;
    npcs[i] = makeSprite(c, 256, 32, "man.png", 8, 5, 0, 0, 1.5, 2);
}
function spawnb(img) {
    let i = bd.length;
    bd[i] = makeSprite(c, 100, 8, img, 10, 20, 0, 0, 0, 0);
}


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
// ToDo update function for everything that has to be updated according to screen size!!!
