// load svg file
function loadfile(input) {
  var reader = new FileReader();
  var path = input.value;
  reader.onload = function(e) {
    if (path.toLowerCase().substring(path.length - 4 === ".svg")) {
      readsvg.value = e.target.result;
      scripttxt.classList.remove("hide");
      callAnimation();
    } else {
      alertify.error("Sorry that file type is not supported. Please only load .svg files.");
    }
  };
  reader.readAsText(input.files[0]);
};
function dropfile(file) {
  var reader = new FileReader();  
  reader.onload = function(e) {
    if (file.type === "image/svg+xml") {
      readsvg.value = e.target.result;
      scripttxt.classList.remove("hide");
      callAnimation();
    }
  }        
  reader.readAsText(file,"UTF-8"); 
};
openfile.onchange = function() {
  loadfile(this);
  
  dropflash.classList.remove("hide");
  readsvg.value = "";
  $("#dropflash").fadeOut();
};
read.ondragover   = function(e) {
  this.style.opacity = ".5";
  return false;
};
read.ondragend    = function() {
  read.style.opacity = "1";
  return false;
};
read.ondrop       = function(e) {
  e.preventDefault();
  read.style.opacity = "1";
  dropflash.classList.remove("hide");
  readsvg.value = "";
  $("#dropflash").fadeOut();
  var file = e.dataTransfer.files[0];
  dropfile(file);
};

// call SVG Frame by Frame animation
function callAnimation() {
  // locate SVG
  animate.innerHTML = readsvg.value;
  if (document.querySelector("#animate > svg")) {
    // remove width/height attributes if detected
    if (document.querySelector("#animate > svg").getAttribute("width") || document.querySelector("#animate > svg").getAttribute("height")) {
      document.querySelector("#animate > svg").removeAttribute("width");
      document.querySelector("#animate > svg").removeAttribute("height");
      alertify.message("Reminder use Viewbox for display! The width/height attributes are used only for the image sequence.");
      btns.classList.remove("hide");
    }

    // All SVG frames must be inside of a single group <g>
    if (document.querySelector("#animate > svg > g > g")) {
      read.classList.add("hide");
      SVGAnimFrames("#animate svg", "> g > g", repeatAnim.value, animRate.value, animDelay.value);
    } else {
      read.textContent = "svg container group (&lt;g&gt;) not found in dropped SVG..";
    }
  } else {
    read.innerHTML = "<i class='fa fa-upload'></i>";
  }
}
callAnimation();

// get frames
function getFrames() {
  // scrollTo top
  // window.scrollTo({ top: 0 });
  
  // reload svg
  imgframes.innerHTML = "";
  animate.innerHTML = readsvg.value;
  var width  = document.querySelector("#animate > svg").getAttribute("width");
  var height = document.querySelector("#animate > svg").getAttribute("height");
  if (width || height) {
    document.querySelector("#animate > svg").removeAttribute("width");
    document.querySelector("#animate > svg").removeAttribute("height");
  }
  // remove the vector-effect attribute
  for (var i = 0; i < document.querySelectorAll("#animate svg > g > g *").length; i++) {
    document.querySelectorAll("#animate svg > g > g *")[i].removeAttribute("vector-effect");
  }

  // add svg to base64
  function grabFrameImg() {
    var canvas = document.querySelector("#canvas");
    var ctx    = canvas.getContext("2d");
    canvas.width  = width.replace(/pt/g, "").replace(/px/g, "").replace(/%/g, "").replace(/em/g, "").replace(/in/g, "").replace(/cm/g, "").replace(/px/g, "");
    canvas.height = height.replace(/pt/g, "").replace(/px/g, "").replace(/%/g, "").replace(/em/g, "").replace(/in/g, "").replace(/cm/g, "").replace(/px/g, "");
    
    var img = new Image();
    var s = new XMLSerializer().serializeToString(document.querySelector("#animate > svg"))
    var encodedData = window.btoa(s);
    img.src = "data:image/svg+xml;base64," + encodedData;
    
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      var imgType    = canvas.toDataURL("image/png");
      img.src = imgType;
    };

    imgframes.appendChild(img);
  }

  var detectFrame = parseInt(document.querySelectorAll("#animate svg > g > g").length);
  var totalFrames = parseInt(document.querySelectorAll("#animate svg > g > g").length);

  // frame counter
  var counter = 0;
  var detectFrame = counter++;

  // only show active frame
  for (var i = 0; i < totalFrames; i++) {
    if (counter > totalFrames) {
      return false;
    }

    $("#animate svg > g > g").hide().eq(i).show();
    grabFrameImg();
  }

  grabframes.classList.add("hide");
  exportsequence.classList.remove("hide");
}
grabframes.onclick = function() {
  getFrames();
  if (window.intervalID != undefined && window.intervalID != 'undefined'){
    window.clearInterval(window.intervalID);
    console.log('Timer cleared with id' + window.intervalID);
  }
  grabit.classList.add("hide");
  scripttxt.classList.add("hide");

  showprocess.classList.remove("hide");
  var images = [];
  $("#imgframes img").each(function() {
    images.push($(this).attr("src"));
  });
  
  gifshot.createGIF({
    images: images,
    gifWidth: canvas.width,
    gifHeight: canvas.height,
//    gifWidth: 100,
//    gifHeight: 100,
    interval: animRate.value / 1000, // seconds
    progressCallback: function(captureProgress) { console.log('progress: ', captureProgress); },
    completeCallback: function() { console.log('completed!!!'); },
    numWorkers: 2,
  },function(obj) {
    if(!obj.error) {
      var image = obj.image;
      result.src = image;
      showit.classList.remove("hide");
      exportgif.classList.remove("hide");
      showprocess.classList.add("hide");
    }
  });
};

// export gif animation
exportgif.onclick = function() {
  this.href = result.src;
};

// download image sequence
exportsequence.onclick = function() {
  var totalImgs = parseInt(document.querySelectorAll("#imgframes img").length);
  
  var zip = new JSZip();

  for (var i = 0; i < totalImgs; i++) {
    zip.file("frame-"+[i]+".png", document.querySelectorAll("#imgframes img")[i].src.split('base64,')[1],{base64: true});
  }
  
  // Export application
  var content = zip.generate({type:"blob"});
  saveAs(content, "svg-image-sequence.zip");
};

// initiate animation when values change
animRate.style.width  = ((animRate.value.length + 1) * 30) + "px";
animDelay.style.width = ((animDelay.value.length + 1) * 30) + "px";
repeatAnim.onchange = function() {
  // clear animation interval
  clearInterval(intervalID);

  // call animation
  callAnimation();
}
animRate.onchange   = function() {
  // clear animation interval
  clearInterval(intervalID);

  // call animation
  callAnimation();
}
animRate.onkeydown  = function(e) {
  this.style.width  = ((this.value.length + 1) * 22) + "px";

  if (e.shiftKey && e.which === 38) {
    this.value = parseInt(parseInt(this.value) + 10);
    e.preventDefault();
  }
  if (e.shiftKey && e.which === 40) {
    this.value = parseInt(parseInt(this.value) - 10);
    e.preventDefault();
  }

  // clear animation interval
  clearInterval(intervalID);

  // call animation
  callAnimation();
}
animDelay.onchange  = function() {
  // clear animation interval
  clearInterval(intervalID);

  // call animation
  callAnimation();
}
animDelay.onkeydown = function(e) {
  this.style.width  = ((this.value.length + 1) * 22) + "px";

  if (e.shiftKey && e.which === 38) {
    this.value = parseInt(parseInt(this.value) + 10);
    e.preventDefault();
  }
  if (e.shiftKey && e.which === 40) {
    this.value = parseInt(parseInt(this.value) - 10);
    e.preventDefault();
  }

  // clear animation interval
  clearInterval(intervalID);

  // call animation
  callAnimation();
}