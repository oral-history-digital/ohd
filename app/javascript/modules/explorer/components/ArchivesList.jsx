import classNames from 'classnames';
import PropTypes from 'prop-types';

import { ArchiveCard } from './ArchiveCard';

// TODO: Add skeleton loading state for the list of archives when the page is first loaded

export function ArchivesList({ archives }) {
    if (!archives || Object.keys(archives).length === 0) {
        return (
            <div className={classNames('archives-list')}>
                <div className={classNames('archives-list__content')}>
                    <h1 className={classNames('archives-list__title')}>
                        No Archives Found
                    </h1>
                    <p className={classNames('archives-list__description')}>
                        There are no archives available at the moment. Please
                        check back later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={classNames('archives-list')}>
            <div className={classNames('archives-list__content')}>
                <h1 className={classNames('archives-list__title')}>
                    Archive List
                </h1>
                {Object.values(archives).map((archive) => (
                    <ArchiveCard key={archive.id} archive={archive} />
                ))}
            </div>
        </div>
        // TODO: Add pagination here if we have a lot of archives in the future
    );
}

export default ArchivesList;

ArchivesList.propTypes = {
    archives: PropTypes.object.isRequired,
};
