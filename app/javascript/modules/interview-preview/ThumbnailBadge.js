import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';

export default function ThumbnailBadge({
    loading,
    numSearchResults,
    className,
    onClick = (f) => f,
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
            title={t('show_segment_hits')}
        >
            {loading ? (
                <Spinner small />
            ) : (
                <>
                    <FaSearch className="ThumbnailBadge-icon" />
                    <span
                        className="ThumbnailBadge-text"
                        aria-label={`${numSearchResults} ${t('segment_hits')}`}
                    >
                        {numSearchResults}
                    </span>
                </>
            )}
        </button>
    );
}

ThumbnailBadge.propTypes = {
    loading: PropTypes.bool,
    numSearchResults: PropTypes.number.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
};
