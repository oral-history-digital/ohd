import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

import { InterviewPreviewContainer } from 'modules/interview-preview';

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

export default function ResultGrid({ interviews, loading }) {
    return (
        <div className="Grid">
            {loading || !interviews
                ? // Show 6 skeleton cards while loading
                  Array.from({ length: 6 }).map((_, index) => (
                      <InterviewCardSkeleton key={`skeleton-${index}`} />
                  ))
                : interviews.map((interview) => (
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
    loading: PropTypes.bool,
};
