import { InterviewPreviewContainer } from 'modules/interview-preview';
import PropTypes from 'prop-types';

export default function ResultGrid({ interviews }) {
    if (!interviews) {
        return null;
    }

    return (
        <div className="Grid">
            {interviews.map((interview) => (
                <InterviewPreviewContainer
                    key={interview.archive_id}
                    interview={interview}
                />
            ))}
        </div>
    );
}

ResultGrid.propTypes = {
    interviews: PropTypes.array,
};
