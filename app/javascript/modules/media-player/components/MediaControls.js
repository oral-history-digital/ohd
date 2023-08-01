import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';
import classNames from 'classnames';

import { WorkbookItemFormContainer } from 'modules/workbook';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Modal, CopyText } from 'modules/ui';
import { formatTimecode } from 'modules/interview-helpers';

export default function MediaControls({
    className,
    tape: currentTape,
    mediaTime,
    interview,
    setTape,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    const tapes = [...Array(Number.parseInt(interview.tape_count)).keys()]
        .map(i => i + 1);

    function handleTapeChange(e) {
        setTape(Number(e.target.value));
    }

    function positionUrl() {
        const protocol = window.location.protocol;
        const host = window.location.host;
        const interviewId = interview.archive_id;
        const timeCode = formatTimecode(mediaTime, true);
        return `${protocol}//${host}${pathBase}/interviews/${interviewId}?tape=${currentTape}&time=${timeCode}`;
    }

    const showMediaControls = !interview.media_missing;

    return (
        <div className={classNames(className, 'MediaControls')}>
            {showMediaControls && (
                <div className="MediaControls-selects">
                {
                    tapes.length > 1 && (
                        <select
                            value={currentTape}
                            onChange={handleTapeChange}
                            className="MediaControls-tapeSelector"
                        >
                            {
                                tapes.map(tape => (
                                    <option key={tape} value={tape}>
                                        {t('tape')} {tape}
                                    </option>
                                ))
                            }
                        </select>
                    )
                }
                </div>
            )}

            <div className="MediaControls-buttons">
                <Modal
                    title={t('save_interview_reference_tooltip')}
                    trigger={<><FaStar /> <span>{t('save_interview_reference')}</span></>}
                    triggerClassName="MediaControls-bookmark"
                >
                    {closeModal => (
                        <WorkbookItemFormContainer
                            description=""
                            properties={{title: interview.title}}
                            reference_id={interview.id}
                            reference_type='Interview'
                            media_id={interview.archive_id}
                            type='InterviewReference'
                            submitLabel={t('modules.workbook.bookmark')}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
                {showMediaControls && (
                    <CopyText
                        className="MediaControls-bookmark"
                        iconClassName="Icon--white"
                        text={positionUrl()}
                        title={t('modules.media_player.copy_position_tooltip')}
                    >
                        {t('modules.media_player.copy_position')}
                    </CopyText>
                )}
            </div>
        </div>
    );
}

MediaControls.propTypes = {
    className: PropTypes.string,
    interview: PropTypes.object.isRequired,
    tape: PropTypes.number.isRequired,
    mediaTime: PropTypes.number.isRequired,
    setTape: PropTypes.func.isRequired,
};
