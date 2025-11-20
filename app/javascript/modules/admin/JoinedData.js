import { createElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { pluralize, camelCase } from 'modules/strings';
import { useI18n } from 'modules/i18n';

export default function JoinedData({ joinedData, data, scope }) {
    const { t } = useI18n();

    return Object.keys(joinedData).map(
        (joined_model_name_underscore, index) => {
            const props = {
                data: data[pluralize(joined_model_name_underscore)],
                task: data.type === 'Task',
                initialFormValues: {
                    [`${scope}_id`]: data.id,
                    //
                    // the following could be generalized better
                    // at the moment it is ment to get the polymorphic association 'ref'
                    // and multiple possible types of uploaded_file into the form
                    //
                    ref_id: data.id,
                    ref_type: data.type,
                    type: camelCase(joined_model_name_underscore),
                },
            };

            return (
                <div
                    className={classNames(
                        pluralize(joined_model_name_underscore),
                        'box'
                    )}
                    key={joined_model_name_underscore}
                >
                    <h4 className="title">
                        {t(
                            `activerecord.models.${joined_model_name_underscore}.other`
                        )}
                    </h4>
                    {createElement(
                        joinedData[joined_model_name_underscore],
                        props
                    )}
                </div>
            );
        }
    );
}

JoinedData.propTypes = {
    joinedData: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
};
