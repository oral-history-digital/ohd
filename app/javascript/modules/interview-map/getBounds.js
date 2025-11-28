export default function getBounds(locations) {
    if (!Array.isArray(locations)) {
        throw new TypeError('locations must be Array');
    }

    if (locations.length === 0) {
        return null;
    }

    const locs = locations.map((location) => [
        Number.parseFloat(location.lat),
        Number.parseFloat(location.lon),
    ]);

    const northWestCorner = locs.reduce((acc, location) => {
        return [Math.max(acc[0], location[0]), Math.min(acc[1], location[1])];
    }, locs[0]);
    const southEastCorner = locs.reduce((acc, location) => {
        return [Math.min(acc[0], location[0]), Math.max(acc[1], location[1])];
    }, locs[0]);

    return [northWestCorner, southEastCorner];
}
