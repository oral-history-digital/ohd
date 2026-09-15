import { getDataDisplayName } from './getDataDisplayName';

describe('getDataDisplayName', () => {
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
});
