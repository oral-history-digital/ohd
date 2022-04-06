import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';

/**
  * width is in percent - points in decimal numbers are replaced by '-'
  * the classes have to exist in grid.scss.
  * have a look for examples
  */

export default function WorkflowHeader({
    sortable,
    order,
    tKey,
    width,
    onClick,
}) {
    const { t } = useI18n();
    const isActive = typeof order === 'string';

    function handleClick() {
        onClick(sortable, order || 'asc');
    }

    return (
        <div className={`box-${width} header`}>
            {
                sortable ? (
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        onClick={handleClick}
                    >
                        <span className={classNames({
                            'u-bold': isActive,
                        })}>
                            {t(tKey)}
                        </span>
                        {
                            isActive && (
                                order === 'asc' ?
                                    <FaAngleUp className="Icon Icon--text" /> :
                                    <FaAngleDown className="Icon Icon--text" />
                            )
                        }
                    </button>
                ) : (
                    <span className="u-normal">{t(tKey)}</span>
                )
            }
        </div>
    );
}

WorkflowHeader.propTypes = {
    sortable: PropTypes.string,
    order: PropTypes.string,
    tKey: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    onClick: PropTypes.func,
};
