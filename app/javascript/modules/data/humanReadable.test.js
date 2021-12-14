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
    const state = { collapsed: true };

    const actual = humanReadable(project, attribute, { translations, locale },
        state);
    const expected = 'bg';
    expect(actual).toEqual(expected);
});
