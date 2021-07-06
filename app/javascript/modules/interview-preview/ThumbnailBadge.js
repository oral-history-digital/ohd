import PropTypes from 'prop-types';
import { FaAlignJustify } from 'react-icons/fa';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';

export default function ThumbnailBadge({
    numberOfSearchResults,
    className,
    onClick = f => f,
}) {
    const { t } = useI18n();

    return (
        <button
            type="button"
            className={classNames('ThumbnailBadge', className)}
            onClick={onClick}
            title={`${numberOfSearchResults} ${t('segment_hits')}`}
        >
            <FaAlignJustify className="ThumbnailBadge-icon" />
            <span className="ThumbnailBadge-text">
                {numberOfSearchResults}
            </span>
        </button>
    );
}

ThumbnailBadge.propTypes = {
    numberOfSearchResults: PropTypes.number.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
};
