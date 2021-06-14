import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaMinus } from 'react-icons/fa';
import classNames from 'classnames';

import { pluralize } from 'modules/strings';
import { useI18n } from 'modules/i18n';
import ResultListContainer from './ResultListContainer';
import { MODEL_NAMES } from './constants';

export default function InterviewSearchResults({
    isInterviewSearching,
    interview,
    searchResults,
}) {
    const [isOpen, setIsOpen] = useState(Array(MODEL_NAMES.length).fill(false));
    const { t } = useI18n();

    function handleClick(index) {
        const nextIsOpen = isOpen.slice();
        nextIsOpen[index] = !nextIsOpen[index]
        setIsOpen(nextIsOpen);
    }

    return MODEL_NAMES.map((model, modelIndex) => {
        return !isInterviewSearching && searchResults && (
            <div
                key={modelIndex}
                className="SearchResults u-mt"
            >
                <button
                    type="button"
                    className="SearchResults-toggle"
                    aria-label="Toggle results"
                    onClick={() => handleClick(modelIndex)}
                >
                    {isOpen[modelIndex] ?
                        <FaMinus className="SearchResults-toggleIcon" /> :
                        <FaPlus className="SearchResults-toggleIcon" />
                    }
                    <h3 className="SearchResults-heading">
                        {searchResults[`found${pluralize(model)}`] ? searchResults[`found${pluralize(model)}`].length : 0}
                        {' '}
                        {t(model.toLowerCase() + '_results')}
                    </h3>
                </button>
                <div className={classNames('SearchResults-results', { 'is-expanded': isOpen[modelIndex] })}>
                    <ResultListContainer
                        model={model}
                        searchResults={searchResults}
                        interview={interview}
                    />
                </div>
            </div>
        );
    });
}

InterviewSearchResults.propTypes = {
    interview: PropTypes.object.isRequired,
    isInterviewSearching: PropTypes.bool.isRequired,
    searchResults: PropTypes.object,
};
