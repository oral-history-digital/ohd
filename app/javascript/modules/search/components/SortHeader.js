import PropTypes from 'prop-types';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';

/**
  * width is in percent - points in decimal numbers are replaced by '-'
  * the classes have to exist in grid.scss.
  * have a look for examples
  */

export default function SortHeader({
    sortColumn,
    direction,
    tKey,
    width,
    onClick,
}) {
    const { t } = useI18n();

    console.log(direction);

    return (
        <div className={`box-${width} header`}>
            {t(tKey)}

            {
                sortColumn && (
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        onClick={() => onClick(sortColumn, direction === 'asc' ? 'desc' : 'asc')}
                    >
                        {
                            direction === 'desc' ?
                                <FaAngleDown className="Icon Icon--text" /> :
                                <FaAngleUp className="Icon Icon--text" />
                        }
                    </button>
                )
            }
        </div>
    );
}

SortHeader.propTypes = {
    sortColumn: PropTypes.string,
    direction: PropTypes.string,
    tKey: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
};
