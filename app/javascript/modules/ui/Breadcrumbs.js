import { Fragment } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function Breadcrumbs({ className, children }) {
    return (
        <div className={classNames('Breadcrumbs', className)}>
            {Array.isArray(children)
                ? children.map((child, index) => {
                      if (index === children.length - 1) {
                          return (
                              <span
                                  key={index}
                                  className="Breadcrumbs-lastItem"
                              >
                                  {child}
                              </span>
                          );
                      } else {
                          return (
                              <Fragment key={index}>
                                  {child}
                                  <span className="Breadcrumbs-separator">
                                      /
                                  </span>
                              </Fragment>
                          );
                      }
                  })
                : children}
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
