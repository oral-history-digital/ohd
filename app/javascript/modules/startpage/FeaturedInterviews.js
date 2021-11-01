import { Spinner } from 'modules/spinners';
import { InterviewPreviewContainer } from 'modules/interview-preview';
import useFeaturedInterviews from './useFeaturedInterviews';

export default function FeaturedInterviews() {
    const { interviews } = useFeaturedInterviews();

    if (!interviews) {
        return <Spinner />;
    }

    return (
        <div className="search-results-container">
            {
                interviews.map(interview => (
                    <InterviewPreviewContainer
                        key={interview.id}
                        interview={interview}
                    />
                ))
            }
        </div>
    );
}
