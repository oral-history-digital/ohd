import humanReadable from "./humanReadable";

test('project shortname should not be translated', () => {
    const project = {
        shortname: 'bg',
    };
    const attribute = 'shortname';
    const locale = 'de';
    const translations = {
        de: {
            bg: 'bulgarisch',
        },
    };

    const actual = humanReadable({obj: project, attribute, locale});
    const expected = 'bg';
    expect(actual).toEqual(expected);
});
