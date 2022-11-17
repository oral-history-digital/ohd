import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Checkbox } from 'modules/ui';
import { useSearchParams } from 'modules/query-string';

export default function DateRangeFacet({
    name,
    data,
    className,
}) {
    const { getFacetParam, addFacetParam, deleteFacetParam } = useSearchParams();

    const checkedValues = getFacetParam(name);

    console.log(checkedValues)

    function handleCheckboxChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        if (event.target.checked) {
            addFacetParam(name, value);
        } else {
            deleteFacetParam(name, value);
        }
    }

    const values = [];
    for (const [key, value] of Object.entries(data.values)) {
        const year1 = key.substring(0, 4);
        const year2 = key.substring(8, 12);

        values.push([`${year1}-${year2}`, value]);
    }

    console.log(data.values);

    return values.map(([rangeStr, count]) => {
        const isChecked = checkedValues.includes(rangeStr);

        return (
            <p
                key={rangeStr}
                className={classNames('Facet-value', {
                    'is-checked': isChecked,
                })}
            >
                <label>
                    <Checkbox
                        className={classNames('Input', 'with-font', 'checkbox', 'u-mr-tiny')}
                        id={name + "_" + rangeStr}
                        name={name}
                        checked={isChecked}
                        value={rangeStr}
                        onChange={handleCheckboxChange}
                    />
                    {rangeStr}
                    <span className="Facet-count">
                        {count}
                    </span>
                </label>
            </p>
        );
    });
}

DateRangeFacet.propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
};
