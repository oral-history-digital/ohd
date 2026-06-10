import {
    FILTER_PARAMS,
    applyCollectionRangeParams,
    applyInstitutionLevelParam,
    applyInstitutionParam,
    applyInterviewRangeParams,
    applyQueryParam,
    applyYearRangeParams,
    resetExplorerFilters,
} from './explorerSearchParams';

describe('explorerSearchParams', () => {
    describe('resetExplorerFilters', () => {
        it('removes all explorer filter params', () => {
            const params = new URLSearchParams();

            FILTER_PARAMS.forEach((key) => {
                params.set(key, 'value');
            });

            params.set('page', '2');
            params.set('locale', 'de');

            const result = resetExplorerFilters(params);

            // Result and params refer to the same mutated URLSearchParams instance
            expect(result).toBe(params);

            FILTER_PARAMS.forEach((key) => {
                expect(result.has(key)).toBe(false);
            });

            expect(result.get('page')).toBe('2');
            expect(result.get('locale')).toBe('de');
        });
    });

    describe('applyQueryParam', () => {
        it('sets explorer_q when value is present', () => {
            const params = new URLSearchParams();

            const result = applyQueryParam(params, 'test query');

            expect(result).toBe(params);
            expect(result.get('explorer_q')).toBe('test query');
        });

        it('removes explorer_q when value is empty', () => {
            const params = new URLSearchParams('explorer_q=test');

            applyQueryParam(params, '');

            expect(params.has('explorer_q')).toBe(false);
        });
    });

    describe('applyInterviewRangeParams', () => {
        it('sets min and max params when values differ from global bounds', () => {
            const params = new URLSearchParams();

            applyInterviewRangeParams(params, 5, 20, 0, 100);

            expect(params.get('explorer_interviews_min')).toBe('5');
            expect(params.get('explorer_interviews_max')).toBe('20');
        });

        it('removes min and max params when values equal global bounds', () => {
            const params = new URLSearchParams(
                'explorer_interviews_min=5&explorer_interviews_max=20'
            );

            applyInterviewRangeParams(params, 0, 100, 0, 100);

            expect(params.has('explorer_interviews_min')).toBe(false);
            expect(params.has('explorer_interviews_max')).toBe(false);
        });

        it('can set one bound while removing the other', () => {
            const params = new URLSearchParams(
                'explorer_interviews_min=5&explorer_interviews_max=20'
            );

            applyInterviewRangeParams(params, 0, 20, 0, 100);

            expect(params.has('explorer_interviews_min')).toBe(false);
            expect(params.get('explorer_interviews_max')).toBe('20');
        });
    });

    describe('applyCollectionRangeParams', () => {
        it('sets min and max params when values differ from global bounds', () => {
            const params = new URLSearchParams();

            applyCollectionRangeParams(params, 2, 8, 0, 10);

            expect(params.get('explorer_collections_min')).toBe('2');
            expect(params.get('explorer_collections_max')).toBe('8');
        });

        it('removes min and max params when values equal global bounds', () => {
            const params = new URLSearchParams(
                'explorer_collections_min=2&explorer_collections_max=8'
            );

            applyCollectionRangeParams(params, 0, 10, 0, 10);

            expect(params.has('explorer_collections_min')).toBe(false);
            expect(params.has('explorer_collections_max')).toBe(false);
        });
    });

    describe('applyYearRangeParams', () => {
        it('sets min and max params when values differ from global bounds', () => {
            const params = new URLSearchParams();

            applyYearRangeParams(params, 1980, 2000, 1900, 2020);

            expect(params.get('explorer_year_min')).toBe('1980');
            expect(params.get('explorer_year_max')).toBe('2000');
        });

        it('removes min and max params when values equal global bounds', () => {
            const params = new URLSearchParams(
                'explorer_year_min=1980&explorer_year_max=2000'
            );

            applyYearRangeParams(params, 1900, 2020, 1900, 2020);

            expect(params.has('explorer_year_min')).toBe(false);
            expect(params.has('explorer_year_max')).toBe(false);
        });
    });

    describe('applyInstitutionParam', () => {
        it('stores institution ids as a comma-separated value', () => {
            const params = new URLSearchParams();

            applyInstitutionParam(params, [1, 2, 3]);

            expect(params.get('explorer_institution')).toBe('1,2,3');
        });

        it('removes explorer_institution when ids are empty', () => {
            const params = new URLSearchParams('explorer_institution=1,2,3');

            applyInstitutionParam(params, []);

            expect(params.has('explorer_institution')).toBe(false);
        });

        it('removes explorer_institution when ids are missing', () => {
            const params = new URLSearchParams('explorer_institution=1,2,3');

            applyInstitutionParam(params);

            expect(params.has('explorer_institution')).toBe(false);
        });
    });

    describe('applyInstitutionLevelParam', () => {
        it('sets explorer_institution_level when level is not all', () => {
            const params = new URLSearchParams();

            applyInstitutionLevelParam(params, 'top_level');

            expect(params.get('explorer_institution_level')).toBe('top_level');
        });

        it('removes explorer_institution_level when level is all', () => {
            const params = new URLSearchParams(
                'explorer_institution_level=top_level'
            );

            applyInstitutionLevelParam(params, 'all');

            expect(params.has('explorer_institution_level')).toBe(false);
        });

        it('removes explorer_institution_level when level is missing', () => {
            const params = new URLSearchParams(
                'explorer_institution_level=top_level'
            );

            applyInstitutionLevelParam(params);

            expect(params.has('explorer_institution_level')).toBe(false);
        });
    });
});
