SVGAnimFrames
===================

I created SVGAnimFrames because I wanted to be able to make frame by frame animations within Gravit Designer using 1 line of code.

![](https://raw.githubusercontent.com/michaelsboost/SVGAnimFrames/gh-pages/header.gif)

License
-------------

MIT

Version
-------------

0.0.2

How To Use:
-------------

  1. First you need to design your animation using a vector editor. I recommend [Gravit Designer](https://www.designer.io/)!  <br><br>
  2. Make sure **ALL** the frames that will be animated are inside a svg group element. ex. `<g clip-path="url(#_clipPath_hello)">`.  <br>See [index.html](https://github.com/michaelsboost/SVGAnimFrames/blob/gh-pages/index.html) as an example.  <br><br>
  3. Export your SVG and then grab it's code (If you don't know how you can load the SVG in your browser you can use [WeaveShare](https://michaelsboost.github.io/WeaveShare) to grab it's code as it **needs** to be embedded in order for SVGAnimFrames to grab it's frames).  <br><br>
  4. Add SVGAnimFrames script! <br>ex. `<script src="SVGAnimFrames.js"></script>` <br>before your closing body tag.  <br><br>
  5. Now in a new script before your closing body tag. <br>You can run SVGAnimFrames with 1 line of code. <br>`SVGAnimFrames("#animate svg", "repeat", "40", "1000");`. <br><br>If you do not want your animation to repeat replace repeat with no-repeat   <br><br>40 tells SVGAnimFrames how many milliseconds to change to the next frame.   <br><br>100 tells SVGAnimFrames how many milliseconds the animation waits to start the animation over.

Development
-------------

Want to contribute? Great!  

*<u>As of November 6, 2019 SVGAnimFrames is no longer an active project.  
All updates as of that date and on are solely contributor based implementations.</u>*

You can submit a pull request or simply share the project :)

Of course SVGAnimFrames is free and open source, so you can always fork the project and have fun :)

[![ko-fi](https://az743702.vo.msecnd.net/cdn/kofi2.png?v=0)](https://ko-fi.com/michaelsboost)

If SVGAnimFrames was at all helpful for you. You can show your appreciation by [Donating via SquareCash](https://cash.me/$michaelsboost) and/or [PayPal](https://www.paypal.me/mikethedj4)

**PS:** [Learn how you can do this with GSAP!!](https://codepen.io/akapowl/pen/a3134b964c569b9fffead620eb78cec7)
