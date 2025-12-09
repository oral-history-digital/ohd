import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function SearchSpinnerOverlay({
    loading = false,
    className,
    children,
}) {
    return (
        <div
            className={classNames('SearchSpinnerOverlay', className, {
                'is-loading': loading,
            })}
        >
            <>
                <div className="SearchSpinnerOverlay-outer">
                    <div className="SearchSpinnerOverlay-inner">
                        <div className="SearchSpinnerOverlay-content">
                            <span className="SearchSpinnerOverlay-spinner" />
                        </div>
                    </div>
                </div>
                {children}
            </>
        </div>
    );
}

SearchSpinnerOverlay.propTypes = {
    loading: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
