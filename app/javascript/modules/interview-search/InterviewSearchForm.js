import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaTimesCircle } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import { useSearchParams } from 'modules/query-string';
import { useProject } from 'modules/routes';
import useInterviewSearch from './useInterviewSearch';

export default function InterviewSearchForm({ archiveId }) {
    const { fulltext, setFulltext } = useSearchParams();
    const { project } = useProject();
    const { isLoading } = useInterviewSearch(archiveId, fulltext, project);

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
                    disabled={isLoading}
                    onClick={handleClear}
                >
                    <FaTimesCircle className="Icon Icon--primary" />
                </button>
                <button
                    type="submit"
                    className="Button Button--transparent Button--icon search-button"
                    disabled={isLoading}
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
