// Main function. Usage: var pJS = new PolyJS(canvasElement);
// The in-code usage notes assume that the variable you store the main PolyJS object to is called pJS.
function PolyJS(canvas) {
  //store the Object object into a variable, for optimizing.
  var object = Object;
  // Canvas element
  this.canvas = canvas;
  // context2d for drawing
  this.drawingContext = canvas.getContext('2d');
  // for later referencing of the PolyJS object. This is REALLY hacky, and I'll appreciate it if someone tells me a better way.
  var _this = this;
  // list of polygons
  this.polygons = [];
  /* Polygon object. Usage: new pJS.Polygon(points[, edgeColor][, fillColor][, filled]);
   *   points: An array of points in the form [[x1, y1], [x2, y2], ... [x_n, y_n]]. Points can be attached to other points by changing one of the [x_n, y_n] pairs to {attached: [polygon object, index of point to attach to]}
   *   edgeColor: The color of the edges of the polygon. Defaults to "black" (#000000)
   *   fillColor: The color to fill the polygon with. Defaults to whatever the edgeColor is. If it is set to the boolean false, it will effectively be transparent.
   *   filled: If you want to have an unfilled polygon with a set fill color so you can make it filled later, you can set the argument filled to false. Defaults to true. If set to a number, this will be the edge thickness
   *   edgeThickness: The thickness of the edges. Defaults to 1.
   */
  object.defineProperty(this, "Polygon", {
    writable: false,
    value: function (points, edgeColor, fillColor, filled, edgeThickness) {
      if (points.length < 3)
        throw new Error("You cannot have a polygon with less than 3 points.");
      // this is the aforementioned hack.
      this.PolyObj = _this;
      // number of sides the polygon has.
      this.numSides = points.length;
      // I'm using a get/set combo for some stuff, so we have to have some hidden internal variables for storing them.
      var _points = points,
        _edgeColor = edgeColor,
        _fillColor = fillColor,
        _filled = filled,
        _thickness = edgeThickness;
      // For redrawing. If polygon has been "dirtied", it needs to be redrawn.
      this.dirty = true;
      // WARNING: ONLY CHANGE THE POINTS BY SETTING THE WHOLE ARRAY OR USING setPoint(index, value)! THINGS MAY NOT WORK AS INTENDED!
      object.defineProperty(this, "points", {
        configurable: false,
        enumerable: true,
        set: function (value) {
          _points = value;
          // if the number of points changed (or even if it didn't) adjust the recorded number of sides.
          this.numSides = points.length;
          // mark polygon as dirty
          this.dirty = true;
        },
        get: function () {
          return _points
        }
      });
      object.defineProperties(this, {
        // Use this to set the values of points. Usage: Polygon.prototype.setPoint(index, value)
        //   index: index of the point in the points array (set to 1+points.length to add a point to the list.)
        //   value: what the new value of the point should be.
        "setPoint": {
          configurable: false,
          enumerable: true,
          value: function (index, value) {
            if (index == _points.length + 1) {
              _points.push(value);
            } else {
              _points[index] = value;
            }
            this.numSides = _points.length;
            // mark polygon as dirty
            this.dirty = true;
          }
        },
        // if the point is designated as attached to another point on a different polygon, replace the data with that point's coords.
        // fixed = attached, but with offset
        // attachment syntax: {attached: [polygon, point]}
        // fixed syntax: {fixed: [polygon, point, [offset x, offset y]]}
        "parsePoint": {
          configurable: false,
          enumerable: true,
          writable: false,
          value: function (index) {
            var point = _points[index],
              offset = [0, 0],
              lastPolygon = this;
            while (point.attached || point.fixed) {
              if (point.attached) {
                var attached = point.attached;
                lastPolygon = attached[0]
                point = lastPolygon.points[attached[1]];
              } else {
                if (point.fixed) {
                  var fixed = point.fixed;
                  offset = [offset[0] + fixed[2][0], offset[1] + fixed[2][1]];
                  point = (fixed[0] == "self" ? lastPolygon : fixed[0]).points[fixed[1]]; //add offset
                  lastPolygon = fixed[0] == "self" ? lastPolygon : fixed[0];
                }
              }
            }
            return [point[0] + offset[0], point[1] + offset[1]]
          }
        },
        "edgeColor": {
          configurable: false,
          enumerable: true,
          set: function (newEdgeColor) {
            _edgeColor = newEdgeColor;
            // mark polygon as dirty
            this.dirty = true;
          },
          get: function () {
            return _edgeColor
          }
        },
        "fillColor": {
          configurable: false,
          enumerable: true,
          set: function (newFillColor) {
            _fillColor = newFillColor;
            // mark polygon as dirty
            this.dirty = true;
          },
          get: function () {
            return _fillColor
          }
        },
        "filled": {
          configurable: false,
          enumerable: true,
          set: function (newFilled) {
            _filled = newFilled;
            // mark polygon as dirty
            this.dirty = true;
          },
          get: function () {
            return _filled
          }
        },
        "edgeThickness": {
          configurable: false,
          enumerable: true,
          set: function (newThickness) {
            _thickness = newThickness;
            // mark polygon as dirty
            this.dirty = true;
          },
          get: function () {
            return _thickness
          }
        }
      });
      this.edgeColor = edgeColor || "black";
      this.edgeThickness = edgeThickness || 1;
      if (fillColor === false) {
        this.filled = false;
      } else {
        this.fillColor = fillColor || edgeColor;
        this.filled = filled !== false;
      }
      if (typeof filled == "number") {
        this.edgeThickness = filled;
      }
      this.PolyObj.polygons.push(this);
    },
    enumerable: true,
    configurable: false
  });
  // for drawing. Usage: pJS.draw([clear]);
  //   clear: set to true if you want to completely redraw everything, not just what changed. You should do this if you are moving points, but not if you are only changing colors. Defaults to false.
  object.defineProperty(this, "draw", {
    configurable: false,
    enumerable: true,
    value: function (clear) {
      var ctx = this.drawingContext,
        polygons = this.polygons;
      if (clear || polygons.filter(polygon => polygon.dirty).length == polygons.length) {
        //clear the canvas (code from https://stackoverflow.com/a/6722031)
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
      // if the polygon is dirty or clear is set to true, ...
      polygons.filter(polygon => clear || polygon.dirty).map(polygon => {
        // ...set the stroke style to the edge color...
        ctx.strokeStyle = polygon.edgeColor;
        // ...set the edge thickness...
        ctx.lineWidth = polygon.edgeThickness;
        // ...start drawing...
        ctx.beginPath();
        // ...generate array of edges...
        var points = polygon.points,
          edges = [];
        points.map(function (point, index) {
          var index2 = (index + 1) % points.length;
          edges.push([polygon.parsePoint(index), polygon.parsePoint(index2)]);
        });
        // ...with each of the edges...
        edges.map((edge, index) => {
          if (!index) ctx.moveTo(edge[0][0], edge[0][1]); // ...if the edge is the first to be drawn, move the starting point into position...
          ctx.lineTo(edge[1][0], edge[1][1]); // ...and draw a line from point to point...
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
