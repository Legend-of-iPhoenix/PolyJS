# Using Points

## Usage

In PolyJS, polygons are defined using an array of points. Points are explicitly defined with two coordinates, attached to a point on another polygon, or fixed to a point on another polygon with an offset.

### Explicitly defining a Point

A point is explicitly defined using an x coordinate and a y coordinate. These are measured from the top left-hand corner of the screen, starting at (0,0). The x and y coordinate pair should be placed in an array (`[x, y]`).

### Attaching Points

Besides providing an explicit definition for a point, you can mark one point as being attached to another. The syntax for this is `{attached: [polygon_object, index]}`, where `polygon_object` is the Polygon object containing the point in question, and `index` is the index of the point in that Polygon's point array. 

Example:

![First image](https://i.imgur.com/Th7oeIhs.png) ![Second image](https://i.imgur.com/pzogGHx.png)

Let's say that you had a PolyJS object, `pJS`. You had created a right triangle with point array `[[0, 0], [100, 0], [0, 100]]` (black triangle, first image). You wanted to attach another congruent right triangle (red triangle, first image) to the long side of the right triangle so that you could move a point and the triangles would still stay touching (second image).

You could do this by attaching the points on the long side of your new triangle to the points on the long side of your old triangle. The points array for your new triangle would be `[[100, 100], {attached: [pJS.polygons[0], 1]}, {attached: [pJS.polygons[0], 2]}]`.

### Fixing Points 

Fixing points is just like attaching them, except you can provide an offset: `{fixed: [polygon_object, index, [x_offset, y_offset]]}`. (`polygon_object` is the Polygon object containing the point in question, `index` is the index of the point in that Polygon's point array, and `x_offset`/`y_offset` are the x and y offsets of your new point fron the point that you are fixing to.)

### Changing Points (with `setPoint`)

You should **NEVER EVER EVER EVER** change a single point by modifying the points array directly. There is a function for setting points: `polygon_object.setPoint(index, value)` (`polygon_object` holds the polygon object that has a point in need of changing, `index` is the index of the point, and `value` is the new value of the point. This can be an explicit set of points or a fixed/attached declaration.)
