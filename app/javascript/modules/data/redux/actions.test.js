import { Loader } from 'modules/api';
import { pathBase } from 'modules/routes';

import { submitData } from './actions';

jest.mock('modules/api', () => ({
    Loader: {
        put: jest.fn(),
        post: jest.fn(),
    },
}));

jest.mock('modules/routes', () => ({
    pathBase: jest.fn(() => '/pilot/de'),
}));

jest.mock('modules/strings', () => ({
    pluralize: jest.fn((value) => `${value}s`),
}));

describe('submitData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('uses PUT and does not mutate params when id exists', () => {
        const params = {
            segment: {
                id: 92654354,
                timecode: '00:00:10:00',
            },
        };
        const props = { locale: 'de', projectId: 'pilot' };
        const dispatch = jest.fn();

        submitData(props, params)(dispatch);

        expect(pathBase).toHaveBeenCalledWith(props);
        expect(Loader.put).toHaveBeenCalledTimes(1);
        expect(Loader.post).not.toHaveBeenCalled();

        const [url, payload] = Loader.put.mock.calls[0];
        expect(url).toBe('/pilot/de/segments/92654354');
        expect(payload).toEqual({
            segment: {
                timecode: '00:00:10:00',
            },
        });

        // Original form params must remain untouched for subsequent submits.
        expect(params.segment.id).toBe(92654354);
    });

    it('keeps using PUT on repeated submits with the same params object', () => {
        const params = {
            segment: {
                id: 92654354,
                timecode: '00:00:10:00',
            },
        };
        const props = { locale: 'de', projectId: 'pilot' };
        const dispatch = jest.fn();

        submitData(props, params)(dispatch);
        submitData(props, params)(dispatch);

        expect(Loader.put).toHaveBeenCalledTimes(2);
        expect(Loader.post).not.toHaveBeenCalled();
        expect(params.segment.id).toBe(92654354);
    });
});
