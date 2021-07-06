import PropTypes from 'prop-types';
import classNames from 'classnames';

import { humanReadable } from 'modules/data';

export default function ThumbnailMetadata({
    interview,
    interviewee,
    project,
    locale,
    translations,
}) {
    return (
        <ul className="DetailList" lang={locale}>
            {
                project.grid_fields.map((field) => {
                    let obj = (field.ref_object_type === 'Interview' || field.source === 'Interview') ?
                        interview :
                        interviewee;
                    return (
                        <li
                            key={field.name}
                            className={classNames('DetailList-item', {
                                'DetailList-item--shortened': field.name === 'description',
                            })}
                        >
                            {humanReadable(obj, field.name, { locale, translations, optionsScope: 'search_facets' }, {}, '') + ' '}
                        </li>
                    );
                })
            }
        </ul>
    );
}

ThumbnailMetadata.propTypes = {
    interview: PropTypes.object.isRequired,
    interviewee: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
};
