export function validateTapeNumber(v) {
    const number = /^\d{1,2}$/;
    return number.test(v);
}

export function validateColor(v) {
    const color = /^#[0-9,a-f,A-F]{6}$/;
    return color.test(v);
}

export function validateGeoCoordinate(v) {
    const geoCoordinate = /^(-?\d{1,3}(\.\d{0,20})?)?$/;
    return geoCoordinate.test(v);
}

export function validateDate(v) {
    const date = /^\d{4}-\d{2}-\d{2}$/;
    return date.test(v);
}

export function validateTimecode(v) {
    // Timecode format: HH:MM:SS or HH:MM:SS.mmm
    const timecode = /^\d{2}:\d{2}:\d{2}(\.\d{1,3})?$/;
    return timecode.test(v);
}

export function validateTimecodeInRange(value, minTimecode, maxTimecode) {
    if (!validateTimecode(value)) {
        return false;
    }

    const timeToSeconds = (tc) => {
        const parts = tc.split(':');
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const secondsParts = parts[2].split('.');
        const seconds = parseInt(secondsParts[0], 10);
        const milliseconds = secondsParts[1]
            ? parseInt(secondsParts[1].padEnd(3, '0'), 10)
            : 0;
        return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    };

    const valueSeconds = timeToSeconds(value);

    if (minTimecode) {
        const minSeconds = timeToSeconds(minTimecode);
        if (valueSeconds <= minSeconds) {
            return false;
        }
    }

    if (maxTimecode) {
        const maxSeconds = timeToSeconds(maxTimecode);
        if (valueSeconds >= maxSeconds) {
            return false;
        }
    }

    return true;
}
