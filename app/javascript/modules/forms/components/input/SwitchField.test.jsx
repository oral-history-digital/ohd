import { fireEvent, render, screen } from '@testing-library/react';

import SwitchField from './SwitchField';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key }),
}));

test('preserves false edits and forwards boolean values and blur events', () => {
    const data = { enabled: true };
    const handleChange = jest.fn();
    const handlechangecallback = jest.fn();
    const handleErrors = jest.fn();
    const touchField = jest.fn();
    const validate = jest.fn((value) => value);
    render(
        <SwitchField
            scope="settings"
            attribute="enabled"
            id="custom"
            value={false}
            data={data}
            help="settings.enabled_help"
            validate={validate}
            showErrors
            handleChange={handleChange}
            handlechangecallback={handlechangecallback}
            handleErrors={handleErrors}
            touchField={touchField}
        />
    );

    const control = screen.getByRole('switch', {
        name: 'activerecord.attributes.settings.enabled *',
    });
    expect(control).toHaveAttribute('aria-checked', 'false');
    expect(control).toHaveAttribute('id', 'settings_custom');
    expect(screen.getByText('settings.enabled_help')).toBeInTheDocument();
    expect(
        screen.getByText('activerecord.errors.default.checkbox_input')
    ).toBeInTheDocument();
    fireEvent.click(control);
    expect(handleChange).toHaveBeenCalledWith('enabled', true, data);
    expect(handlechangecallback).toHaveBeenCalledWith('enabled', true, data);
    expect(handleErrors).toHaveBeenCalledWith('enabled', false);
    fireEvent.blur(control);
    expect(touchField).toHaveBeenCalledWith('enabled');
});

test.each(['disabled', 'readOnly'])('%s prevents toggling', (property) => {
    const handleChange = jest.fn();
    render(
        <SwitchField
            scope="settings"
            attribute="enabled"
            data={{ enabled: true }}
            labelKey="settings.enable"
            handleChange={handleChange}
            {...{ [property]: true }}
        />
    );
    const control = screen.getByRole('switch', { name: 'settings.enable' });
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(control).toBeDisabled();
    fireEvent.click(control);
    expect(handleChange).not.toHaveBeenCalled();
});
