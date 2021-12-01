import humanReadable from "./humanReadable";

test('project initials should not be translated', () => {
    const project = {
        initials: 'bg',
    };
    const attribute = 'initials';
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
