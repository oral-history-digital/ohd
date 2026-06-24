import { useMemo, useState } from 'react';

import classNames from 'classnames';
import { getProjects, useHydrateProjectsByIds } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import WorkbookItemContainer from './WorkbookItemContainer';

export default function WorkbookItemList({ type, contents }) {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    const { project, isOhd } = useProject();
    const projects = useSelector(getProjects);

    const items = useMemo(() => {
        if (isOhd) {
            return contents || [];
        }

        return (
            contents?.filter((item) => item.project_id === project?.id) || []
        );
    }, [contents, isOhd, project?.id]);

    const projectIds = useMemo(
        () => items.map((item) => item.project_id),
        [items]
    );

    // Hydrate projects for the items in the list
    // TODO: This is a temporary solution that should be replaced once project loading is unified
    useHydrateProjectsByIds(projectIds);

    function handleClick() {
        setOpen((prev) => !prev);
    }

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
                {items.map((item, index, array) => {
                    const itemProject =
                        projects?.[item.project_id] ||
                        (project?.id === item.project_id ? project : undefined);

                    return (
                        <WorkbookItemContainer
                            key={item.id}
                            data={item}
                            project={itemProject}
                            className={index < array.length - 1 ? 'u-mb' : null}
                        />
                    );
                })}
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
