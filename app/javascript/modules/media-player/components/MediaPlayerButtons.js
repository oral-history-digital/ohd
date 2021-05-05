import React from 'react';
import PropTypes from 'prop-types';
import { FaMagic } from 'react-icons/fa';
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

    console.log(className)

    function toggleAutoScroll() {
        if (autoScroll) {
            disableAutoScroll();
        } else {
            enableAutoScroll();
        }
    }

    return (
        <div className={classNames(className)}>
            <AuthorizedContent object={{type: 'General', action: 'edit'}}>
                <InterviewEditButtonsContainer />
            </AuthorizedContent>

            <button
                className={classNames('StateButton', { 'is-pressed': autoScroll })}
                type="button"
                title={autoScroll ? t('modules.media_player.auto_scroll_enabled') : t('modules.media_player.auto_scroll_disabled')}
                onClick={toggleAutoScroll}
            >
                <FaMagic className="StateButton-icon" />
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
