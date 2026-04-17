import { useI18n } from 'modules/i18n';
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
    const { t } = useI18n();
    const { interviews, isLoading } = useFeaturedInterviews();

    if (!interviews && !isLoading) return null;

    return (
        <div className="FeaturedInterviews u-mv-large">
            <h3
                className="FeaturedInterviews-heading u-mv"
                data-testid="projecthome-featured-interviews-heading"
            >
                {t('modules.project_home.sample_interviews')}
            </h3>
            <div className="FeaturedInterviews-interview-grid Grid">
                {isLoading
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
        </div>
    );
}
