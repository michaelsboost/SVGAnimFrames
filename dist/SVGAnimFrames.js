/*
  Version: 0.0.1
  SVGAnimFrames, copyright (c) by Michael Schwartz
  Distributed under an MIT license: https://github.com/michaelsboost/SVGAnimFrames/blob/gh-pages/LICENSE
  
  This is SVGAnimFrames (https://michaelsboost.github.io/SVGAnimFrames/), SVG Frame By Frame Animation
*/

function SVGAnimFrames(elm, repeat, frametime, delay) {
  var counter = 0;
  
  // grab animation frames
  var detectFrame = parseInt(document.querySelectorAll(elm + " > g > g").length);
  var totalFrames = parseInt(document.querySelectorAll(elm + " > g > g").length);
  
  // restart timer
  function restartSVGAnim() {
    counter = 0;
    detectFrame = 0;
    clearInterval(intervalID);
    intervalID = setInterval(animateSVGFrames, frametime);
  }
  
  // SVG Frame by Frame animation
  function animateSVGFrames() {
    // frame counter
    detectFrame = counter++;

    // remove the vector-effect attribute
    for (i = 0; i < document.querySelectorAll(elm + " > g > g *").length; i++) {
      document.querySelectorAll(elm + " > g > g *")[i].removeAttribute("vector-effect");
    }
    
    // only show active frame
    for (i = 0; i < totalFrames; i++) {
      document.querySelectorAll(elm + " > g > g")[i].style.display = "none";
      document.querySelectorAll(elm + " > g > g")[detectFrame].style.display = "block";
    }
    
    // detect end of animation
    if (repeat === "no-repeat") {
      // if user states no-repeat
      if (counter === totalFrames) {
        // end of animation
        clearInterval(intervalID);
        counter = totalFrames;
        detectFrame = totalFrames;
        for (i = 0; i < totalFrames; i++) {
          document.querySelectorAll(elm + " > g > g")[i].style.display = "none";
          document.querySelectorAll(elm + " > g > g")[detectFrame].style.display = "block";
        }
      }
    } else {
      // if user states repeat or other
      if (counter === totalFrames) {
        // end of animation
        setTimeout(function() {
          restartSVGAnim();
        }, delay);
      } else if (detectFrame >= totalFrames) {
        // restart animation
        setTimeout(function() {
          restartSVGAnim();
        }, delay);
      }
    }
  }
  
  // initiate SVG Frame by Frame animation
  intervalID = setInterval(animateSVGFrames, frametime);
};