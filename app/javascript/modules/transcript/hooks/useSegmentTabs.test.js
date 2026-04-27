import React from 'react';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import PropTypes from 'prop-types';

import { useSegmentTabs } from './useSegmentTabs';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('modules/i18n', () => ({
    useI18n: jest.fn(() => ({
        t: (key) => key,
        locale: 'en',
    })),
}));

function TestComponent({
    showEditTab,
    showHeadingsTab,
    showAnnotationsTab,
    showReferencesTab,
    onRender,
}) {
    const tabs = useSegmentTabs(
        showEditTab,
        showHeadingsTab,
        showAnnotationsTab,
        showReferencesTab
    );

    React.useEffect(() => {
        onRender(tabs);
    }, [tabs, onRender]);

    return null;
}

TestComponent.propTypes = {
    showEditTab: PropTypes.bool,
    showHeadingsTab: PropTypes.bool,
    showAnnotationsTab: PropTypes.bool,
    showReferencesTab: PropTypes.bool,
    onRender: PropTypes.func.isRequired,
};

describe('useSegmentTabs', () => {
    let wrapper;
    let result;

    const render = (props) => {
        wrapper = mount(
            <TestComponent
                {...props}
                onRender={(r) => {
                    result = r;
                }}
            />
        );
    };

    afterEach(() => {
        if (wrapper) wrapper.unmount();
        result = null;
    });

    it('returns array with edit tab when showEditTab is true', () => {
        render({
            showEditTab: true,
            showHeadingsTab: false,
            showAnnotationsTab: false,
            showReferencesTab: false,
        });

        expect(result).toEqual([
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

        expect(result).toEqual([
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

        expect(result).toEqual([
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

        expect(result).toEqual([
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

        expect(result).toEqual([
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

        expect(result).toEqual([]);
    });

    it('maintains tab order: edit, headings, annotations, references', () => {
        render({
            showEditTab: true,
            showHeadingsTab: true,
            showAnnotationsTab: true,
            showReferencesTab: true,
        });

        expect(result[0].id).toBe('edit');
        expect(result[1].id).toBe('headings');
        expect(result[2].id).toBe('annotations');
        expect(result[3].id).toBe('references');
    });

    it('handles partial true flags', () => {
        render({
            showEditTab: true,
            showHeadingsTab: false,
            showAnnotationsTab: false,
            showReferencesTab: true,
        });

        expect(result).toEqual([
            { id: 'edit', label: 'edit.segment.tab_edit' },
            { id: 'references', label: 'edit.segment.tab_registry_references' },
        ]);
    });
});
