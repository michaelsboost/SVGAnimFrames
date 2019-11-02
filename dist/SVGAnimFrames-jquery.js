function SVGAnimFrames(elm, repeat, frametime, delay) {
  var counter = 0;
  
  // grab animation frames
  var detectFrame = parseInt($(elm + " > g > g").length);
  var totalFrames = parseInt($(elm + " > g > g").length);
  
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
    // $(elm + " > g > g *").attr("vector-effect", "");
    $(elm + " > g > g *").removeAttr("vector-effect");

    // only show active frame
    $(elm + " > g > g").hide().eq(detectFrame).show();
    
    // detect end of animation
    if (repeat === "no-repeat") {
      // if user states no-repeat
      if (counter === totalFrames) {
        // end of animation
        clearInterval(intervalID);
        counter = totalFrames;
        detectFrame = totalFrames;
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

// call SVG Frame by Frame animation
// SVGAnimFrames("#animate svg", "repeat");
// SVGAnimFrames("#animate svg", "no-repeat");