import interviewUrl from './interviewUrl';

describe('interviewUrl', () => {
    test('outputs url for an interview', () => {
        const pathBase = '/la/de';
        const interviewId = 'za283';

        const actual = interviewUrl(
            pathBase,
            interviewId,
            'https://www.example.com'
        );
        const expected = 'https://www.example.com/la/de/interviews/za283';

        expect(actual).toEqual(expected);
    });
});
