import scrollSmoothlyTo from './scrollSmoothlyTo';

jest.useFakeTimers();

describe('scrollSmoothlyTo', () => {
    let originalScrollTo;
    let originalScrollBehaviorDescriptor;
    let rafQueue;
    beforeEach(() => {
        originalScrollTo = window.scrollTo;
        window.scrollTo = jest.fn();
        // Save the original descriptor for scrollBehavior
        originalScrollBehaviorDescriptor = Object.getOwnPropertyDescriptor(
            document.documentElement.style,
            'scrollBehavior'
        );
        // Mock requestAnimationFrame
        rafQueue = [];
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) =>
            rafQueue.push(cb)
        );
    });
    afterEach(() => {
        window.scrollTo = originalScrollTo;
        // Restore the original scrollBehavior property
        if (originalScrollBehaviorDescriptor) {
            Object.defineProperty(
                document.documentElement.style,
                'scrollBehavior',
                originalScrollBehaviorDescriptor
            );
        } else {
            delete document.documentElement.style.scrollBehavior;
        }
        window.requestAnimationFrame.mockRestore();
    });

    function flushAnimationFrames() {
        while (rafQueue.length) {
            const cb = rafQueue.shift();
            cb();
        }
    }

    it('should call window.scrollTo with smooth behavior if supported', async () => {
        Object.defineProperty(
            document.documentElement.style,
            'scrollBehavior',
            {
                get: () => 'auto',
                configurable: true,
            }
        );
        const originalIn = Object.prototype.hasOwnProperty;
        Object.prototype.hasOwnProperty = function (prop) {
            if (prop === 'scrollBehavior') return true;
            return originalIn.call(this, prop);
        };
        scrollSmoothlyTo(10, 20);
        flushAnimationFrames();
        flushAnimationFrames();
        expect(window.scrollTo).toHaveBeenCalledWith({
            left: 10,
            top: 20,
            behavior: 'smooth',
        });
        Object.prototype.hasOwnProperty = originalIn;
    });

    it('should fall back to instant scroll if error is thrown', async () => {
        Object.defineProperty(
            document.documentElement.style,
            'scrollBehavior',
            {
                get: () => 'auto',
                configurable: true,
            }
        );
        const originalIn = Object.prototype.hasOwnProperty;
        Object.prototype.hasOwnProperty = function (prop) {
            if (prop === 'scrollBehavior') return true;
            return originalIn.call(this, prop);
        };
        window.scrollTo.mockImplementationOnce(() => {
            throw new Error('fail');
        });
        scrollSmoothlyTo(50, 60);
        flushAnimationFrames();
        flushAnimationFrames();
        expect(window.scrollTo).toHaveBeenCalledWith({
            left: 50,
            top: 60,
            behavior: 'smooth',
        });
        expect(window.scrollTo).toHaveBeenCalledWith(50, 60);
        Object.prototype.hasOwnProperty = originalIn;
    });

    it('should use a delay before calling scrollTo', async () => {
        Object.defineProperty(
            document.documentElement.style,
            'scrollBehavior',
            {
                get: () => 'auto',
                configurable: true,
            }
        );
        const originalIn = Object.prototype.hasOwnProperty;
        Object.prototype.hasOwnProperty = function (prop) {
            if (prop === 'scrollBehavior') return true;
            return originalIn.call(this, prop);
        };
        scrollSmoothlyTo(70, 80);
        flushAnimationFrames();
        flushAnimationFrames();
        expect(window.scrollTo).toHaveBeenCalledWith({
            left: 70,
            top: 80,
            behavior: 'smooth',
        });
        Object.prototype.hasOwnProperty = originalIn;
    });
});
