import classNames from 'classnames';
import { changeToTranslationsView, getTranslationsView } from 'modules/archive';
import { getCurrentUser } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

export default function ToggleTranslationsView({ className }) {
    const { t } = useI18n();
    const user = useSelector(getCurrentUser);
    const translationsView = useSelector(getTranslationsView);
    const dispatch = useDispatch();

    const showToggleButton = user && Object.keys(user).length > 0 && user.admin;

    if (!showToggleButton) {
        return null;
    }

    return (
        <div className={className}>
            <button
                type="button"
                className="Button Button--transparent Button--icon"
                onClick={() =>
                    dispatch(changeToTranslationsView(!translationsView))
                }
                title="Switch translations view"
                aria-label="Switch translations view"
            >
                {translationsView ? (
                    <FaToggleOn className="Icon Icon--large u-vertical-align-bottom u-color-editorial" />
                ) : (
                    <FaToggleOff className="Icon Icon--large u-vertical-align-bottom u-color-text" />
                )}{' '}
                <span
                    className={classNames(
                        translationsView ? 'u-color-editorial' : 'u-color-text'
                    )}
                >
                    {t('admin.change_to_translations_view')}
                </span>
            </button>
        </div>
    );
}

ToggleTranslationsView.propTypes = {
    className: PropTypes.string,
};
