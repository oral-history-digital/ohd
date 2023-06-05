import classNames from 'classnames';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

export default function CurrentArchive({
    className,
}) {
    const project = useProject();
    const { locale } = useI18n();
    const name = project.display_name[locale] || project.name[locale];

    return (
        <div className={classNames(className)}>
            <div className="Sidebar-title">
                <b>
                    {name}
                </b>
            </div>

        </div>
    );
}

CurrentArchive.propTypes = {
    className: PropTypes.string,
};
