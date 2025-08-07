export default function convertToMultipartFormdataParams(params) {
    if (typeof params !== 'object') {
        throw new TypeError('params must be an object');
    }

    const keys = Object.keys(params);

    const result = keys.map((key) => {
        return [key, params[key]];
    });
    return result;

}
