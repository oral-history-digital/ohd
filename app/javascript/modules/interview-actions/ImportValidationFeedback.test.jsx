import { render, screen } from '@testing-library/react';
import translate from 'modules/i18n/t';

import ImportValidationFeedback, {
    formatImportIssue,
} from './ImportValidationFeedback';

const mockTranslations = {
    'import_validation.location.sheet': { en: 'Sheet "%{value}"' },
    'import_validation.location.row': {
        en: 'Row %{value}',
        de: 'Zeile %{value}',
    },
    'import_validation.field.timecode': { en: 'Timecode' },
    'import_validation.value_message': { en: '%{field} %{value}. %{message}' },
    'import_validation.located_message': { en: '%{location}: %{message}' },
    'import_validation.empty_value': { en: '(empty)' },
    'import_validation.test': {
        en: 'Frame limit %{max}.',
        de: 'Frame-Grenze %{max}.',
    },
};
jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        t: (key, params) =>
            jest
                .requireActual('modules/i18n/t')
                .default(
                    { locale: 'de', translations: mockTranslations },
                    key,
                    params
                ),
    }),
}));

test('formats translated locations values and interpolation using English fallback', () => {
    const t = (key, params) =>
        translate(
            { locale: 'de', translations: mockTranslations },
            key,
            params
        );
    const issue = {
        code: 'test',
        params: { value: '00:00:01:24', max: 23 },
        location: { sheet: 'default', row: 5 },
    };
    const original = JSON.stringify(issue);
    expect(formatImportIssue(issue, t)).toBe(
        'Sheet "default", Zeile 5: Timecode "00:00:01:24". Frame-Grenze 23.'
    );
    expect(JSON.stringify(issue)).toBe(original);
    expect(
        formatImportIssue({ ...issue, params: { value: null, max: 23 } }, t)
    ).toContain('Timecode (empty).');
});

test('renders uploaded content as escaped text', () => {
    render(
        <ImportValidationFeedback
            status="invalid"
            issues={[
                {
                    code: 'test',
                    params: { value: '<script>bad</script>', max: 23 },
                    location: { row: 2 },
                },
            ]}
        />
    );
    expect(screen.getByRole('listitem')).toHaveTextContent(
        'Zeile 2: Timecode "<script>bad</script>". Frame-Grenze 23.'
    );
    expect(document.querySelector('script')).toBeNull();
});
