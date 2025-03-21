import PropTypes from 'prop-types';
import { FaAlignJustify } from 'react-icons/fa';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';

export default function ThumbnailBadge({
    loading,
    numSearchResults,
    className,
    onClick = f => f,
}) {
    const { t } = useI18n();

    if (!loading && numSearchResults === 0) {
        return null;
    }

    return (
        <button
            type="button"
            className={classNames('ThumbnailBadge', className)}
            onClick={onClick}
            title={`${numSearchResults} ${t('segment_hits')}`}
        >
            {
                loading ? (
                    <Spinner small />
                ) : (
                    <>
                        <FaAlignJustify className="ThumbnailBadge-icon" />
                        <span className="ThumbnailBadge-text">
                            {numSearchResults}
                        </span>
                    </>
                )
            }
        </button>
    );
}

ThumbnailBadge.propTypes = {
    loading: PropTypes.bool,
    numSearchResults: PropTypes.number.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
};
