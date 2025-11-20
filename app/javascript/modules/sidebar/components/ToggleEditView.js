import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { getEditView, changeToEditView } from 'modules/archive';
import { useI18n } from 'modules/i18n';

export default function ToggleEditView({ className }) {
    const { t } = useI18n();
    const editView = useSelector(getEditView);
    const dispatch = useDispatch();

    return (
        <div className={className}>
            <button
                type="button"
                className="Button Button--transparent Button--icon"
                onClick={() => dispatch(changeToEditView(!editView))}
                title="Switch edit view"
                aria-label="Switch edit view"
            >
                {editView ? (
                    <FaToggleOn className="Icon Icon--large u-vertical-align-bottom u-color-editorial" />
                ) : (
                    <FaToggleOff className="Icon Icon--large u-vertical-align-bottom u-color-text" />
                )}{' '}
                <span
                    className={classNames(
                        editView ? 'u-color-editorial' : 'u-color-text'
                    )}
                >
                    {t('admin.change_to_edit_view')}
                </span>
            </button>
        </div>
    );
}

ToggleEditView.propTypes = {
    className: PropTypes.string,
};
