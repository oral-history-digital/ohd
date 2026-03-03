import classNames from 'classnames';
import { isEmptyHtml, sanitizeHtml } from 'modules/utils';
import PropTypes from 'prop-types';

import { useGetCollections } from '../hooks';

export function ArchiveCard({ archive }) {
    const { collections } = useGetCollections(archive.id); // TODO: Use skip to load collections only when the card is expanded

    // TODO: Add skeleton loading state for collections when the card is expanded

    return (
        // Should be expandable. When expanded, include collections
        <div className={classNames('archive-card')}>
            <div className={classNames('archive-card__content')}>
                <h3 className={classNames('archive-card__title')}>
                    {archive.display_name || archive.name}
                </h3>
                <p className={classNames('archive-card__description')}>
                    {isEmptyHtml(archive.introduction) ? (
                        <span>No introduction available.</span>
                    ) : (
                        <span
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(archive.introduction),
                            }}
                        />
                    )}
                </p>
                <div className={classNames('archive-card__stats')}>
                    <div className={classNames('archive-card__stat')}>
                        <span
                            className={classNames('archive-card__stat-label')}
                        >
                            Interviews:{' '}
                        </span>
                        <span
                            className={classNames('archive-card__stat-value')}
                        >
                            {archive.interviews?.total || 0}
                        </span>
                    </div>
                    <div className={classNames('archive-card__stat')}>
                        <span
                            className={classNames('archive-card__stat-label')}
                        >
                            Collections:{' '}
                        </span>
                        <span
                            className={classNames('archive-card__stat-value')}
                        >
                            {collections?.length || 0}
                        </span>
                    </div>
                </div>
                {archive.available_locales && (
                    <div className={classNames('archive-card__locales')}>
                        <span className={classNames('archive-card__label')}>
                            Languages:{' '}
                        </span>
                        {archive.available_locales.join(', ')}
                    </div>
                )}
                {archive.publication_date && (
                    <div className={classNames('archive-card__date')}>
                        Published:{' '}
                        {new Date(
                            archive.publication_date
                        ).toLocaleDateString()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ArchiveCard;

ArchiveCard.propTypes = {
    archive: PropTypes.object.isRequired,
};
