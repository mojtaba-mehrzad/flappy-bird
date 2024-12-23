var cvs = document.querySelector("canvas");
var ctx = cvs.getContext("2d");
var frames = 0;
var degree = Math.PI / 180;

var sprite = new Image();
sprite.src = "img/sprite.png"

var flap = new Audio();
flap.src = "sounds/flap.wav"

var hit = new Audio();
hit.src = "sounds/hit.wav"

var Score = new Audio();
Score.src = "sounds/score.wav"

var start = new Audio();
start.src = "sounds/start.wav"

var die = new Audio();
die.src = "sounds/die.wav"

var state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

function clickHandler(){
    switch(state.current){
        case state.getReady:
            start.play();
            state.current = state.game;
            break;
        case state.game:
            flap.play();
            bird.flap();
            break;
        default:
            bird.speed = 0;
            bird.rotation = 0;
            pipes.position = [];
            score.value = 0;
            // fg.dx = 2;
            // pipes.dx = 2;
            state.current = state.getReady;
            break;
    }
}
document.addEventListener("touch" , clickHandler)
document.addEventListener("click" , clickHandler)
document.addEventListener("keydown" , function(e){
    if(e.which == 32)
        clickHandler();
})

var bg = {
    sx: 0,
    sy: 0,
    w: 275,
    h: 226,
    x: 0,
    y: cvs.height - 226,
    draw : function(){
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h)
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x + this.w,this.y,this.w,this.h)
    }
}

var fg = {
    sx: 276,
    sy: 0,
    w: 224,
    h: 112,
    x: 0,
    dx: 2,
    y: cvs.height - 112,
    draw : function(){
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h)
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x + this.w,this.y,this.w,this.h)
    },

    update : function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx) % (this.w/2);
        }
    }
}

var getReady = {
    sx: 0,
    sy: 228,
    w: 173,
    h: 152,
    x: cvs.width/2 - 173/2,
    y: 80,
    draw : function(){
        if(state.current == state.getReady)
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h)
    }
}

var gameOver = {
    sx: 175,
    sy: 228,
    w: 225,
    h: 202,
    x: cvs.width/2 - 225/2,
    y: 90,
    draw : function(){
        if(state.current == state.over)
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h)
    }
}

var bird = {
    animation : [
        {sx: 276, sy: 112},
        {sx: 276, sy: 139},
        {sx: 276, sy: 164},
        {sx: 276, sy: 139}
    ],
    w: 34,
    h: 26,
    x: 50,
    y: 150,
    speed : 0,
    gravity : 0.25,
    jump : 4.6,
    radius : 12,
    rotation : 0,
    animationIndex : 3,
    draw : function(){
        let bird = this.animation[this.animationIndex]
        ctx.save();
        ctx.translate(this.x , this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite,bird.sx,bird.sy,this.w,this.h, - this.w/2, - this.h/2,this.w,this.h);
        ctx.restore();
    },

    update : function(){
        let period = state.current == state.getReady ? 10 : 5;
        this.animationIndex += frames % period == 0 ? 1 : 0;
        this.animationIndex = this.animationIndex % this.animation.length
        if(state.current == state.getReady){
            this.y = 150;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            if(this.speed < this.jump){
                this.rotation = -25 *degree;
            }else{
                this.rotation = 90 * degree;
            }
        }

        if(this.y + this.h/2 >= cvs.height - fg.h){
            this.y = cvs.height - fg.h - this.h/2;
            this.animationIndex = 1;
            if(state.current == state.game){
                die.play();
                state.current = state.over;
            }
        }

        // if(score.value % 10 == 0){
        //     fg.dx += 0.1;
        //     pipes.dx += 0.1;
        // }
    },

    flap : function(){
        this.speed = -this.jump;
    }
}

var pipes = {
    top : {sX : 553, sY : 0},
    bottom : {sX : 502, sY : 0},
    w : 53,
    h : 400,
    dx : 2,
    gap : 80,
    position : [],
    maxYPos : -150,
    draw : function(){
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i]
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            ctx.drawImage(sprite,this.top.sX,this.top.sY,this.w,this.h,p.x,topYPos,this.w,this.h)
            ctx.drawImage(sprite,this.bottom.sX,this.bottom.sY,this.w,this.h, p.x,bottomYPos,this.w,this.h)
        }
    },
    update : function(){
        if(state.current != state.game) return;
        if(frames % 100 == 0){
            this.position.push({
                x: cvs.width,
                y: this.maxYPos * (Math.random() + 1)
            })
        }

        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i]
            p.x -= this.dx

            let bottomPipesPos = p.y +this.h + this.gap;

            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y 
                && bird.y - bird.radius < p.y + this.h){
                    state.current = state.over;
                    hit.play();
            }

            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipesPos
                && bird.y - bird.radius < bottomPipesPos + this.h){
                    state.current = state.over;
                    hit.play();
            }

            if(p.x + this.w <= 0){
                this.position.shift()
                score.value += 1;
                Score.play()
                score.best = Math.max(score.value,score.best);
                localStorage.setItem("best", score.best);

                
            }
        }
    }
}

var score = {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    draw : function(){
        ctx.fillStyle = "#fff"
        ctx.strokeStyle = "#000"

        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px IMPACT"

            ctx.fillText(this.value, cvs.width/2, 50)
            ctx.strokeText(this.value, cvs.width/2, 50)

        }else if(state.current == state.over){
            ctx.font = "25px IMPACT";
            
            ctx.fillText(this.value, 225, 186)
            ctx.strokeText(this.value, 225, 186)

            ctx.fillText(this.best, 225, 228)
            ctx.strokeText(this.best, 225, 228)
        }
    }
}


function update(){
    bird.update()
    fg.update()
    pipes.update()
}

function draw(){
    ctx.fillStyle = "#70c5ce"
    ctx.fillRect(0,0,cvs.width,cvs.height)
    bg.draw()
    pipes.draw()
    fg.draw()
    bird.draw()
    gameOver.draw()
    getReady.draw()
    score.draw()
}

function animate(){
    update()
    draw()
    frames ++;
    requestAnimationFrame(animate)
}

animate()