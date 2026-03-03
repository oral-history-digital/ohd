import classNames from 'classnames';

export function CollectionCard() {
    return (
        <div className={classNames('collection-card')}>
            <div className={classNames('collection-card__content')}>
                <h1 className={classNames('collection-card__title')}>
                    Collection Card
                </h1>
                <p className={classNames('collection-card__description')}>
                    This is a placeholder for the Collection Card component. It
                    will display information about a collection, such as its
                    title, description, and a link to view more details.
                </p>
            </div>
        </div>
    );
}

export default CollectionCard;
