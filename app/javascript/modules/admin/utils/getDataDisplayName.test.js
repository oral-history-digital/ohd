import { getDataDisplayName } from './getDataDisplayName';

describe('getDataDisplayName', () => {
    test.each([
        ['logo', 'Bild de'],
        ['sponsor_logo', 'Sponsor name'],
    ])('uses the appropriate label for %s', (scope, expected) => {
        expect(
            getDataDisplayName(
                {
                    id: 4,
                    locale: 'de',
                    title: 'Sponsor name',
                    filename: 'file.png',
                },
                'en',
                {
                    scope,
                    resourceLabel: 'Bild',
                }
            )
        ).toBe(expected);
    });

    test('uses the resource label and ID when no usable label or logo locale exists', () => {
        expect(
            getDataDisplayName({ id: 4 }, 'en', {
                resourceLabel: 'Institution',
            })
        ).toBe('Institution #4');
        expect(
            getDataDisplayName({ id: 4 }, 'en', {
                scope: 'logo',
                resourceLabel: 'Logo',
            })
        ).toBe('Logo #4');
    });

    test('uses a localized title for non-person data', () => {
        expect(
            getDataDisplayName(
                { type: 'Interview', title: { de: 'Geschichte' } },
                'de'
            )
        ).toBe('Geschichte');
    });

    test('combines localized personal names', () => {
        expect(
            getDataDisplayName(
                {
                    type: 'Person',
                    name_type: 'Personal',
                    first_name: { en: 'Ada' },
                    last_name: { en: 'Lovelace' },
                },
                'en'
            )
        ).toBe('Ada Lovelace');
    });

    test('uses a localized name when no title or personal name applies', () => {
        expect(getDataDisplayName({ name: { de: 'Archiv' } }, 'de')).toBe(
            'Archiv'
        );
    });

    test('uses a localized code when no title or name is available', () => {
        expect(getDataDisplayName({ code: { en: 'INT' } }, 'en')).toBe('INT');
    });

    test('does not use a title for person data', () => {
        expect(
            getDataDisplayName(
                { type: 'Person', title: { en: 'Ignored' }, code: 'P1' },
                'en'
            )
        ).toBe('P1');
    });

    test('empty translated titles and names do not hide usable fallback fields', () => {
        expect(
            getDataDisplayName(
                {
                    title: { en: '' },
                    name: { en: '' },
                    internal_name: 'Website',
                },
                'en'
            )
        ).toBe('Website');
        expect(
            getDataDisplayName(
                { name_type: 'Personal', first_name: 'Ada' },
                'en'
            )
        ).toBe('Ada');
    });
});
