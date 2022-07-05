import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';
import classNames from 'classnames';

import { defaultTitle } from 'modules/interview-helpers';
import { UserContentFormContainer } from 'modules/workbook';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';

export default function MediaControls({
    className,
    tape: currentTape,
    interview,
    setTape,
}) {
    const { t, locale } = useI18n();

    function handleTapeChange(e) {
        setTape(Number.parseInt(e.target.value));
    }

    const tapes = [...Array(Number.parseInt(interview.tape_count)).keys()]
        .map(i => i + 1);

    return (
        <div className={classNames(className, 'MediaControls')}>
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

            <div className="MediaControls-buttons">
                <Modal
                    title={t('save_interview_reference') + ': ' + interview.short_title?.[locale]}
                    trigger={<><FaStar /> <span>{t('save_interview_reference')}</span></>}
                    triggerClassName="MediaControls-bookmark"
                >
                    {closeModal => (
                        <UserContentFormContainer
                            title={defaultTitle(interview, locale)}
                            description=""
                            properties={{title: interview.title}}
                            reference_id={interview.id}
                            reference_type='Interview'
                            media_id={interview.archive_id}
                            type='InterviewReference'
                            submitLabel={t('notice')}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            </div>
        </div>
    );
}

MediaControls.propTypes = {
    className: PropTypes.string,
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    tape: PropTypes.number.isRequired,
    translations: PropTypes.object.isRequired,
    mediaTime: PropTypes.number.isRequired,
    setTape: PropTypes.func.isRequired,
};
