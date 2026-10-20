import { useEffect } from 'react';

import { useIsEditor } from 'modules/archive';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import PropTypes from 'prop-types';

import RefTreeChildren from './RefTreeChildren';

/**
 * Loads and displays an interview's project and umbrella registry references.
 *
 * @param {Object} props - Reference-tree properties.
 * @param {string} props.refTreeStatus - Current Redux request status.
 * @param {Object} [props.refTree] - Project and umbrella tree sections.
 * @param {string} props.archiveId - Public interview identifier.
 * @param {Function} props.fetchData - Requests the interview's reference tree.
 * @returns {React.ReactElement} Reference tree, empty state, or loading indicator.
 */
export default function RefTree({
    refTreeStatus,
    refTree,
    archiveId,
    fetchData,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const isEditor = useIsEditor();

    useEffect(() => {
        if (refTreeStatus === 'n/a') {
            fetchData({ pathBase }, 'interviews', archiveId, 'ref_tree');
        }
    }, [refTreeStatus, fetchData, pathBase, archiveId]);

    if (refTreeStatus !== 'fetched') {
        return <Spinner />;
    }

    function hasProjectReferences() {
        return Array.isArray(refTree?.project?.children);
    }

    function hasUmbrellaReferences() {
        return Array.isArray(refTree?.umbrella?.children);
    }

    function hasAnyReferences() {
        return hasProjectReferences() || hasUmbrellaReferences();
    }

    return (
        <ScrollToTop>
            {isEditor && (
                <HelpText code="interview_registry" className="u-mb" />
            )}

            {hasAnyReferences() ? (
                <div className="content-index content-ref-tree">
                    {hasProjectReferences() && (
                        <RefTreeChildren entries={refTree.project.children} />
                    )}
                    {hasUmbrellaReferences() && (
                        <RefTreeChildren entries={refTree.umbrella.children} />
                    )}
                </div>
            ) : (
                t('without_ref_tree')
            )}
        </ScrollToTop>
    );
}

RefTree.propTypes = {
    archiveId: PropTypes.string.isRequired,
    refTree: PropTypes.object,
    refTreeStatus: PropTypes.string.isRequired,
    fetchData: PropTypes.func.isRequired,
};
