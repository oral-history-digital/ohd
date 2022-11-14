import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import { useSearchParams } from 'modules/query-string';

export default function DateFacet({
    name,
    minDate,
    maxDate,
    className,
}) {
    const { locale } = useI18n();
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
        <form className={classNames(className)}>
            <div className="subfacet-entry">
                <label htmlFor="facet_date_from" >
                    von:
                </label>
                <input
                    id="facet_date_from"
                    type="date"
                    name="from"
                    min={minDate}
                    max={maxDate}
                    value={fromValue}
                    onChange={handleFromInputChange}
                />
            </div>
            <div className="subfacet-entry">
                <label htmlFor="facet_date_until">
                    bis:
                </label>
                <input
                    id="facet_date_until"
                    type="date"
                    name="until"
                    min={minDate}
                    max={maxDate}
                    value={untilValue}
                    onChange={handleUntilInputChange}
                />
            </div>
        </form>
    );
}

DateFacet.propTypes = {
    name: PropTypes.string.isRequired,
    minDate: PropTypes.string.isRequired,
    maxDate: PropTypes.string.isRequired,
    className: PropTypes.string,
};
