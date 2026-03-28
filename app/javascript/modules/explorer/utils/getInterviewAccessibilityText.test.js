import { formatNumber } from 'modules/utils';

import { getInterviewAccessibilityText } from './getInterviewAccessibilityText';

jest.mock('modules/utils', () => ({
    formatNumber: jest.fn((value) => String(value)),
}));

describe('interviewStatsText', () => {
    const locale = 'de';

    const t = (key, values = {}) => {
        const translations = {
            'modules.catalog.currently_not_accessible':
                'derzeit nicht zugänglich',
            'modules.catalog.accessible_after_registration':
                'nach Registrierung zugänglich',
            'modules.catalog.accessible_on_demand_after_registration':
                'auf Anfrage nach Registrierung zugänglich',
            'modules.catalog.accessible_after_registration_count': [
                '',
                values.count,
                ' nach Registrierung zugänglich',
            ],
            'modules.catalog.accessible_on_demand_after_registration_count': [
                '',
                values.count,
                ' auf Anfrage nach Registrierung zugänglich',
            ],
            'modules.catalog.list_separator': ', ',
        };

        return translations[key];
    };

    describe('getInterviewAccessibilityText', () => {
        it('returns null when totalCount is 0', () => {
            const result = getInterviewAccessibilityText({
                totalCount: 0,
                publicCount: 0,
                restrictedCount: 0,
                t,
                locale,
            });

            expect(result).toBeNull();
        });

        it('returns currently not accessible when totalCount > 0 and no interviews are accessible', () => {
            const result = getInterviewAccessibilityText({
                totalCount: 5,
                publicCount: 0,
                restrictedCount: 0,
                t,
                locale,
            });

            expect(result).toBe('derzeit nicht zugänglich');
        });

        it('returns accessible after registration when all interviews are public', () => {
            const result = getInterviewAccessibilityText({
                totalCount: 5,
                publicCount: 5,
                restrictedCount: 0,
                t,
                locale,
            });

            expect(result).toBe('nach Registrierung zugänglich');
        });

        it('returns accessible on demand after registration when all interviews are restricted', () => {
            const result = getInterviewAccessibilityText({
                totalCount: 5,
                publicCount: 0,
                restrictedCount: 5,
                t,
                locale,
            });

            expect(result).toBe('auf Anfrage nach Registrierung zugänglich');
        });

        it('returns counted public accessibility text when only some public interviews exist', () => {
            const result = getInterviewAccessibilityText({
                totalCount: 5,
                publicCount: 3,
                restrictedCount: 0,
                t,
                locale,
            });

            expect(result).toBe('3 nach Registrierung zugänglich');
        });

        it('returns counted restricted accessibility text when only some restricted interviews exist', () => {
            const result = getInterviewAccessibilityText({
                totalCount: 5,
                publicCount: 0,
                restrictedCount: 2,
                t,
                locale,
            });

            expect(result).toBe('2 auf Anfrage nach Registrierung zugänglich');
        });

        it('returns combined accessibility text when public and restricted interviews both exist', () => {
            const result = getInterviewAccessibilityText({
                totalCount: 10,
                publicCount: 3,
                restrictedCount: 2,
                t,
                locale,
            });

            expect(result).toBe(
                '3 nach Registrierung zugänglich, 2 auf Anfrage nach Registrierung zugänglich'
            );
        });

        it('joins translation fragments without introducing array commas', () => {
            const result = getInterviewAccessibilityText({
                totalCount: 1597,
                publicCount: 783,
                restrictedCount: 554,
                t,
                locale,
            });

            expect(result).toBe(
                '783 nach Registrierung zugänglich, 554 auf Anfrage nach Registrierung zugänglich'
            );
            expect(result).not.toContain(',783,');
            expect(result).not.toContain(',554,');
        });

        it('uses formatNumber for both public and restricted counts', () => {
            getInterviewAccessibilityText({
                totalCount: 10,
                publicCount: 3,
                restrictedCount: 2,
                t,
                locale,
            });

            expect(formatNumber).toHaveBeenCalledWith(3, 0, locale);
            expect(formatNumber).toHaveBeenCalledWith(2, 0, locale);
        });
    });
});
