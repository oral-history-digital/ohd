import PropTypes from 'prop-types';
import { FaSortAmountDown } from 'react-icons/fa';
import classNames from 'classnames';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { InterviewEditButtonsContainer } from 'modules/interview-edit';

export default function MediaPlayerButtons({
    autoScroll,
    className,
    enableAutoScroll,
    disableAutoScroll,
}) {
    const { t } = useI18n();

    function toggleAutoScroll() {
        if (autoScroll) {
            disableAutoScroll();
        } else {
            enableAutoScroll();
        }
    }

    const autoScrollButtonLabel = autoScroll ? t('modules.media_player.auto_scroll.disable') : t('modules.media_player.auto_scroll.enable')

    return (
        <div className={classNames(className)}>
            <AuthorizedContent object={{type: 'General'}} action='edit'>
                <InterviewEditButtonsContainer />
            </AuthorizedContent>

            <button
                className={classNames('StateButton', { 'is-pressed': autoScroll })}
                type="button"
                aria-label={autoScrollButtonLabel}
                title={autoScrollButtonLabel}
                onClick={toggleAutoScroll}
            >
                <FaSortAmountDown className="StateButton-icon" />
            </button>
        </div>
    );
}

MediaPlayerButtons.propTypes = {
    autoScroll: PropTypes.bool.isRequired,
    className: PropTypes.string,
    enableAutoScroll: PropTypes.func.isRequired,
    disableAutoScroll: PropTypes.func.isRequired,
};
