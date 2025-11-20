import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useSearchParams } from 'modules/query-string';
import YearRange from './YearRange';

export default function RangeFacet({ name, sliderMin, sliderMax }) {
    const { getRangeParam, setRangeParam } = useSearchParams();

    const range = getRangeParam(name);

    const [currentValue, setCurrentValue] = useState(range);

    useEffect(() => {
        setCurrentValue(range);
    }, [range?.[0], range?.[1]]);

    function handleCompleteChange() {
        setRangeParam(name, currentValue);
    }

    return (
        <YearRange
            currentValue={currentValue}
            sliderMin={sliderMin}
            sliderMax={sliderMax}
            onChange={setCurrentValue}
            onAfterChange={handleCompleteChange}
        />
    );
}

RangeFacet.propTypes = {
    name: PropTypes.string.isRequired,
    sliderMin: PropTypes.number,
    sliderMax: PropTypes.number,
};
