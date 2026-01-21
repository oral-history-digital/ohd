import { useEffect, useState } from 'react';

import { useSearchParams } from 'modules/query-string';
import PropTypes from 'prop-types';

import YearRange from './YearRange';

export default function InterviewYearFacet({ sliderMin, sliderMax }) {
    const { interviewYearMin, interviewYearMax, setInterviewYearRange } =
        useSearchParams();
    const [currentValue, setCurrentValue] = useState([
        interviewYearMin,
        interviewYearMax,
    ]);

    useEffect(() => {
        if (Number.isNaN(interviewYearMin) && Number.isNaN(interviewYearMax)) {
            setCurrentValue([sliderMin, sliderMax]);
        } else {
            setCurrentValue([interviewYearMin, interviewYearMax]);
        }
    }, [interviewYearMin, interviewYearMax]);

    function handleCompleteChange() {
        setInterviewYearRange(...currentValue);
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

InterviewYearFacet.propTypes = {
    sliderMin: PropTypes.number,
    sliderMax: PropTypes.number,
};
