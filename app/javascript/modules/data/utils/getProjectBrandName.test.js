import { getProjectBrandName } from './getProjectBrandName';

test('includes display shortname after the localized project name', () => {
    expect(
        getProjectBrandName(
            {
                display_shortname: 'oh.d',
                name: { en: 'Oral-History.Digital' },
            },
            'en'
        )
    ).toBe('Oral-History.Digital (oh.d)');
});

test('uses only the localized project name when display shortname is missing', () => {
    expect(getProjectBrandName({ name: { en: 'Portal' } }, 'en')).toBe(
        'Portal'
    );
});

test('does not fall back to the machine shortname', () => {
    expect(getProjectBrandName({ shortname: 'portal' }, 'en')).toBeNull();
});

test('formats the localized name returned by project details', () => {
    expect(
        getProjectBrandName({ name: 'Portal', display_shortname: 'oh.d' }, 'en')
    ).toBe('Portal (oh.d)');
});
