import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import useSearchSuggestions from '../useSearchSuggestions';

export default function ArchiveSearchFormInput({ value, projectId, onChange }) {
    const { t, locale } = useI18n();
    const { allInterviewsPseudonyms, allInterviewsTitles } =
        useSearchSuggestions();

    let titles = [];
    if (allInterviewsTitles && allInterviewsPseudonyms) {
        titles = allInterviewsTitles
            .concat(allInterviewsPseudonyms)
            .map((title) => title?.[locale])
            .filter((title) => title)
            .filter((title) => title !== 'no interviewee given')
            .filter(onlyUnique);
    }

    return (
        <div className="flyout-search-input">
            <input
                className="search-input"
                type="search"
                name="fulltext"
                value={value || ''}
                placeholder={t(
                    projectId === 'dg' ? 'enter_field_dg' : 'enter_field'
                )}
                onChange={(event) => onChange(event.target.value)}
                list="allInterviewTitles"
            />
            <datalist id="allInterviewTitles">
                {titles.map((title) => (
                    <option key={title} value={`"${title}"`} />
                ))}
            </datalist>
            <button
                type="submit"
                id="search-button"
                className="Button Button--transparent Button--icon search-button"
                title={t('archive_search')}
            >
                <FaSearch />
            </button>
        </div>
    );
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

ArchiveSearchFormInput.propTypes = {
    value: PropTypes.string,
    projectId: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};
