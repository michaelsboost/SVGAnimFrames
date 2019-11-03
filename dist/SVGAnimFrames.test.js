/*
  Version: 0.0.1
  SVGAnimFrames, copyright (c) by Michael Schwartz
  Distributed under an MIT license: https://github.com/michaelsboost/SVGAnimFrames/blob/gh-pages/LICENSE
  
  This is SVGAnimFrames (https://michaelsboost.github.io/SVGAnimFrames/), SVG Frame By Frame Animation
*/

// This test demo is for the animate element within the svg tag (to hopefully resolve the problem so multiple svgs can be animated)

function SVGAnimFrames(elm, repeat, frametime, delay) {
  var counter = 0;
  
  // grab animation frames
  var detectFrame = parseInt(document.querySelectorAll(elm + " > g > g").length);
  var totalFrames = parseInt(document.querySelectorAll(elm + " > g > g").length);
  
  // SVG Frame by Frame animation
  function animateSVGFrames() {
    // frame counter
    detectFrame = counter++;

    // remove the vector-effect attribute
    for (i = 0; i < document.querySelectorAll(elm + " > g > g *").length; i++) {
      document.querySelectorAll(elm + " > g > g *")[i].removeAttribute("vector-effect");
    }
    
    for (i = 0; i < document.querySelectorAll(elm + " > g > g").length; i++) {
      var newElm = document.createElementNS("http://www.w3.org/2000/svg", "animate");
      newElm.setAttribute("attributeName", "display");
      newElm.setAttribute("values", "inline;none;none;none");
      newElm.setAttribute("keyTimes", "0;0.33;0.66;1");
      newElm.setAttribute("dur", frametime + "ms");
      newElm.setAttribute("begin", delay + "ms");
      if (repeat === "no-repeat") {
        newElm.setAttribute("repeatCount", "0");
      } else {
        newElm.setAttribute("repeatCount", "indefinite");
      }
      
      document.querySelectorAll(elm + " > g > g")[i].appendChild(newElm);
    }
  }
  animateSVGFrames();
};