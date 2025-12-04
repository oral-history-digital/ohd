import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

/**
 * width is in percent - points in decimal numbers are replaced by '-'
 * the classes have to exist in grid.scss.
 * have a look for examples
 */

export default function WorkflowHeader({ tKey, width }) {
    const { t } = useI18n();

    return (
        <div className={`box-${width} header`}>
            <span className="u-normal">{t(tKey)}</span>
        </div>
    );
}

WorkflowHeader.propTypes = {
    tKey: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
};
