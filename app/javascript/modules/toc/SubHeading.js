import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { AuthorizedContent } from 'modules/auth';
import SegmentHeadingFormContainer from './SegmentHeadingFormContainer';
import formatTimecode from './formatTimecode';
import styles from './SubHeading.module.scss';

export default function SubHeading({
    data,
    active,
    sendTimeChangeRequest,
}) {
    const { t } = useI18n();

    return (
        <div className={styles.container}>
            <button
                type="button"
                className={classNames(styles.main, {
                    [styles.active]: active,
                })}
                onClick={() => sendTimeChangeRequest(data.tape_nbr, data.time)}
            >
                <span className={styles.chapter}>
                    {data.chapter}
                </span>

                <div>
                    <div className={styles.heading}>
                        {data.heading}
                    </div>

                    <div className={styles.timecode}>
                        {t('tape')} {data.tape_nbr} | {formatTimecode(data.time)}
                    </div>
                </div>
            </button>

            <AuthorizedContent object={data.segment} action='update'>
                <Modal
                    title=""
                    trigger={<i className="fa fa-pencil" />}
                >
                    {closeModal => (
                        <SegmentHeadingFormContainer
                            segment={data.segment}
                            onSubmit={closeModal}
                        />
                    )}
                </Modal>
            </AuthorizedContent>
        </div>
    );
}

SubHeading.propTypes = {
    data: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
