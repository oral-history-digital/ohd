import { parseResponseJson } from './parseResponseJson';

describe('parseResponseJson', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('returns res.body when it is an object', () => {
        const result = parseResponseJson(
            { body: { success: true, id: 1 }, text: '{"ignored":true}' },
            '/api/users'
        );

        expect(result).toEqual({ success: true, id: 1 });
    });

    it('parses and returns res.text JSON when body is missing', () => {
        const result = parseResponseJson(
            { text: '{"success":true,"id":2}' },
            '/api/users'
        );

        expect(result).toEqual({ success: true, id: 2 });
    });

    it('returns empty object and logs when res.text is invalid JSON', () => {
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const result = parseResponseJson({ text: '{not-json}' }, '/api/users');

        expect(result).toEqual({});
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Loading JSON from /api/users failed to parse response body as JSON'
        );
    });

    it('returns empty object for empty text', () => {
        const result = parseResponseJson({ text: '' }, '/api/users');

        expect(result).toEqual({});
    });

    it('returns empty object for nullish response', () => {
        expect(parseResponseJson(null, '/api/users')).toEqual({});
        expect(parseResponseJson(undefined, '/api/users')).toEqual({});
    });
});
