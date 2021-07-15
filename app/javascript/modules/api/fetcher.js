export default function fetcher(url) {
    return fetch(url, { headers: { 'Accept': 'application/json' } })
        .then(res => res.json());
}
