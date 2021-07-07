export default function typeOfWithNull(value) {
    if (value === null) {
        return 'null';
    }

    return typeof value;
}
