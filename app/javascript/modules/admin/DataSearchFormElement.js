import { createElement } from 'react';

import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { pluralize } from 'modules/strings';
import PropTypes from 'prop-types';

export default function DataSearchFormElement({
    scope,
    query,
    element,
    onChange,
}) {
    const { t } = useI18n();

    const props = {
        className: classNames('Input', 'Input--fullWidth'),
        name: element.attributeName,
        value: query[element.attributeName] || element.value || '',
        onChange,
    };

    if (element.type === 'select') {
        const selectOptions = element.values.map((value, index) => (
            <option
                value={value}
                key={`${element.attributeName}-option-${index}`}
            >
                {t(`${pluralize(element.attributeName)}.${value}`)}
            </option>
        ));

        selectOptions.unshift(
            <option value="" key={`${scope}-choose`}>
                {t('choose')}
            </option>
        );

        return createElement('select', props, selectOptions);
    } else {
        props.type = 'text';
        return createElement('input', props);
    }
}

DataSearchFormElement.propTypes = {
    scope: PropTypes.string.isRequired,
    element: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};
