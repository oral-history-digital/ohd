import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { Disclosure } from 'modules/ui';

export default function ResultList({
    tKey,
    searchResults,
    component: Component,
}) {
    const { t } = useI18n();

    if (!searchResults || searchResults.length === 0) {
        return null;
    }

    const title = `${searchResults.length} ${t(`${tKey}_results`)}`;

    if (typeof Component === 'undefined') {
        return (
            <p style={{ fontSize: '1rem', marginLeft: '1.5rem' }}>
                {title}
            </p>
        );
    }

    return (
        <Disclosure title={title}>
            {
                searchResults.map(data => <Component key={data.id} data={data} />)
            }
        </Disclosure>
    );
}

ResultList.propTypes = {
    tKey: PropTypes.string.isRequired,
    searchResults: PropTypes.object.isRequired,
    component: PropTypes.elementType,
};
