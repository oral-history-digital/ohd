import { useEffect, useState } from 'react';

import { useI18n } from 'modules/i18n';
import { useSearchParams } from 'modules/query-string';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { FaSearch, FaTimesCircle } from 'react-icons/fa';

import useInterviewSearch from './useInterviewSearch';

/**
 * Edits the interview search term stored in the URL.
 *
 * @param {Object} props - Search target.
 * @param {string} props.archiveId - Public interview identifier.
 * @returns {React.ReactElement} Search form, disabled while project settings or results load.
 */
export default function InterviewSearchForm({ archiveId }) {
    const { fulltext, setFulltext } = useSearchParams();
    const { project, isLoading: projectIsLoading, error } = useProject({});
    const { isLoading } = useInterviewSearch(archiveId, fulltext, project);
    const disabled = Boolean(
        projectIsLoading || !project || error || isLoading
    );

    const [searchTerm, setSearchTerm] = useState(fulltext);
    const { t } = useI18n();

    useEffect(() => {
        setSearchTerm(fulltext);
    }, [fulltext]);

    function handleSubmit(event) {
        event.preventDefault();

        const trimmedTerm = searchTerm ? searchTerm.trim() : '';

        if (trimmedTerm.length > 0) {
            setFulltext(trimmedTerm);
        } else {
            setFulltext(undefined);
        }
    }

    function handleClear() {
        setSearchTerm('');
        setFulltext(undefined);
    }

    return (
        <div className="content-search">
            <form className="content-search-form" onSubmit={handleSubmit}>
                <input
                    type="search"
                    className="search-input"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder={t('enter_search_field')}
                    aria-label={t('enter_search_field')}
                />
                <button
                    type="button"
                    className="Button Button--transparent Button--icon search-button"
                    disabled={disabled}
                    onClick={handleClear}
                >
                    <FaTimesCircle className="Icon Icon--primary" />
                </button>
                <button
                    type="submit"
                    className="Button Button--transparent Button--icon search-button"
                    disabled={disabled}
                >
                    <FaSearch className="Icon Icon--primary" />
                </button>
            </form>
        </div>
    );
}

InterviewSearchForm.propTypes = {
    archiveId: PropTypes.string.isRequired,
};
