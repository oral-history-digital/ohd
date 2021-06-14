import { useState } from 'react';
import PropTypes from 'prop-types';

import { PixelLoader } from 'modules/spinners';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function InterviewSearchForm({
    archiveId,
    isInterviewSearching,
    interviewFulltext,
    searchInInterview,
}) {
    const [searchTerm, setSearchTerm] = useState(interviewFulltext || '');
    const pathBase = usePathBase();
    const { t } = useI18n();

    function handleSubmit(event) {
        event.preventDefault();
        searchInInterview(`${pathBase}/searches/interview`, {fulltext: searchTerm, id: archiveId});
    }

    return (
        <div className="content-search">
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="search"
                        className="search-input"
                        value={searchTerm}
                        onChange={event => setSearchTerm(event.target.value)}
                        placeholder={t('enter_search_field')}
                    />
                </label>
                <input type="submit" value="" className="search-button" />
            </form>

            {isInterviewSearching && <PixelLoader />}
        </div>
    );
}

InterviewSearchForm.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interviewFulltext: PropTypes.string,
    isInterviewSearching: PropTypes.bool,
    searchInInterview: PropTypes.func.isRequired,
};
