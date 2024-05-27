import { LatLng } from "react-native-maps";
import concaveman from 'concaveman';

type Point = [number, number];

function convexHull(points: Point[]): Point[] {
    if (points.length < 3) {
        throw new Error("Convex hull not possible with fewer than 3 points. Received " + points.length + " points");
    }

    // Helper function to find the orientation of the triplet (p, q, r)
    // 0 -> p, q and r are collinear
    // 1 -> Clockwise
    // 2 -> Counterclockwise
    function orientation(p: Point, q: Point, r: Point): number {
        const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
        if (val === 0) return 0;
        return (val > 0) ? 1 : 2;
    }

    // Find the bottom-most point (and left-most if there are ties)
    let minY = points[0][1];
    let minIdx = 0;
    for (let i = 1; i < points.length; i++) {
        const y = points[i][1];
        if (y < minY || (y === minY && points[i][0] < points[minIdx][0])) {
            minY = y;
            minIdx = i;
        }
    }

    // Place the bottom-most point at first position
    const temp = points[0];
    points[0] = points[minIdx];
    points[minIdx] = temp;

    // Sort the remaining points based on the polar angle with the first point
    const p0 = points[0];
    points.sort((a, b) => {
        const o = orientation(p0, a, b);
        if (o === 0) {
            return (Math.sqrt((p0[0] - a[0]) ** 2 + (p0[1] - a[1]) ** 2) -
                    Math.sqrt((p0[0] - b[0]) ** 2 + (p0[1] - b[1]) ** 2));
        }
        return (o === 2) ? -1 : 1;
    });

    // Remove collinear points at the end
    let m = 1;
    for (let i = 1; i < points.length; i++) {
        while (i < points.length - 1 && orientation(p0, points[i], points[i + 1]) === 0) {
            i++;
        }
        points[m] = points[i];
        m++;
    }
    if (m < 3) {
        throw new Error("Convex hull not possible with fewer than 3 unique points");
    }

    // Create an empty stack and push first three points
    const hull: Point[] = [];
    hull.push(points[0]);
    hull.push(points[1]);
    hull.push(points[2]);

    // Process the remaining points
    for (let i = 3; i < m; i++) {
        while (hull.length >= 2 && orientation(hull[hull.length - 2], hull[hull.length - 1], points[i]) !== 2) {
            hull.pop();
        }
        hull.push(points[i]);
    }

    return hull;
}

// Function to compute the concave hull
function concaveHull(points: Point[], concavity: number = 1.5): Point[] {
    // Convert points to an array of coordinates
    const coords: number[][] = points.map(point => [point[0], point[1]]);

    // Compute the concave hull
    const concaveHullCoords: number[][] = concaveman(coords, concavity);

    // Convert the coordinates back to an array of points
    return concaveHullCoords.map(coord => [coord[0], coord[1]]);
}

function isInsideHull(point: Point, polygon: Point[]): boolean {
    // Check if the point is inside the polygon
    let isInside = false;
    let x = point[0];
    let y = point[1];
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0], yi = polygon[i][1];
        let xj = polygon[j][0], yj = polygon[j][1];

        let intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }   
    return isInside;
};

// LatLng[] を [number, number][] に変換する
const toCoordinatesFromLatLngs = (coordinates: LatLng[]): Point[] => {
  return coordinates.map((coordinate) => [
    coordinate.longitude,
    coordinate.latitude,
  ]);
};

// [number, number][] を LatLng[] に変換する
const toLatLngsFromCoordinates = (coordinates: Point[]): LatLng[] => {
  return coordinates.map((coordinate) => ({
    latitude: coordinate[1],
    longitude: coordinate[0],
  }));
};

// LatLng[] を受け取り、[number, number][]に変換し、convexhullを実行し、結果を LatLng[] に変換して返す
export const toConvexHullLatLngs = (polygonCoordinates: LatLng[]): LatLng[] => {
  const coordinates = toCoordinatesFromLatLngs(polygonCoordinates);
  const figures = concaveHull(coordinates);
  return toLatLngsFromCoordinates(figures);
};

export const isInsidePolygon = (coordinate:LatLng, coordinates:LatLng[]):boolean => {
    const point : Point = [coordinate.longitude, coordinate.latitude];
    return isInsideHull( point, toCoordinatesFromLatLngs(coordinates));
}