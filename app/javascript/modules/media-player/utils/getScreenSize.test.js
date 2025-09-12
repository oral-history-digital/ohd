import { getScreenSize } from './getScreenSize';

// Mock BREAKPOINTS used by the function
jest.mock('../constants', () => ({
    BREAKPOINTS: {
        xs: 480,
        s: 520,
        m: 768,
        l: 990,
        xl: 1200,
    },
}));

describe('getScreenSize', () => {
    beforeEach(() => {
        // Default to desktop width
        window.innerWidth = 1024;
    });

    it('returns "xs" for widths below the xs breakpoint', () => {
        window.innerWidth = 479;
        expect(getScreenSize()).toBe('xs');
    });

    it('returns "s" for width equal to xs breakpoint and below s', () => {
        window.innerWidth = 480; // equal to BREAKPOINTS.xs
        expect(getScreenSize()).toBe('s');

        window.innerWidth = 519; // just below s
        expect(getScreenSize()).toBe('s');
    });

    it('returns "m" for width equal to s breakpoint and below m', () => {
        window.innerWidth = 520; // equal to BREAKPOINTS.s
        expect(getScreenSize()).toBe('m');

        window.innerWidth = 767; // just below m
        expect(getScreenSize()).toBe('m');
    });

    it('returns "l" for width equal to m breakpoint and below l', () => {
        window.innerWidth = 768; // equal to BREAKPOINTS.m
        expect(getScreenSize()).toBe('l');

        window.innerWidth = 989; // just below l
        expect(getScreenSize()).toBe('l');
    });

    it('returns "xl" for width equal to l breakpoint and above', () => {
        window.innerWidth = 990; // equal to BREAKPOINTS.l
        expect(getScreenSize()).toBe('xl');

        window.innerWidth = 2000; // well above
        expect(getScreenSize()).toBe('xl');
    });

    it('respects custom BREAKPOINTS when re-imported after resetModules', () => {
        jest.resetModules();
        // Provide a different set of breakpoints
        jest.doMock('../constants', () => ({
            BREAKPOINTS: {
                xs: 300,
                s: 500,
                m: 700,
                l: 900,
                xl: 1100,
            },
        }));

        return import('./getScreenSize').then(({ getScreenSize: gs }) => {
            window.innerWidth = 299;
            expect(gs()).toBe('xs');

            window.innerWidth = 300;
            expect(gs()).toBe('s');

            window.innerWidth = 500;
            expect(gs()).toBe('m');

            window.innerWidth = 700;
            expect(gs()).toBe('l');

            window.innerWidth = 900;
            expect(gs()).toBe('xl');
        });
    });
});
