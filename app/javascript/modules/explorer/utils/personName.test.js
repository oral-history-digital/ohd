import { personName } from './personName';

describe('personName', () => {
    test('returns first and last name for Personal type', () => {
        const person = {
            name_type: 'Personal',
            name: 'Should Not Be Used',
            first_name: 'Ada',
            last_name: 'Lovelace',
        };

        expect(personName(person)).toBe('Ada Lovelace');
    });

    test('returns organizational name for Organizational type', () => {
        const person = {
            name_type: 'Organizational',
            name: 'Museum Foundation',
            first_name: 'Ignored',
            last_name: 'Person',
        };

        expect(personName(person)).toBe('Museum Foundation');
    });

    test('falls back to direct name for unknown type', () => {
        const person = {
            name_type: 'Other',
            name: 'Fallback Name',
            first_name: 'First',
            last_name: 'Last',
        };

        expect(personName(person)).toBe('Fallback Name');
    });

    test('falls back to first and last name when direct name is blank', () => {
        const person = {
            name_type: 'Other',
            name: '   ',
            first_name: 'First',
            last_name: 'Last',
        };

        expect(personName(person)).toBe('First Last');
    });

    test('handles missing values safely', () => {
        expect(personName(null)).toBe('');
        expect(personName({})).toBe('');
        expect(personName('Ada')).toBe('');
        expect(personName(42)).toBe('');
    });
});
