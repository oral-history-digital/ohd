import humanReadable from './humanReadable';

test('project shortname should not be translated even when translations are available', () => {
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

    const actual = humanReadable({
        obj: project,
        attribute,
        locale,
        translations,
    });
    const expected = 'bg'; // Should return raw value, not 'bulgarisch'
    expect(actual).toEqual(expected);
});

test('other attributes should be translated when translations are available', () => {
    const project = {
        status: 'active',
    };
    const attribute = 'status';
    const locale = 'de';
    const translations = {
        active: {
            de: 'aktiv',
        },
    };

    const actual = humanReadable({
        obj: project,
        attribute,
        locale,
        translations,
    });
    const expected = 'aktiv';
    expect(actual).toEqual(expected);
});
