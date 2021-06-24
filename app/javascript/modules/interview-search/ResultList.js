import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import { Disclosure } from 'modules/ui';

export default function ResultList({
    tKey,
    searchResults,
    component: Component,
    className,
}) {
    const { t } = useI18n();
    const title = `${searchResults.length} ${t(`${tKey}_results`)}`;

    return (
        <div className={classNames('ResultList', className)}>
            <Disclosure title={title}>
                <div className="ResultList-list">
                    {searchResults.map(data => <Component key={data.id} data={data} />)}
                </div>
            </Disclosure>
        </div>
    );
}

ResultList.propTypes = {
    tKey: PropTypes.string.isRequired,
    searchResults: PropTypes.object.isRequired,
    component: PropTypes.elementType,
    className: PropTypes.string,
};
