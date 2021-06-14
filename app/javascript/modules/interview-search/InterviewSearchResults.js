import { useReducer } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaMinus } from 'react-icons/fa';
import classNames from 'classnames';

import { pluralize } from 'modules/strings';
import { useI18n } from 'modules/i18n';
import ResultListContainer from './ResultListContainer';
import { MODEL_NAMES } from './constants';
import reducer from './reducer';

export default function InterviewSearchResults({
    interview,
    searchResults,
}) {
    const modelsWithResults = MODEL_NAMES
        .filter(name => searchResults?.[`found${pluralize(name)}`]?.length > 0)

    const initialState = modelsWithResults.reduce((acc, name) => {
        acc[name] = false;
        return acc;
    }, {});

    const [state, dispatch] = useReducer(reducer, initialState);
    const { t } = useI18n();

    function handleClick(model) {
        dispatch({
            type: 'TOGGLE',
            payload: model,
        });
    }

    if (!searchResults) {
        return null;
    }

    if (modelsWithResults.length === 0) {
        return (
            <div>No results</div>
        );
    }

    return modelsWithResults.map(modelName => (
        <div
            key={modelName}
            className="SearchResults u-mt"
        >
            <button
                type="button"
                className="SearchResults-toggle"
                aria-label="Toggle results"
                onClick={() => handleClick(modelName)}
            >
                {state[modelName] ?
                    <FaMinus className="SearchResults-toggleIcon" /> :
                    <FaPlus className="SearchResults-toggleIcon" />
                }
                <h3 className="SearchResults-heading">
                    {searchResults[`found${pluralize(modelName)}`].length}
                    {' '}
                    {t(modelName.toLowerCase() + '_results')}
                </h3>
            </button>
            <div className={classNames('SearchResults-results', { 'is-expanded': state[modelName] })}>
                <ResultListContainer
                    model={modelName}
                    searchResults={searchResults[`found${pluralize(modelName)}`]}
                    interview={interview}
                />
            </div>
        </div>
    ));
}

InterviewSearchResults.propTypes = {
    interview: PropTypes.object.isRequired,
    searchResults: PropTypes.object,
};
