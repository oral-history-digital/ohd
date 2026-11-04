import { changeToEditView, getEditView } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { Switch } from 'modules/ui';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Toggles the sidebar's edit view while preserving the existing access rules.
 *
 * @param {Object} props - Component properties.
 * @param {string} [props.className] - Additional wrapper classes.
 * @returns {React.ReactElement|null} Sidebar switch when available.
 */
export default function ToggleEditView({ className }) {
    const { t } = useI18n();
    const editView = useSelector(getEditView);
    const dispatch = useDispatch();

    return (
        <div className={className}>
            <Switch
                checked={Boolean(editView)}
                onChange={(checked) => dispatch(changeToEditView(checked))}
                color="var(--editorial-color)"
                size="md"
                className={editView ? 'u-color-editorial' : 'u-color-text'}
                label={t('admin.change_to_edit_view')}
                title="Switch edit view"
                aria-label="Switch edit view"
                data-testid="toggle-edit-view-button"
            />
        </div>
    );
}

ToggleEditView.propTypes = {
    className: PropTypes.string,
};
