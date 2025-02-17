import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function ActivationFlow({
    active,
    className,
}) {
    return (
        <ol className={classNames('Flow', className)}>
            <li className={classNames('Flow-item', {'Flow-item--active': active == 1})}
                title={active == 1 ? '' : 'In oh.d registrieren oder anmelden'}>
                <span className="Flow-text">
                    In oh.d registrieren oder anmelden
                </span>
            </li>
            <li className={classNames('Flow-item', {'Flow-item--active': active == 2})}
                title={active == 2 ? '' : 'Freischaltung im Archiv beantragen'}>
                <span className="Flow-text">
                    Freischaltung im Archiv beantragen
                </span>
            </li>
            <li className={classNames('Flow-item', {'Flow-item--active': active == 3})}
                title={active == 3 ? '' : 'Freischaltung im Archiv abwarten'}>
                <span className="Flow-text">
                    Freischaltung im Archiv abwarten
                </span>
            </li>
        </ol>
    );
}

ActivationFlow.propTypes = {
    active: PropTypes.oneOf([1, 2, 3]).isRequired,
    className: PropTypes.string,
};
