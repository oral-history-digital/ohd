import { renderHook } from '@testing-library/react';

import { useSegmentTabs } from './useSegmentTabs';

jest.mock('modules/i18n', () => ({
    useI18n: jest.fn(() => ({
        t: (key) => key,
        locale: 'en',
    })),
}));

describe('useSegmentTabs', () => {
    let result;

    const render = (props) => {
        result = renderHook(() =>
            useSegmentTabs(
                props.showEditTab,
                props.showHeadingsTab,
                props.showAnnotationsTab,
                props.showReferencesTab
            )
        ).result;
    };

    afterEach(() => {
        result = null;
    });

    it('returns array with edit tab when showEditTab is true', () => {
        render({
            showEditTab: true,
            showHeadingsTab: false,
            showAnnotationsTab: false,
            showReferencesTab: false,
        });

        expect(result.current).toEqual([
            { id: 'edit', label: 'edit.segment.tab_edit' },
        ]);
    });

    it('returns array with headings tab when showHeadingsTab is true', () => {
        render({
            showEditTab: false,
            showHeadingsTab: true,
            showAnnotationsTab: false,
            showReferencesTab: false,
        });

        expect(result.current).toEqual([
            { id: 'headings', label: 'edit.segment.tab_headings' },
        ]);
    });

    it('returns array with annotations tab when showAnnotationsTab is true', () => {
        render({
            showEditTab: false,
            showHeadingsTab: false,
            showAnnotationsTab: true,
            showReferencesTab: false,
        });

        expect(result.current).toEqual([
            { id: 'annotations', label: 'edit.segment.tab_annotations' },
        ]);
    });

    it('returns array with references tab when showReferencesTab is true', () => {
        render({
            showEditTab: false,
            showHeadingsTab: false,
            showAnnotationsTab: false,
            showReferencesTab: true,
        });

        expect(result.current).toEqual([
            { id: 'references', label: 'edit.segment.tab_registry_references' },
        ]);
    });

    it('returns multiple tabs when multiple flags are true', () => {
        render({
            showEditTab: true,
            showHeadingsTab: true,
            showAnnotationsTab: true,
            showReferencesTab: true,
        });

        expect(result.current).toEqual([
            { id: 'edit', label: 'edit.segment.tab_edit' },
            { id: 'headings', label: 'edit.segment.tab_headings' },
            { id: 'annotations', label: 'edit.segment.tab_annotations' },
            { id: 'references', label: 'edit.segment.tab_registry_references' },
        ]);
    });

    it('returns empty array when all flags are false', () => {
        render({
            showEditTab: false,
            showHeadingsTab: false,
            showAnnotationsTab: false,
            showReferencesTab: false,
        });

        expect(result.current).toEqual([]);
    });

    it('maintains tab order: edit, headings, annotations, references', () => {
        render({
            showEditTab: true,
            showHeadingsTab: true,
            showAnnotationsTab: true,
            showReferencesTab: true,
        });

        expect(result.current[0].id).toBe('edit');
        expect(result.current[1].id).toBe('headings');
        expect(result.current[2].id).toBe('annotations');
        expect(result.current[3].id).toBe('references');
    });

    it('handles partial true flags', () => {
        render({
            showEditTab: true,
            showHeadingsTab: false,
            showAnnotationsTab: false,
            showReferencesTab: true,
        });

        expect(result.current).toEqual([
            { id: 'edit', label: 'edit.segment.tab_edit' },
            { id: 'references', label: 'edit.segment.tab_registry_references' },
        ]);
    });
});
