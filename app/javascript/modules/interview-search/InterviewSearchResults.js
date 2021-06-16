import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { Disclosure } from 'modules/ui';
import ResultList from './ResultList';
import modelsWithResults from './modelsWithResults';
import resultsForModel from './resultsForModel';

export default function InterviewSearchResults({
    searchResults,
}) {
    const filteredModelNames = modelsWithResults(searchResults);

    const { t } = useI18n();

    if (filteredModelNames.length === 0) {
        return (
            <div>{t('modules.interview_search.no_results')}</div>
        );
    }

    return filteredModelNames.map(modelName => (
        <Disclosure
            key={modelName}
            title={`${resultsForModel(searchResults, modelName).length} ${t(modelName.toLowerCase() + '_results')}`}
        >
            <ResultList
                model={modelName}
                searchResults={resultsForModel(searchResults, modelName)}
            />
        </Disclosure>
    ));
}

InterviewSearchResults.propTypes = {
    searchResults: PropTypes.object,
};
