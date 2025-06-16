import getPlayerSources from './getPlayerSources';

describe('getPlayerSources', () => {
    test('returns empty array when player is null', () => {
        expect(getPlayerSources(null)).toEqual([]);
    });

    test('returns empty array when player is undefined', () => {
        expect(getPlayerSources(undefined)).toEqual([]);
    });

    test('returns currentSources() when available', () => {
        const mockSources = [{ src: 'video1.mp4' }, { src: 'video2.mp4' }];
        const mockPlayer = {
            currentSources: () => mockSources,
            sources: [{ src: 'fallback.mp4' }]
        };

        expect(getPlayerSources(mockPlayer)).toEqual(mockSources);
    });

    test('falls back to sources property when currentSources() fails', () => {
        const mockSources = [{ src: 'fallback.mp4' }];
        const mockPlayer = {
            currentSources: () => {
                throw new Error('Method not available');
            },
            sources: mockSources
        };

        expect(getPlayerSources(mockPlayer)).toEqual(mockSources);
    });

    test('falls back to sources property when currentSources() returns empty', () => {
        const mockSources = [{ src: 'fallback.mp4' }];
        const mockPlayer = {
            currentSources: () => [],
            sources: mockSources
        };

        expect(getPlayerSources(mockPlayer)).toEqual(mockSources);
    });

    test('returns empty array when both methods fail', () => {
        const mockPlayer = {
            currentSources: () => {
                throw new Error('Method not available');
            },
            sources: null
        };

        expect(getPlayerSources(mockPlayer)).toEqual([]);
    });
});
