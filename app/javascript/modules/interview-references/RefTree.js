import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useIsEditor } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { HelpText } from 'modules/help-text';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import RefTreeChildren from './RefTreeChildren';

export default function RefTree({
    refTreeStatus,
    refTree,
    archiveId,
    fetchData,
}) {
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const isEditor = useIsEditor();

    useEffect(() => {
        if (refTreeStatus === 'n/a') {
            fetchData(
                { locale, projectId, project },
                'interviews',
                archiveId,
                'ref_tree'
            );
        }
    });

    if (refTreeStatus !== 'fetched') {
        return <Spinner />;
    }

    function hasProjectReferences() {
        return Array.isArray(refTree?.project?.children);
    }

    function hasOHDReferences() {
        return Array.isArray(refTree?.ohd?.children);
    }

    function hasAnyReferences() {
        return hasProjectReferences() || hasOHDReferences();
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
                    {hasOHDReferences() && (
                        <RefTreeChildren entries={refTree.ohd.children} />
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
