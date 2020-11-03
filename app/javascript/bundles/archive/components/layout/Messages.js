import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { t } from '../../../../lib/utils';

function Messages(props) {

}

Messages.propTypes = {
    loggedInAt: PropTypes.number.isRequired,
    notifications: PropTypes.array.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
};

export default Messages;
