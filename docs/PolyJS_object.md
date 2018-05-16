# The PolyJS Object

The PolyJS object is the main object. It has everything you need.

## Usage
```javascript
var pJS = new PolyJS(<canvas element>);
```

This creates a new PolyJS object that is bound to the canvas in `<canvas element>`. The `<canvas element>` should be a DOM Object, like the one returned by `document.getElementById` or `document.querySelector`.

## Children

### Variables

- `polygons`: Holds a list of all of the polygons created.
- `canvas`: The canvas element passed into the constructor.
- `drawingContext`: By default, the CanvasRenderingContext2D (from `canvas.getContext('2d')`) of the canvas. This is used for drawing.

### Functions

- `draw([clearCanvas])`: Draws the screen. It clears the screen and redraws everything if `clearCanvas` is set to true. If it is false or omitted, it will only redraw polygons that changed.

### Objects

- `Polygon`: The default constructor for creating polygons. Read more in `Polygons.md`
