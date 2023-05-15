import classNames from 'classnames';
import PropTypes from 'prop-types';

import { useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function CurrentArchive({
  className,
}) {
  const project = useProject();
  const { locale } = useI18n();

  let name;
  if (project) {
    name = project.display_name[locale] || project.name[locale];
  } else {
    // To be replaced by new OHD project's name:
    name = 'Oral History.Digital';
  }

  return (
    <p className={classNames(className)}>
      <b>
        {name}
      </b>
    </p>
  );
}

CurrentArchive.propTypes = {
  className: PropTypes.string,
};
