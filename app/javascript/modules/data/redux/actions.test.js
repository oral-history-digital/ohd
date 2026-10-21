import { Loader } from 'modules/api';
import { pathBase } from 'modules/routes';

import { deleteData, submitData } from './actions';

jest.mock('modules/api', () => ({
    Loader: {
        getJson: jest.fn(),
        put: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
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

    it.each([
        ['/en', true],
        ['/en', false],
        ['/history/de', true],
        ['/history/de', false],
    ])(
        'uses route prefix %s for an existing record: %s',
        (prefix, existing) => {
            const params = {
                registry_reference: {
                    registry_entry_id: 7,
                    ...(existing ? { id: 4 } : {}),
                },
            };
            submitData({ pathBase: prefix }, params)(jest.fn());
            const loader = existing ? Loader.put : Loader.post;
            expect(loader.mock.calls[0][0]).toBe(
                `${prefix}/registry_references${existing ? '/4' : ''}`
            );
            expect(pathBase).not.toHaveBeenCalled();
            expect(loader.mock.calls[0][3]({})).toMatchObject({
                mutation: true,
                mutationResource: 'registry_references',
            });
        }
    );

    it.each([false, true])(
        'tags annotation saves with the changed resource while keeping the segment response shape (existing: %s)',
        (existing) => {
            submitData(
                { pathBase: '/pilot/de' },
                {
                    annotation: {
                        ...(existing ? { id: 12 } : {}),
                        text: 'Note',
                    },
                }
            )(jest.fn());
            const loader = existing ? Loader.put : Loader.post;
            const receive = loader.mock.lastCall[3];
            expect(
                receive({
                    archive_id: 'pilot001',
                    data_type: 'interviews',
                    nested_data_type: 'segments',
                    nested_id: 3,
                    extra_id: 1,
                    data: { id: 3 },
                })
            ).toMatchObject({
                mutation: true,
                mutationResource: 'annotations',
                dataType: 'interviews',
                nestedDataType: 'segments',
                nestedId: 3,
                extraId: 1,
                data: { id: 3 },
            });
        }
    );

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

describe('deleteData', () => {
    beforeEach(() => jest.clearAllMocks());

    it.each(['/en', '/history/de'])(
        'uses explicit route prefix %s and retains mutation invalidation',
        (prefix) => {
            const dispatch = jest.fn();
            deleteData(
                { pathBase: prefix },
                'registry_references',
                4,
                null,
                null,
                true
            )(dispatch);
            expect(Loader.delete.mock.calls[0][0]).toBe(
                `${prefix}/registry_references/4`
            );
            expect(pathBase).not.toHaveBeenCalled();
            const receive = Loader.delete.mock.calls[0][2];
            expect(receive({})).toMatchObject({
                mutation: true,
                mutationResource: 'registry_references',
            });
        }
    );

    it('preserves legacy path resolution and nested interview deletion', () => {
        const props = { locale: 'de', project: { shortname: 'pilot' } };
        deleteData(
            props,
            'interviews',
            'H-001',
            'registry_references',
            4
        )(jest.fn());
        expect(pathBase).toHaveBeenCalledWith(props);
        expect(Loader.delete.mock.calls[0][0]).toBe(
            '/pilot/de/interviews/H-001/registry_references/4'
        );
    });
});
