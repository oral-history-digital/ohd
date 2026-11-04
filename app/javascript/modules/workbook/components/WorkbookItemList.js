import { useMemo, useState } from 'react';

import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';

import WorkbookItemContainer from './WorkbookItemContainer';

/**
 * Groups workbook entries, filtering to the current project outside the umbrella.
 *
 * @param {Object} props - List properties.
 * @param {string} props.type - Workbook section's translation key.
 * @param {Object[]} [props.contents] - Entries in their saved order.
 * @returns {React.ReactElement} Collapsible workbook section.
 */
export default function WorkbookItemList({ type, contents }) {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    const { project, isLoading, error } = useProject();

    const items = useMemo(() => {
        if (project?.is_umbrella) {
            return contents || [];
        }

        return (
            contents?.filter((item) => item.project_id === project?.id) || []
        );
    }, [contents, project?.is_umbrella, project?.id]);

    /** Toggles the section without changing its saved entry order. */
    function handleClick() {
        setOpen((prev) => !prev);
    }

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (isLoading || !project) return <Spinner />;

    return (
        <div className="userContents">
            <button
                type="button"
                className={classNames('Button', 'accordion', { active: open })}
                onClick={handleClick}
            >
                {t(type)}
                {open ? (
                    <FaMinus className="Icon Icon--primary" />
                ) : (
                    <FaPlus className="Icon Icon--primary" />
                )}
            </button>
            <div className={classNames('panel', { open: open })}>
                {items.map((item, index, array) => (
                    <WorkbookItemContainer
                        key={item.id}
                        data={item}
                        className={index < array.length - 1 ? 'u-mb' : null}
                    />
                ))}
            </div>
        </div>
    );
}

WorkbookItemList.propTypes = {
    type: PropTypes.oneOf([
        'saved_searches',
        'saved_interviews',
        'saved_annotations',
    ]).isRequired,
    contents: PropTypes.array,
};
