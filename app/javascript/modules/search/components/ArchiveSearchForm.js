import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaUndo } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import { AuthShowContainer } from 'modules/auth';
import { isMobile } from 'modules/user-agent';
import { useSearchParams } from 'modules/query-string';
import ArchiveFacets from './ArchiveFacets';
import ArchiveSearchFormInput from './ArchiveSearchFormInput';

export default function ArchiveSearchForm({
    projectId,
    hideSidebar,
}) {
    const { t } = useI18n();
    const formEl = useRef(null);

    const { fulltext, setFulltextAndSort, resetSearchParams } = useSearchParams();

    const [fulltextInput, setFulltextInput] = useState(fulltext);

    useEffect(() => {
        setFulltextInput(fulltext || '');
    }, [fulltext])

    function handleReset() {
        resetSearchParams();

        if (isMobile()) {
            hideSidebar();
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        const searchTerm = fulltextInput?.trim();

        if (searchTerm?.length > 0)  {
            setFulltextAndSort(searchTerm, 'relevance', 'desc');
        } else {
            setFulltextInput('');

            // Set defaults. TODO: add random option.
            setFulltextAndSort(undefined, 'title', 'asc');
        }

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

                <ArchiveFacets />
            </form>
        </div>
    );
}

ArchiveSearchForm.propTypes = {
    projectId: PropTypes.string,
    hideSidebar: PropTypes.func.isRequired,
};
