export function parseResponseJson(res, url) {
    if (res?.body && typeof res.body === 'object') {
        return res.body;
    }

    if (typeof res?.text === 'string' && res.text.length > 0) {
        try {
            return JSON.parse(res.text);
        } catch (parseError) {
            console.error(
                `Loading JSON from ${url} failed to parse response body as JSON`
            );
            return {};
        }
    }

    return {};
}

export default parseResponseJson;
