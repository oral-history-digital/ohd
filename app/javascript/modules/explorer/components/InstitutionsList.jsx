import classNames from 'classnames';

export function InstitutionsList() {
    return (
        <div className={classNames('institutions-list')}>
            <div className={classNames('institutions-list__content')}>
                <h1 className={classNames('institutions-list__title')}>
                    Institutions List
                </h1>
                <p className={classNames('institutions-list__description')}>
                    This is a placeholder for the Institutions List component.
                    It will display a list of institutions, along with their
                    names, descriptions, and links to view more details about
                    each institution. Users will be able to click on an
                    institution to view its collections and related archives.
                </p>
            </div>
        </div>
    );
}

export default InstitutionsList;
