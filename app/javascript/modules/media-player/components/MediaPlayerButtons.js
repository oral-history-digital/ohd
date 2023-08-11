import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { FaEdit, FaSortAmountDown, FaSlash } from 'react-icons/fa';
import classNames from 'classnames';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';

export default function MediaPlayerButtons({
    autoScroll,
    interview,
    className,
    editViewEnabled,
    enableAutoScroll,
    disableAutoScroll,
    changeToInterviewEditView,
}) {
    const { t } = useI18n();

    function toggleAutoScroll() {
        if (autoScroll) {
            disableAutoScroll();
        } else {
            enableAutoScroll();
        }
    }

    useEffect(() => {
        if (!interview.transcript_coupled) {
            disableAutoScroll();
        }
    }, [interview.transcript_coupled]);

    const autoScrollButtonLabel = autoScroll ? t('modules.media_player.auto_scroll.disable') : t('modules.media_player.auto_scroll.enable')

    return (
        <div className={classNames(className)}>
            <AuthorizedContent object={{type: 'General'}} action='edit'>
                <button
                    className={classNames('StateButton', { 'is-pressed': editViewEnabled })}
                    type="button"
                    title={t(`edit_column_header.${editViewEnabled ? 'close_table' : 'open_table'}`)}
                    onClick={() => changeToInterviewEditView(!editViewEnabled)}
                >
                    <FaEdit className="StateButton-icon" />
                </button>
            </AuthorizedContent>

            { interview?.transcript_coupled ?
                <button
                    className={classNames('StateButton', { 'is-pressed': autoScroll })}
                    type="button"
                    aria-label={autoScrollButtonLabel}
                    title={autoScrollButtonLabel}
                    onClick={toggleAutoScroll}
                >
                    <FaSortAmountDown className="StateButton-icon" />
                </button> :
                <div className="StateButton-icon stacked">
                    <FaSortAmountDown />
                    <FaSlash className="red" />
                </div>
            }
        </div>
    );
}

MediaPlayerButtons.propTypes = {
    autoScroll: PropTypes.bool.isRequired,
    className: PropTypes.string,
    editViewEnabled: PropTypes.bool.isRequired,
    enableAutoScroll: PropTypes.func.isRequired,
    disableAutoScroll: PropTypes.func.isRequired,
    changeToInterviewEditView: PropTypes.func.isRequired,
};
