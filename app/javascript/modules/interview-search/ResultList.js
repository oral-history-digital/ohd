import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Disclosure } from 'modules/ui';

export default function ResultList({
    heading,
    searchResults,
    component: Component,
    locale,
    className,
}) {
    const title = `${searchResults.length} ${heading}`;

    return (
        <div className={classNames('ResultList', className)}>
            <Disclosure title={title}>
                <div className="ResultList-list">
                    {searchResults.map((data) => (
                        <Component key={data.id} data={data} locale={locale} />
                    ))}
                </div>
            </Disclosure>
        </div>
    );
}

ResultList.propTypes = {
    heading: PropTypes.string.isRequired,
    searchResults: PropTypes.array.isRequired,
    component: PropTypes.elementType,
    locale: PropTypes.string,
    className: PropTypes.string,
};
