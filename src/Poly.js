// Main function. Usage: var pJS = new PolyJS(canvasElement);
// The in-code usage notes assume that the variable you store the main PolyJS object to is called pJS.
function PolyJS(canvas) {
  // Canvas element
  this.canvas = canvas;
  // context2d for drawing
  this.drawingContext = canvas.getContext('2d');
  // for later referencing of the PolyJS object. This is REALLY hacky, and I'll appreciate it if someone tells me a better way.
  var _this = this;
  // list of polygons
  this.polygons = [];
  /* Polygon object. Usage: new pJS.Polygon(points[, edgeColor][, fillColor][, filled]);
   *   points: An array of points in the form [[x1, y1], [x2, y2], ... [x_n, y_n]]
   *   edgeColor: The color of the edges of the polygon. Defaults to "black" (#000000) 
   *   fillColor: The color to fill the polygon with. Defaults to whatever the edgeColor is. If it is set to the boolean false, it will effectively be transparent.
   *   filled: If you want to have an unfilled polygon with a set fill color so you can make it filled later, you can set the argument filled to false. Defaults to false. 
   */
  Object.defineProperty(this, "Polygon", {
    writable: false,
    value: function(points, edgeColor, fillColor, filled) {
      // this is the aforementioned hack.
      this.PolyObj = _this;
      // number of sides the polygon has.
      this.numSides = points.length;
      // I'm using a get/set combo for some stuff, so we have to have some hidden internal variables for storing them.
      var _internalPoints = points,
        _internalEdgeColor = edgeColor,
        _internalFillColor = fillColor;
      // For redrawing
      this.dirty = true;
      Object.defineProperty(this, "points", {
        configurable: false,
        enumerable: true,
        set: function(value) {
          var edges = [];
          _internalPoints = value;
          // redefine the edges if the points change
          _internalPoints.forEach(function(point, index) {
            edges.push([point, value[(index + 1) % _internalPoints.length]]);
          });
          this.edges = edges;
          // mark polygon as dirty
          this.dirty = true;
        },
        get: function() {
          return _internalPoints
        }
      });
      Object.defineProperty(this, "edgeColor", {
        configurable: false,
        enumerable: true,
        set: function(newEdgeColor) {
          _internalEdgeColor = newEdgeColor;
          // mark polygon as dirty
          this.dirty = true;
        },
        get: function() {
          return _internalEdgeColor
        }
      });
      Object.defineProperty(this, "fillColor", {
        configurable: false,
        enumerable: true,
        set: function(newFillColor) {
          _internalFillColor = newFillColor;
          // mark polygon as dirty
          this.dirty = true;
        },
        get: function() {
          return _internalFillColor
        }
      });
      // define edges
      var edges = [];
      _internalPoints.forEach(function(point, index) {
        edges.push([point, _internalPoints[(index + 1) % _internalPoints.length]]);
      });
      this.edges = edges;
      this.edgeColor = edgeColor || "black";
      if (fillColor === false) {
        this.filled = false;
      } else {
        this.fillColor = fillColor || edgeColor;
        this.filled = filled;
      }
      this.PolyObj.polygons.push(this);
    },
    enumerable: true,
    configurable: false
  });
  // for drawing. Usage: pJS.draw();
  Object.defineProperty(this, "draw", {
    configurable: false,
    enumerable: true,
    value: function() {
      // if the polygon is dirty,...
      this.polygons.filter(polygon => polygon.dirty).map(polygon => {
        var ctx = this.drawingContext;
        // ...set the stroke style to the edge color...
        ctx.strokeStyle = polygon.edgeColor;
        // ...start drawing...
        ctx.beginPath();
        // ...with each of the edges,...
        polygon.edges.map((edge, index) => {
          if (index === 0) ctx.moveTo(edge[0][0], edge[0][1]); // ...if the edge is the first to be drawn, move the starting point into position...
          ctx.lineTo(edge[1][0], edge[1][1]); // ...draw a line from point to point...
        });
        ctx.stroke(); // ...draw the edges...
        if (polygon.filled) { // if the polygon should be filled
          ctx.fillStyle = polygon.fillColor; // set the fill color
          ctx.fill(); // fill the polygon
        }
        polygon.dirty = false; // undirty the polygon.
      });
    }
  });
}