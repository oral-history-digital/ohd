import PropTypes from 'prop-types';

import { useIsEditor } from 'modules/archive';
import { usePathBase } from 'modules/routes';

export default function EditViewOrRedirect({
    children
}) {
    const isEditor = useIsEditor();
    const pathBase = usePathBase();

    if (!isEditor) {
        document.location = `${pathBase()}`;
        return null;
    }

    return children;
}

EditViewOrRedirect.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
