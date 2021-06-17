import { useSelector } from 'react-redux';

import { useI18n } from 'modules/i18n';

import { getCurrentInterviewSearch } from 'modules/search';
import ResultList from './ResultList';
import modelsWithResults from './modelsWithResults';
import resultsForModel from './resultsForModel';
import PhotoResult from './PhotoResult';
import RegistryResult from './RegistryResult';
import TranscriptResult from './TranscriptResult';
import TocResult from './TocResult';

export default function InterviewSearchResults() {
    const searchResults = useSelector(getCurrentInterviewSearch);

    const filteredModelNames = modelsWithResults(searchResults);

    const { t, locale } = useI18n();

    if (filteredModelNames.length === 0) {
        return (
            <div>{t('modules.interview_search.no_results')}</div>
        );
    }

    const segments = resultsForModel(searchResults, 'Segment');
    const registryEntries = resultsForModel(searchResults, 'RegistryEntry');
    const biographicalEntries = resultsForModel(searchResults, 'BiographicalEntry');
    const photos = resultsForModel(searchResults, 'Photo');

    const filteredSegments = segments.filter(segment => segment.text[locale] !== '');
    const toc = segments.filter(segment => segment.text[locale] === '');

    return (
        <div>
            <ResultList
                tKey="segment"
                searchResults={filteredSegments}
                component={TranscriptResult}
            />
            <ResultList
                tKey="heading"
                searchResults={toc}
                component={TocResult}
            />
            <ResultList
                tKey="registryentry"
                searchResults={registryEntries}
                component={RegistryResult}
            />
            <ResultList
                tKey="biographicalentry"
                searchResults={biographicalEntries}
            />
            <ResultList
                tKey="photo"
                searchResults={photos}
                component={PhotoResult}
            />
        </div>
    );
}
