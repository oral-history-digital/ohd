export default function getNumObservationsResults(observations, searchTerm) {
    if (searchTerm === '') {
        return 0;
    }

    const regex = new RegExp(searchTerm, 'gi');
    const matches = observations.match(regex);

    if (matches === null) {
        return 0;
    }

    return matches.length;
}
