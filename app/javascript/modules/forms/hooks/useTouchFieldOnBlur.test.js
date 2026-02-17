import { useTouchFieldOnBlur } from './useTouchFieldOnBlur';

describe('useTouchFieldOnBlur', () => {
    it('returns a function', () => {
        const touchField = jest.fn();
        const handler = useTouchFieldOnBlur(touchField);
        expect(typeof handler).toBe('function');
    });

    it('calls touchField with field name on blur', () => {
        const touchField = jest.fn();
        const handler = useTouchFieldOnBlur(touchField);

        const event = {
            target: { name: 'email' },
        };

        handler(event);

        expect(touchField).toHaveBeenCalledWith('email');
        expect(touchField).toHaveBeenCalledTimes(1);
    });

    it('extracts name from event.target', () => {
        const touchField = jest.fn();
        const handler = useTouchFieldOnBlur(touchField);

        const event = {
            target: { name: 'password' },
        };

        handler(event);

        expect(touchField).toHaveBeenCalledWith('password');
    });

    it('handles touchField being undefined gracefully', () => {
        const handler = useTouchFieldOnBlur(undefined);

        const event = {
            target: { name: 'field' },
        };

        expect(() => {
            handler(event);
        }).not.toThrow();
    });

    it('handles touchField being null gracefully', () => {
        const handler = useTouchFieldOnBlur(null);

        const event = {
            target: { name: 'field' },
        };

        expect(() => {
            handler(event);
        }).not.toThrow();
    });

    it('does not call non-function touchField', () => {
        const mockObject = {};
        const handler = useTouchFieldOnBlur(mockObject);

        const event = {
            target: { name: 'field' },
        };

        expect(() => {
            handler(event);
        }).not.toThrow();
    });

    it('works with multiple blur events', () => {
        const touchField = jest.fn();
        const handler = useTouchFieldOnBlur(touchField);

        handler({ target: { name: 'first_name' } });
        handler({ target: { name: 'last_name' } });
        handler({ target: { name: 'email' } });

        expect(touchField).toHaveBeenCalledTimes(3);
        expect(touchField).toHaveBeenNthCalledWith(1, 'first_name');
        expect(touchField).toHaveBeenNthCalledWith(2, 'last_name');
        expect(touchField).toHaveBeenNthCalledWith(3, 'email');
    });
});
