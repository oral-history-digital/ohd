import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaUndo } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import { AuthShowContainer } from 'modules/auth';
import { isMobile } from 'modules/user-agent';
import { Spinner } from 'modules/spinners';
import useSearchParams from '../useSearchParams';
import useArchiveSearch from '../useArchiveSearch';
import ArchiveFacets from './ArchiveFacets';
import ArchiveSearchFormInput from './ArchiveSearchFormInput';

export default function ArchiveSearchForm({
    projectId,
    hideSidebar,
    clearAllInterviewSearch,
}) {
    const { t } = useI18n();
    const formEl = useRef(null);
    const { facets } = useArchiveSearch();

    const { fulltext, setFulltext, resetSearchParams } = useSearchParams();

    const [fulltextInput, setFulltextInput] = useState(fulltext);

    function handleReset() {
        resetSearchParams();

        if (isMobile()) {
            hideSidebar();
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        setFulltext(fulltextInput?.trim());

        clearAllInterviewSearch();

        if (isMobile()) {
            hideSidebar();
        }
    }

    return (
        <div>
            <form
                ref={formEl}
                id="archiveSearchForm"
                className="flyout-search"
                onSubmit={handleSubmit}
            >
                {projectId === 'mog' ? (
                    <ArchiveSearchFormInput
                        value={fulltextInput}
                        projectId={projectId}
                        onChange={setFulltextInput}
                    />
                ) : (
                    <AuthShowContainer ifLoggedIn ifCatalog ifNoProject>
                       <ArchiveSearchFormInput
                            value={fulltextInput}
                            projectId={projectId}
                            onChange={setFulltextInput}
                        />
                    </AuthShowContainer>
                )}
                <button
                    type="button"
                    className="Button reset"
                    onClick={handleReset}
                >
                    {t('reset')}
                    <FaUndo className="Icon" />
                </button>

                {
                    facets ?
                        <ArchiveFacets /> :
                        <Spinner withPadding />
                }
            </form>
        </div>
    );
}

ArchiveSearchForm.propTypes = {
    projectId: PropTypes.string,
    hideSidebar: PropTypes.func.isRequired,
    clearAllInterviewSearch: PropTypes.func.isRequired,
};
