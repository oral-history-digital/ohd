import { getTimecodeHelpText } from './getTimecodeHelpText';

describe('getTimecodeHelpText', () => {
    // Mock translation function with interpolation support
    const mockT = (key, params) => {
        const translations = {
            'edit.segment.timecode_format': 'Format: HH:MM:SS or HH:MM:SS.mmm',
            'edit.segment.timecode_range_both': `Allowed range: > ${params?.prev} and < ${params?.next}`,
            'edit.segment.timecode_range_prev_only': `Allowed range: > ${params?.prev}`,
        };
        return translations[key] || key;
    };

    it('returns format hint when no constraints exist', () => {
        const result = getTimecodeHelpText(mockT, null, null);
        expect(result).toBe('Format: HH:MM:SS or HH:MM:SS.mmm');
    });

    it('returns format hint when both constraints are undefined', () => {
        const result = getTimecodeHelpText(mockT, undefined, undefined);
        expect(result).toBe('Format: HH:MM:SS or HH:MM:SS.mmm');
    });

    it('shows only lower bound when only prevTimecode exists', () => {
        const result = getTimecodeHelpText(mockT, '00:01:30', null);
        expect(result).toBe('Allowed range: > 00:01:30');
    });

    it('shows default lower bound when only nextTimecode exists (first segment)', () => {
        const result = getTimecodeHelpText(mockT, null, '00:03:45');
        expect(result).toBe('Allowed range: > 00:00:00.000 and < 00:03:45');
    });

    it('shows both bounds when both constraints exist', () => {
        const result = getTimecodeHelpText(mockT, '00:01:30', '00:03:45');
        expect(result).toBe('Allowed range: > 00:01:30 and < 00:03:45');
    });

    it('handles timecodes with milliseconds', () => {
        const result = getTimecodeHelpText(
            mockT,
            '00:01:30.500',
            '00:03:45.750'
        );
        expect(result).toBe('Allowed range: > 00:01:30.500 and < 00:03:45.750');
    });

    it('handles timecodes with hours', () => {
        const result = getTimecodeHelpText(mockT, '01:30:15', '02:45:30');
        expect(result).toBe('Allowed range: > 01:30:15 and < 02:45:30');
    });

    it('uses translation function for all text', () => {
        const customT = jest.fn((key, params) => {
            const translations = {
                'edit.segment.timecode_range_both': `Erlaubter Bereich: > ${params?.prev} und < ${params?.next}`,
            };
            return translations[key] || key;
        });

        const result = getTimecodeHelpText(customT, '00:01:00', '00:02:00');

        expect(customT).toHaveBeenCalledWith(
            'edit.segment.timecode_range_both',
            {
                prev: '00:01:00',
                next: '00:02:00',
            }
        );
        expect(result).toBe('Erlaubter Bereich: > 00:01:00 und < 00:02:00');
    });

    it('uses translation function for format text when no constraints', () => {
        const customT = jest.fn((key) => {
            const translations = {
                'edit.segment.timecode_format':
                    'Format: HH:MM:SS oder HH:MM:SS.mmm',
            };
            return translations[key] || key;
        });

        const result = getTimecodeHelpText(customT, null, null);

        expect(customT).toHaveBeenCalledWith('edit.segment.timecode_format');
        expect(result).toBe('Format: HH:MM:SS oder HH:MM:SS.mmm');
    });

    it('treats empty strings as falsy (no constraints)', () => {
        const result = getTimecodeHelpText(mockT, '', '');
        expect(result).toBe('Format: HH:MM:SS or HH:MM:SS.mmm');
    });

    it('handles mixed empty string and null', () => {
        const result = getTimecodeHelpText(mockT, '', null);
        expect(result).toBe('Format: HH:MM:SS or HH:MM:SS.mmm');
    });

    it('shows constraint when prevTimecode is provided but nextTimecode is empty string (last segment)', () => {
        const result = getTimecodeHelpText(mockT, '00:01:00', '');
        expect(result).toBe('Allowed range: > 00:01:00');
    });

    it('uses correct translation key for each scenario', () => {
        const spyT = jest.fn(mockT);

        getTimecodeHelpText(spyT, '00:01:00', '00:02:00');
        expect(spyT).toHaveBeenLastCalledWith(
            'edit.segment.timecode_range_both',
            {
                prev: '00:01:00',
                next: '00:02:00',
            }
        );

        spyT.mockClear();
        getTimecodeHelpText(spyT, '00:01:00', null);
        expect(spyT).toHaveBeenLastCalledWith(
            'edit.segment.timecode_range_prev_only',
            {
                prev: '00:01:00',
            }
        );

        spyT.mockClear();
        getTimecodeHelpText(spyT, null, '00:02:00');
        expect(spyT).toHaveBeenLastCalledWith(
            'edit.segment.timecode_range_both',
            {
                prev: '00:00:00.000',
                next: '00:02:00',
            }
        );
    });
});
