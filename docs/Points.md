# Using Points

## Usage

In PolyJS, polygons are defined using an array of points. Points are explicitly defined with two coordinates, attached to a point on another polygon, or fixed to a point on another polygon with an offset.

### Explicitly defining a Point

A point is explicitly defined using an x coordinate and a y coordinate. These are measured from the top left-hand corner of the screen, starting at (0,0). The x and y coordinate pair should be placed in an array (`[x, y]`).

### Attaching vs. Fixing (todo)


### Attaching Points

Besides providing an explicit definition for a point, you can mark one point as being attached to another. The syntax for this is `{attached: [polygon_object, index]}`, where `polygon_object` is the Polygon object containing the point in question, and `index` is the index of the point in that Polygon's point array. 

Example:

![First image](https://i.imgur.com/Th7oeIhs.png) ![Second image](https://i.imgur.com/pzogGHx.png)

Let's say that you had a PolyJS object, `pJS`. You had created a right triangle with point array `[[0, 0], [100, 0], [0, 100]]` (black triangle, first image). You wanted to attach another congruent right triangle (red triangle, first image) to the long side of the right triangle so that you could move a point and the triangles would still stay touching (second image).

You could do this by attaching the points on the long side of your new triangle to the points on the long side of your old triangle. The points array for your new triangle would be `[[100, 100], {attached: [pJS.polygons[0], 1]}, {attached: [pJS.polygons[0], 2]}]`.

### Fixing Points (todo)

### Changing Points (todo)