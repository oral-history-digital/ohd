import classNames from 'classnames';

export function CollectionPage() {
    // Reuse /app/javascript/modules/catalog/CollectionCatalogPage.js
    // This should display information (metadata) about a specific collection
    // Maybe it could work as an overlay covering only the right side of the screen,
    // so that you can still see the list of collections on the left and easily switch between them
    // Similar to Notion and Github
    return (
        <div className={classNames('collection-page')}>
            <div className={classNames('collection-page__content')}>
                <h1 className={classNames('collection-page__title')}>
                    Collection Page
                </h1>
                <p className={classNames('collection-page__description')}>
                    This is a placeholder for the Collection Page component. It
                    will display information about a specific collection.
                </p>
            </div>
        </div>
    );
}

export default CollectionPage;
