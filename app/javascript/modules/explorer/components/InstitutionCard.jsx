import classNames from 'classnames';

export function InstitutionCard() {
    return (
        <div className={classNames('institution-card')}>
            <div className={classNames('institution-card__content')}>
                <h1 className={classNames('institution-card__title')}>
                    Institution Card
                </h1>
                <p className={classNames('institution-card__description')}>
                    This is a placeholder for the Institution Card component. It
                    will display information about an institution, such as its
                    name, location, and a link to view more details.
                </p>
            </div>
        </div>
    );
}

export default InstitutionCard;
