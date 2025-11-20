import { InterviewPreviewContainer } from 'modules/interview-preview';
import { Spinner } from 'modules/spinners';

import useFeaturedInterviews from './useFeaturedInterviews';

export default function FeaturedInterviews() {
    const { interviews } = useFeaturedInterviews();

    if (!interviews) {
        return <Spinner />;
    }

    return (
        <div className="Grid">
            {interviews.map((interview) => (
                <InterviewPreviewContainer
                    key={interview.id}
                    interview={interview}
                />
            ))}
        </div>
    );
}
