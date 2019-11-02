/*
  Version: 0.0.1
  SVGAnimFrames, copyright (c) by Michael Schwartz
  Distributed under an MIT license: https://github.com/michaelsboost/SVGAnimFrames/blob/gh-pages/LICENSE
  
  This is SVGAnimFrames (https://michaelsboost.github.io/SVGAnimFrames/), SVG Frame By Frame Animation
*/

function SVGAnimFrames(elm, repeat, frametime, delay) {
  var counter = 0;
  
  // grab animation frames
  var detectFrame = parseInt($(elm + " > g > g").length);
  var totalFrames = parseInt($(elm + " > g > g").length);
  
  // kill animation
  function killAnim() {
    counter = 0;
    detectFrame = 0;
    clearInterval(intervalID);
  }
  
  // restart timer
  function restartSVGAnim() {
    killAnim();
    intervalID = setInterval(animateSVGFrames, frametime);
  }
  
  // SVG Frame by Frame animation
  function animateSVGFrames() {
    // frame counter
    detectFrame = counter++;

    // remove the vector-effect attribute
    // $(elm + " > g > g *").attr("vector-effect", "");
    $(elm + " > g > g *").removeAttr("vector-effect");

    // only show active frame
    if (counter > totalFrames) {
      return false;
    }
    $(elm + " > g > g").hide().eq(detectFrame).show();
    
    // detect end of animation
    if (repeat === "no-repeat") {
      // if user states no-repeat
      if (counter === totalFrames) {
        // end of animation
        if (counter > totalFrames) {
          clearInterval(intervalID);
          counter = 0;
          detectFrame = totalFrames;
          return false;
        }
        $(elm + " > g > g").hide().eq(detectFrame).show();
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