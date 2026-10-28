import { changeToTranslationsView, getTranslationsView } from 'modules/archive';
import { getCurrentUser } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Switch } from 'modules/ui';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Toggles the sidebar's translations view while preserving the existing access rules.
 *
 * @param {Object} props - Component properties.
 * @param {string} [props.className] - Additional wrapper classes.
 * @returns {React.ReactElement|null} Sidebar switch when available.
 */
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
            <Switch
                checked={Boolean(translationsView)}
                onChange={(checked) =>
                    dispatch(changeToTranslationsView(checked))
                }
                color="var(--editorial-color)"
                size="md"
                className={
                    translationsView ? 'u-color-editorial' : 'u-color-text'
                }
                label={t('admin.change_to_translations_view')}
                title="Switch translations view"
                aria-label="Switch translations view"
            />
        </div>
    );
}

ToggleTranslationsView.propTypes = {
    className: PropTypes.string,
};
