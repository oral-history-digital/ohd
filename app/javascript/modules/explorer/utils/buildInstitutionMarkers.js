/**
 * Transforms an array of institutions into map marker objects.
 * Only institutions with valid latitude/longitude are included.
 *
 * @param {Array} institutions
 * @returns {Array} Array of marker objects with id, name, lat, lng, interviews
 */
export const buildInstitutionMarkers = (institutions) =>
    institutions
        .filter((i) => i.latitude && i.longitude)
        .map((i) => ({
            id: i.id,
            name: i.name,
            lat: i.latitude,
            lng: i.longitude,
            interviews: i.interviews?.total || 0,
        }));
