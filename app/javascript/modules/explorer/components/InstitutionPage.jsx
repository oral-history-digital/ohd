import classNames from 'classnames';

export function InstitutionPage() {
    // Reuse /app/javascript/modules/catalog/InstitutionCatalogPage.js
    // This should display information (metadata) about a specific institution
    // Maybe it could work as an overlay covering only the right side of the screen,
    // so that you can still see the list of institutions on the left and easily switch between them
    // Similar to Notion and Github
    return (
        <div className={classNames('institution-page')}>
            <div className={classNames('institution-page__content')}>
                <h1 className={classNames('institution-page__title')}>
                    Institution Page
                </h1>
                <p className={classNames('institution-page__description')}>
                    This is a placeholder for the Institution Page component. It
                    will display information about a specific institution.
                </p>
            </div>
        </div>
    );
}

export default InstitutionPage;
