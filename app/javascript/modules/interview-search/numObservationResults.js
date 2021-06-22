import { typeOfWithNull } from 'modules/user-agent';

export default function numObservationResults(observations, searchTerm) {
    // Preconditions
    if (typeof observations !== 'string') {
        throw new TypeError(`observations argument must be string, but is ${typeOfWithNull(observations)}`);
    }

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
