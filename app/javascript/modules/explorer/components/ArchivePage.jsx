import classNames from 'classnames';

export function ArchivePage() {
    // Reuse /app/javascript/modules/catalog/ArchiveCatalogPage.js
    // This should display information (metadata) about a specific archive
    // Maybe it could work as an overlay covering only the right side of the screen,
    // so that you can still see the list of archives on the left and easily switch between them
    // Similar to Notion and Github
    return (
        <div className={classNames('archive-page')}>
            <div className={classNames('archive-page__content')}>
                <h1 className={classNames('archive-page__title')}>
                    Archive Page
                </h1>
                <p className={classNames('archive-page__description')}>
                    This is a placeholder for the Archive Page component. It
                    will display information about a specific archive.
                </p>
            </div>
        </div>
    );
}

export default ArchivePage;
