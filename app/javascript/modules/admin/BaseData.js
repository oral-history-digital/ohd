import { createElement } from 'react';
import PropTypes from 'prop-types';

export default function BaseData({ name, data, scope, showComponent }) {
    if (showComponent) {
        return createElement(showComponent, { data, scope });
    } else {
        return (
            <div className="base-data box">
                <p className="name">{name}</p>
            </div>
        );
    }
}

BaseData.propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    showComponent: PropTypes.element,
};
