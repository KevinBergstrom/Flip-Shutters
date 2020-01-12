var flipped = 0;
var boxes = 1;

var allFlipped = false;
var lastFlipped = null;

var newColor = "rgb(0,0,0)";

function generateFlipboxes(rows, cols){
    /* get from flipboxes id */
    let parentBox = $("#flipboxes");

    boxes = rows*cols;

    /* add the flip containers */
    for(i = 0;i<rows*cols;i++){
        
        /* create the container */
        let style = 'style="width:'+ String(100/rows) +'%;height:'+ String(100/cols) +'%;"';
        let div = '<div class="flipCont" '+ style +'><div>';

        /* add the container to the flipboxes container*/
        parentBox.append(div);
    }

    /* load the flip html into them*/
    parentBox.children().load("flipbox.html");

    /* add transitioned events  */
    parentBox.children().on('transitionend', onTransitioned);

    /* add mouseover events  */
    parentBox.children().on("mouseover", onMouseover);
    
    /* TODO test with mobile */
    /* touch move may be laggy, put a cooldown on it? debouce? */
    parentBox.children().on("touchmove", onMouseover);
}

function onAllFlipped(){
    flipped = 0;
    newColor = randomBackgroundColor();
    allFlipped = !allFlipped;
}

function flipBox(box){
    /* flip the box */
    box.classList.toggle("flip");
    lastFlipped = box;
}

function onMouseover(event){
    let target = event.currentTarget

    /* dont flip the same object twice in a row*/
    if(target==lastFlipped){
        return;
    }

    /* make sure css transition is loaded */
    if($(target).find(".flipper").css('transition') == undefined){
        return;
    }

    /* attempt to flip it */
    if(target.classList.contains("flip")==allFlipped){
        flipBox(target);
    }
}

function onTransitioned(event){
    let target = event.currentTarget;
    let side = null;
    
    /* ignore non-transform events*/
    if(event.originalEvent.propertyName!="transform"){
        return;
    }

    /* finding the nonfacing side */
    if(target.classList.contains("flip")){
        side = target.querySelector(".flipper").querySelector(".frontFlip");
    }else{     
        side = target.querySelector(".flipper").querySelector(".backFlip");
    }
        
    /* update the non facing side*/
    side.style.backgroundColor = newColor;

    /* mark it as flipped */
    flipped += 1;
    
    /* see if all boxes are flipped */
    if(flipped >= boxes){
        onAllFlipped();
    }
}

$(document).ready(function() {
    newColor = randomBackgroundColor();
    generateFlipboxes(3,3);
  });

function randomBackgroundColor(){
    /* generate the rgb values */
    let r = Math.floor(Math.random()*255);
    let g = Math.floor(Math.random()*255);
    let b = Math.floor(Math.random()*255);

    /* return an rgb string */
    return "rgb("+ String(r)+","+ String(g) +","+ String(b) +")";
}