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
            var levelCols = 32;// level width, in tiles
            var levelRows = 16;// level height, in tiles
            var pCol = 10; // player starting column
            var pRow = 5; // player starting row
            var ct = 0;
            var pS = 4;
            var pL = c.width / levelCols;
            // p for player
            var p = makeRect(c.width/2,c.height*.6, pL, pL, pS, '#FFA62F');
            var toX;
            var toY;            

            var level = [      // the 32x16 level - 1=wall, 0=empty space
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
                [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
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
                        p.y = pRow * c.w / 16;				// converting Y player position from tiles to pixels
                        p.x = pCol *= c.w / 16;
                        s = 2;
                    }
                        break;
                    case 2: inside();
                        break;
                    case 3: // ex: draw game over screen
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
                    case 1: toX = x; toY = y; ct=12;
                        break;
                    case 2: toX = x; toY = y; ct=12;
                        break;
                    case 3: // react to clicks on screen 3
                        break;
                }
            }
            function upC(x){
                if(x==0){
                    return document.documentElement.clientWidth;
                }if(x==1){
                    return document.documentElement.clientHeight;
                }
            }
            //scenes
            // Title
            function title() {
                c.w = upC(0);
                c.h = upC(1);
                c.font = '60px Arial';
                c.textAlign = 'center';
                c.fillStyle = '#FFA62F';
                c.fillText('Robot Mission 404', c.w / 2, c.h / 4);
                c.font = '30px Arial';
                c.fillText('Click to go to street', c.w / 2, c.h / 2);
            }

            function street() {
                c.w = upC(0);
                c.h = upC(1);
                drawSt();
                tx('Robot Mission 404', c.w / 2, c.h / 6);
                tx('Press enter to go inside', c.w / 2, c.h / 2);
                if(ct>0){
                    touchMove(toX,toY);
                    ct--;
                }
                keyMove();
                p.draw();
            }
            function drawSt(){
                let d = c.width/5/3;
                c.fillStyle = '#000000';
                c.fillRect(0, c.height/3, c.width, c.height/3);
                c.fillStyle = '#FF66CC';
                c.fillRect(0, 0, c.width/5, c.height/3);
                c.fillRect(2*c.width/5, 0, c.width/5, c.height/3);
                c.fillRect(4*c.width/5, 0, c.width/5, c.height/3);
                c.fillRect(c.width/5, 2*c.height/3, c.width/5, c.height/3);
                c.fillRect(3*c.width/5, 2*c.height/3, c.width/5, c.height/3);
                c.fillStyle = '#FFFFFF';
                c.fillRect(d, c.height/3-c.height/12, c.width/20, c.height/12);
                c.fillRect((2*c.width/5)+d, c.height/3-c.height/12, c.width/20, c.height/12);
                c.fillRect((4*c.width/5)+d, c.height/3-c.height/12, c.width/20, c.height/12);
                c.fillRect((c.width/5)+d, 2*c.height/3, c.width/20, c.height/12);
                c.fillRect((3*c.width/5)+d, 2*c.height/3, c.width/20, c.height/12);
            }
            function tx(t,w,h){
                c.font = '60px Arial';
                c.textAlign = 'center';
                c.fillStyle = '#FFA62F';
                c.fillText(t,w,h);
            }

            function inside() {
                c.w = upC(0);
                c.h = upC(1);
                tx('Inside', c.w / 2, c.h / 2);
                //ToDo
                inR();
                //player
                p.h = p.w = c.w / levelCols;
                keyMove();
                if(ct>0){
                    touchMove(toX,toY);
                    ct--;
                }
                bump();
                p.y += p.s;
                p.draw();
            }
            function inR() {
                var tileSize = c.w / levelCols;
                // converting X player position from tiles to pixels
                c.width = tileSize * levelCols;   // canvas width. Won't work without it even if you style it from CSS
                c.height = tileSize * levelRows; // canvas height. Same as before

                for (i = 0; i < levelRows; i++) {
                    for (j = 0; j < levelCols; j++) {
                        if (level[i][j] == 1) {
                            c.fillStyle = "#ff0000";
                            c.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
                        }if (level[i][j] == 2) {
                            c.fillStyle = "#E0115F";
                            c.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
                        }
                    }
                }

            }
            function bump() {
                // check for horizontal collisions
                var tileSize = c.w / levelCols;
                var baseCol = Math.floor(p.x / tileSize);
                var baseRow = Math.floor(p.y / tileSize);
                var colOverlap = p.x % tileSize;
                var rowOverlap = p.y % tileSize;

                if ((level[baseRow][baseCol + 1] && !level[baseRow][baseCol]) || (level[baseRow + 1][baseCol + 1] && !level[baseRow + 1][baseCol] && rowOverlap)) {
                    p.x = (baseCol * tileSize);
                }
                if ((!level[baseRow][baseCol + 1] && level[baseRow][baseCol]) || (!level[baseRow + 1][baseCol + 1] && level[baseRow + 1][baseCol] && rowOverlap)) {
                    p.x = ((baseCol + 1) * tileSize);
                }
                if ((level[baseRow + 1][baseCol] && !level[baseRow][baseCol]) || (level[baseRow + 1][baseCol + 1] && !level[baseRow][baseCol + 1] && colOverlap)) {
                    p.y = (baseRow * tileSize);
                }
                if ((!level[baseRow + 1][baseCol] && level[baseRow][baseCol]) || (!level[baseRow + 1][baseCol + 1] && level[baseRow][baseCol + 1] && colOverlap)) {
                    p.y = ((baseRow + 1) * tileSize);
                }
            }

            function keyMove() {
                if (u) { p.y -= p.s * 5;};
                if (d) { p.y += p.s; };
                if (r) { p.x += p.s; };
                if (l) { p.x -= p.s; };
            }

            function touchMove(x, y) {
                if ((p.x > x + p.s || p.x < x - p.s)
                    || (p.y > y + p.s || p.y < y - p.s)) {
                    if (p.x != x) {
                        if (x > p.x) {
                            p.x += p.s;
                        } else {
                            p.x -= p.s;
                        }
                    } if (p.y != y) {
                        if (y > p.y) {
                            p.y += p.s;
                        } else {
                            p.y -= p.s*5;
                        }
                    }
                }
            }
