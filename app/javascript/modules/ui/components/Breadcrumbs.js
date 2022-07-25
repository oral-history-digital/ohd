import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Breadcrumbs({
    className,
    children,
}) {
    return (
        <div className={classNames('Breadcrumbs', className)}>
            {Array.isArray(children) ?
                children.map((child, index) => {
                    if (index === children.length - 1) {
                        return (
                            <span className="Breadcrumbs-lastItem">
                                {child}
                            </span>
                        );
                    } else {
                        return (<>
                            {child}
                            <span className="Breadcrumbs-separator">/</span>
                        </>);
                    }
                }) :
                children
            }
        </div>
    );
}

Breadcrumbs.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
