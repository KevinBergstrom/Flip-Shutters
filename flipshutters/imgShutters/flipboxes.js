var flipped = 0;
var boxes = 1;

var allFlipped = false;
var lastFlipped = null;

var images = ['bgs/screen1.png',
'bgs/screen2.png',
'bgs/screen3.png',
'bgs/screen4.png',
];

var imageIndex = 2;

$(document).ready(function() {

    /* early stop if there isn't enough pictures*/
    if(images.length<2){
        console.log("ERROR: Not enough images in images folder");
        return
    }

    generateFlipboxes(10,1);

});

function generateFlipboxes(cols, rows){
    /* get from flipboxes id */
    let parentBox = $("#flipboxes");

    boxes = rows*cols;

    /* add the flip containers */
    for(y = 0;y<rows;y++){
        
        for(x = 0;x<cols;x++){

        
            /* create the inner container */

            let bgSize = 'background-size:' + String(cols*100) +'% ' + String(rows*100) +'%;'

            let xPos = 0;
            if(cols-1 > 0){
                xPos = x*100/(cols-1);
            }

            let yPos = 0;
            if(rows-1 > 0){
                yPos = y*100/(rows-1);
            }

            let bgPos = 'background-position:' + String(xPos) +'% ' + String(yPos) +'%;'
            
            let frontImage = 'background-image: url(' + images[0] + ');'
            let backImage = 'background-image: url(' + images[1] + ');'

            let front = '<div class="frontFlip" style="' + bgSize + bgPos + frontImage + '"></div>';
            let back = '<div class="backFlip" style="' + bgSize + bgPos + backImage + '"></div>';

            let inner = '<div class="flipper">' + front + back + '</div>';

            /* create the container */
            let style = 'style="width:'+ String(100/cols) +'%;height:'+ String(100/rows) +'%;"';
            let div = '<div class="flipCont" '+ style +'>' + inner + '<div>';

            /* add the container to the flipboxes container*/
            parentBox.append(div);
        }
    }

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

    imageIndex += 1;
    if(imageIndex >= images.length){
        imageIndex = 0;
    }

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
    if(target==lastFlipped && boxes > 1){
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
    $(side).css('background-image','url(' + images[imageIndex] + ')');

    /* mark it as flipped */
    flipped += 1;
    
    /* see if all boxes are flipped */
    if(flipped >= boxes){
        onAllFlipped();
    }
}
