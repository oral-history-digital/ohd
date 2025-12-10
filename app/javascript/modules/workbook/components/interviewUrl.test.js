import interviewUrl from './interviewUrl';

describe('interviewUrl', () => {
    const { location } = window;

    beforeAll(() => {
        delete window.location;
        window.location = {
            protocol: 'https:',
            host: 'www.example.com',
        };
    });

    afterAll(() => {
        window.location = location;
    });

    test('outputs url for an interview', () => {
        const pathBase = '/la/de';
        const interviewId = 'za283';

        const actual = interviewUrl(pathBase, interviewId);
        const expected = 'https://www.example.com/la/de/interviews/za283';

        expect(actual).toEqual(expected);
    });
});
