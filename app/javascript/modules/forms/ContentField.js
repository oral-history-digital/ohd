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
    let valueArray;

    if (!value) {
        valueArray = ['---'];
    } else if (Array.isArray(value)) {
        valueArray = value;
    } else {
        valueArray = [value];
    }

    return (
        <div className={classNames('ContentField', 'LoadingOverlay', className, {
            'is-loading': fetching,
        })}>
            {
                noLabel ?
                    null :
                    <span className="flyout-content-label">{label}: </span>
            }
            {valueArray.map(value => {
                return (
                    <span
                        key={value}
                        className={classNames('flyout-content-data', className)}
                    >
                        {linkUrls ? (
                            <ContentValueWithLinks>{value}</ContentValueWithLinks>
                        ) : value}
                    </span>
                );
            })}
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
