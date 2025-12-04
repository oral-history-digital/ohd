export default function parametrizedQuery(query) {
    return Object.keys(query)
        .sort()
        .map((key, index) => {
            return `${key}=${query[key]}`;
        })
        .join('&');
}
