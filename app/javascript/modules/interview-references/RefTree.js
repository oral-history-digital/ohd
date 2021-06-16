import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import { FoundSegmentContainer } from 'modules/transcript';
import RefTreeEntry from './RefTreeEntry';

export default function RefTree({
    refTreeStatus,
    interview,
    archiveId,
    locale,
    projectId,
    projects,
    fetchData,
}) {
    const { t } = useI18n();

    useEffect(() => {
        if (refTreeStatus === 'n/a') {
            fetchData({ locale, projectId, projects }, 'interviews', archiveId, 'ref_tree');
        }
    });

    function renderChildren(children) {
        return children.map((entry, index) => {
            if (entry.type === 'leafe') {
                return (
                    <FoundSegmentContainer
                        className='heading'
                        key={index}
                        data={entry}
                    />
                )
            } else {
                return <RefTreeEntry
                    key={index}
                    entry={entry}
                    index={index}
                    renderChildren={renderChildren}
                />
            }
        })
    }

    if (refTreeStatus !== 'fetched') {
        return <Spinner />;
    }

    return (
        <ScrollToTop>
            <div className="content-index content-ref-tree">
                {interview.ref_tree?.children ?
                    renderChildren(interview.ref_tree.children) :
                    t('without_ref_tree')
                }
            </div>
        </ScrollToTop>
    );
}

RefTree.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    refTreeStatus: PropTypes.string.isRequired,
    fetchData: PropTypes.func.isRequired,
};
