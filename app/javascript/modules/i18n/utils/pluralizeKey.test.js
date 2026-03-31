import { pluralizeKey } from './pluralizeKey';

describe('pluralizeKey', () => {
    it('uses one for singular count in English', () => {
        expect(pluralizeKey('activerecord.models.project', 1, 'en')).toBe(
            'activerecord.models.project.one'
        );
    });

    it('uses other for plural count in English', () => {
        expect(pluralizeKey('activerecord.models.project', 2, 'en')).toBe(
            'activerecord.models.project.other'
        );
    });

    it('uses locale-aware categories when available', () => {
        expect(
            pluralizeKey('activerecord.models.project', 2, 'ar', [
                'zero',
                'one',
                'two',
                'few',
                'many',
                'other',
            ])
        ).toBe('activerecord.models.project.two');
    });

    it('falls back to other when category is not supported', () => {
        expect(pluralizeKey('activerecord.models.project', 2, 'ar')).toBe(
            'activerecord.models.project.other'
        );
    });
});
