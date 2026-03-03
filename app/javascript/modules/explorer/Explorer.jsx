import classNames from 'classnames';

import { ArchivesList } from './components';
import { useGetArchives, useGetCollections, useGetInstitutions } from './hooks';

export function Explorer() {
    const {
        data: archives,
        loading: loadingArchives,
        error: errorArchives,
    } = useGetArchives();
    const {
        data: collections,
        loading: loadingCollections,
        error: errorCollections,
    } = useGetCollections();
    const {
        data: institutions,
        loading: loadingInstitutions,
        error: errorInstitutions,
    } = useGetInstitutions();
    console.log('Archives:', archives);
    console.log('Collections:', collections);
    console.log('Institutions:', institutions);

    const isLoading =
        loadingArchives || loadingCollections || loadingInstitutions;
    const hasError = errorArchives || errorCollections || errorInstitutions;

    if (isLoading) {
        return (
            <div className={classNames('explorer')}>
                <div className={classNames('explorer__content')}>
                    <h1 className={classNames('explorer__title')}>
                        Loading...
                    </h1>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className={classNames('explorer')}>
                <div className={classNames('explorer__content')}>
                    <h1 className={classNames('explorer__title')}>Error</h1>
                    <p className={classNames('explorer__description')}>
                        An error occurred while fetching data. Please try again
                        later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={classNames('explorer')}>
            <div className={classNames('explorer__content')}>
                <h1 className={classNames('explorer__title')}>Explorer</h1>
                <p className={classNames('explorer__description')}>
                    This is the explorer page. It will contain various tools and
                    features to help you explore the interview data.
                </p>
                {/* 
                Add Tabs here to switch between Archives and Institutions 
                See app/javascript/modules/interview/components/InterviewTabs.js for an example
                */}
                <ArchivesList archives={archives} />
            </div>
        </div>
    );
}

export default Explorer;
