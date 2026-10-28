import { fireEvent, render, screen } from '@testing-library/react';

import Switch from './Switch';

test('requests state changes and uses primary color when enabled', () => {
    const onChange = jest.fn();
    const { rerender } = render(
        <Switch checked={false} onChange={onChange} label="Show projects" />
    );
    const control = screen.getByRole('switch', { name: 'Show projects' });
    expect(control).not.toBeChecked();
    fireEvent.click(control);
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(<Switch checked onChange={onChange} label="Show projects" />);
    expect(control).toBeChecked();
    expect(control.querySelector('svg').style.color).toBe(
        'var(--primary-color)'
    );
    expect(control).toHaveClass('Switch--md');
    fireEvent.click(control);
    expect(onChange).toHaveBeenLastCalledWith(false);
});

test('prevents state changes when disabled', () => {
    const onChange = jest.fn();
    render(
        <Switch
            checked={false}
            onChange={onChange}
            label="Show projects"
            disabled
        />
    );
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
});

test.each(['sm', 'md', 'lg'])(
    'supports size %s and a custom enabled color',
    (size) => {
        const { rerender } = render(
            <Switch
                checked
                onChange={jest.fn()}
                label="Custom switch"
                size={size}
                color="#123456"
            />
        );
        const control = screen.getByRole('switch');
        expect(control).toHaveClass(`Switch--${size}`);
        expect(control.querySelector('svg')).toHaveStyle({ color: '#123456' });
        rerender(
            <Switch
                checked={false}
                onChange={jest.fn()}
                label="Custom switch"
                size={size}
                color="#123456"
            />
        );
        expect(control.querySelector('svg')).toHaveClass('Icon--text');
        expect(control.querySelector('svg').style.color).toBe('');
    }
);
