import { InterviewPreviewContainer } from 'modules/interview-preview';
import Skeleton from 'react-loading-skeleton';
import useFeaturedInterviews from './useFeaturedInterviews';

// Skeleton placeholder that mimics InterviewCard structure
function InterviewCardSkeleton() {
    return (
        <div className="InterviewCard">
            <div className="InterviewCard-image aspect-ratio">
                <div className="aspect-ratio__inner">
                    <Skeleton height="100%" />
                </div>
            </div>
            <div className="InterviewCard-title u-mt-small">
                <Skeleton />
            </div>
            <ul className="DetailList">
                {Array.from({ length: 3 }).map((_, index) => (
                    <li key={index} className="DetailList-item">
                        <Skeleton />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function FeaturedInterviews() {
    const { interviews } = useFeaturedInterviews();

    return (
        <div className="Grid">
            {!interviews
                ? // Show 6 skeleton cards while loading
                  Array.from({ length: 6 }).map((_, index) => (
                      <InterviewCardSkeleton key={`skeleton-${index}`} />
                  ))
                : interviews.map((interview) => (
                      <InterviewPreviewContainer
                          key={interview.id}
                          interview={interview}
                      />
                  ))}
        </div>
    );
}
