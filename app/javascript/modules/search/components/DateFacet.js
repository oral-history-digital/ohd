import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useSearchParams } from 'modules/query-string';
import DateFacetValues from './DateFacetValues';

export default function DateFacet({
    name,
    data,
    className,
}) {
    const { allParams, setParam } = useSearchParams();

    const fromValue = allParams[`${name}_from`] || '';
    const untilValue = allParams[`${name}_until`] || '';

    function handleFromInputChange(event) {
        const { target: { value }} = event;

        if (value === '') {
            setParam(`${name}_from`, undefined);
            return;
        }

        setParam(`${name}_from`, value);

        // Prevent upside down date range.
        if (untilValue && (new Date(value) > new Date(untilValue))) {
            setParam(`${name}_until`, value);
        }
    }

    function handleUntilInputChange(event) {
        const { target: { value }} = event;

        if (value === '') {
            setParam(`${name}_until`, undefined);
            return;
        }

        setParam(`${name}_until`, value);

        // Prevent upside down date range.
        if (fromValue && (new Date(fromValue) > new Date(value))) {
            setParam(`${name}_from`, value);
        }
    }

    return (
        <>
            <form className={classNames(className)}>
                <p>
                    <label htmlFor="facet_date_from" >
                        von:
                    </label>
                    <input
                        id="facet_date_from"
                        type="date"
                        name="from"
                        value={fromValue}
                        onChange={handleFromInputChange}
                    />
                    <label className="u-ml-tiny" htmlFor="facet_date_until">
                        bis:
                    </label>
                    <input
                        id="facet_date_until"
                        type="date"
                        name="until"
                        value={untilValue}
                        onChange={handleUntilInputChange}
                    />
                </p>
            </form>
            <DateFacetValues
                className="u-mt-small"
                data={data}
            />
        </>
    );
}

DateFacet.propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
};
