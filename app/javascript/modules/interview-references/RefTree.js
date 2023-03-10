import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useIsEditor } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { HelpText } from 'modules/help-text';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import { DumbTranscriptResult } from 'modules/interview-search';
import RefTreeEntry from './RefTreeEntry';
import getTextAndLang from './getTextAndLang';

export default function RefTree({
    refTreeStatus,
    refTree,
    interview,
    archiveId,
    locale,
    projectId,
    project,
    fetchData,
}) {
    const { t } = useI18n();
    const isEditor = useIsEditor();

    useEffect(() => {
        if (refTreeStatus === 'n/a') {
            fetchData({ locale, projectId, project }, 'interviews', archiveId, 'ref_tree');
        }
    });

    function renderChildren(children) {
        return children.map((entry, index) => {
            if (entry.type === 'leafe') {
                const [text, lang] = getTextAndLang(entry.text, locale, interview.lang);

                return (
                    <DumbTranscriptResult
                        highlightedText={text}
                        tapeNumber={entry.tape_nbr}
                        time={entry.time}
                        lang={lang}
                        className="heading"
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
            {isEditor && <HelpText code="interview_registry" className="u-mb" />}
            <div className="content-index content-ref-tree">
                {refTree?.children ?
                    renderChildren(refTree.children) :
                    t('without_ref_tree')
                }
            </div>
        </ScrollToTop>
    );
}

RefTree.propTypes = {
    locale: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    refTree: PropTypes.object,
    refTreeStatus: PropTypes.string.isRequired,
    fetchData: PropTypes.func.isRequired,
};
