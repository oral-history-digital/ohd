import PropTypes from 'prop-types';

import { InterviewPreviewContainer } from 'modules/interview-preview';

export default function ResultGrid({
    interviews,
}) {
    if (!interviews) {
        return null;
    }

    return (
        interviews.map(interview => (
            <InterviewPreviewContainer key={interview.archive_id} interview={interview} />
        ))
    );
}

ResultGrid.propTypes = {
    interviews: PropTypes.array.isRequired,
};