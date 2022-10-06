import PropTypes from 'prop-types';
import classNames from 'classnames';

import ContentValueWithLinks from './ContentValueWithLinks';

function ContentField({
    label,
    value,
    noLabel = false,
    linkUrls = false,
    fetching = false,
    className,
    children,
}) {
    let displayedValue = '---';

    if (value) {
        if (linkUrls) {
            displayedValue = <ContentValueWithLinks>{value}</ContentValueWithLinks>;
        } else {
            displayedValue = value;
        }
    }

    return (
        <div className={classNames('ContentField', 'LoadingOverlay', className, {
            'is-loading': fetching,
        })}>
            {
                noLabel ?
                    null :
                    <span className="flyout-content-label">{label}:</span>
            }
            <span className={classNames('flyout-content-data', className)}>
                {displayedValue}
            </span>
            {children}
        </div>
    );
}

ContentField.propTypes = {
    label: PropTypes.string.isRequired,
    noLabel: PropTypes.bool,
    linkUrls: PropTypes.bool,
    value: PropTypes.string.isRequired,
    fetching: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
};

export default ContentField;
