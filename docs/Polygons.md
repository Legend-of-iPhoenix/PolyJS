# Name of feature

## Usage

```javascript
new pJS.Polygon(points[, edgeColor][, fillColor][, filled]);
```

- `points`: An array of points in the form `[[x1, y1], [x2, y2], ... [x_n, y_n]]`. Read more about attaching and fixing points in `Points.md`.
- `edgeColor`: The color of the edges of the polygon. Defaults to "black" (`#000000`)
- `fillColor`: The color to fill the polygon with. Defaults to whatever the `edgeColor` is. If it is set to `false`, it will effectively be transparent.
- `filled`: If you want to have an unfilled polygon with a set `fillColor` so you can make it filled later, you can set the argument filled to false. Defaults to true. 

## Children

### Variables

- `points`: The list of points that defines the polygon. It is recommended to use the `setPoint` function to change points.
- `edgeColor`: The edge color of the polygon.
- `fillColor`: The fill color of the polygon.
- `filled`: If the polygon should be filled or not.
- `dirty`: Boolean. If it is true, this polygon is guaranteed to be redrawn on the next `pJS.draw()` call. It is automatically set to true if you change a Polygon's data and automatically set to false if it has been drawn.

### Functions

- `setPoint(index, value)`: Changes or adds a point. See `Points.md` for more info.

## Warnings

- **ONLY CHANGE THE** `points` **ARRAY BY SETTING THE WHOLE ARRAY OR USING** `setPoint(index, value)` **!**