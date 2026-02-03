import classNames from 'classnames';
import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaStickyNote, FaTag } from 'react-icons/fa';

export default function SegmentButtons({
    segment,
    setActiveButton,
    onEditStart,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();

    const showEditButton = isAuthorized(segment, 'update');

    const showAnnotationsButton = isAuthorized(
        { type: 'Annotation', interview_id: segment.interview_id },
        'update'
    );
    const showReferencesButton = isAuthorized(
        { type: 'RegistryReference', interview_id: segment.interview_id },
        'update'
    );

    const handleEditClick = () => {
        if (onEditStart) {
            onEditStart('edit');
        } else {
            setActiveButton('edit');
        }
    };
    const handleAnnotationsClick = () => {
        if (onEditStart) {
            onEditStart('annotations');
        } else {
            setActiveButton('annotations');
        }
    };
    const handleReferencesClick = () => {
        if (onEditStart) {
            onEditStart('references');
        } else {
            setActiveButton('references');
        }
    };

    return (
        <div className={classNames('Segment-buttons')}>
            {showEditButton && (
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    title={t('edit.segment.transcript')}
                    onClick={handleEditClick}
                >
                    <FaPencilAlt className="Icon Icon--editorial" />
                </button>
            )}
            {showAnnotationsButton && (
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    title={t('edit.segment.annotations.new')}
                    onClick={handleAnnotationsClick}
                >
                    <FaStickyNote
                        className={classNames('Icon', 'Icon--primary')}
                    />
                </button>
            )}
            {showReferencesButton && (
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    title={t('edit.segment.references.new')}
                    onClick={handleReferencesClick}
                >
                    <FaTag className={classNames('Icon', 'Icon--primary')} />
                </button>
            )}
        </div>
    );
}

SegmentButtons.propTypes = {
    segment: PropTypes.object.isRequired,
    setActiveButton: PropTypes.func.isRequired,
    onEditStart: PropTypes.func,
};
