import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { useTrackPageView } from 'modules/analytics';
import { EditTableLoader } from 'modules/edit-table';
import { MediaPlayer } from 'modules/media-player';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import InterviewDetailsLeftSideContainer from './InterviewDetailsLeftSideContainer';
import InterviewTabsContainer from './InterviewTabsContainer';
import MediaPreview from './MediaPreview';

export default function Interview({
    interview,
    interviewEditView,
    isCatalog,
}) {
    const archiveId = interview?.archive_id;
    const { t, locale } = useI18n();

    useTrackPageView();

    const documentTitle = `${t('activerecord.models.interview.one')} ${interview?.archive_id}`;

    if (isCatalog) {
        if (interview?.contributions && Object.keys(interview.contributions).length > 0) {
            return <InterviewDetailsLeftSideContainer />;
        } else {
            return <Spinner withPadding />;
        }
    } else {
        return (
            <div>
                <Helmet>
                    <title>{documentTitle}</title>
                </Helmet>
                <AuthShowContainer ifLoggedIn>
                    <AuthorizedContent
                        object={interview}
                        action='show'
                        unauthorizedContent={<MediaPreview />}
                        showIfPublic
                    >
                        <MediaPlayer />
                        {
                            interviewEditView ?
                                <EditTableLoader /> :
                                <InterviewTabsContainer />

                        }
                    </AuthorizedContent>
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut ifNoProject>
                    <MediaPreview />
                </AuthShowContainer>
            </div>
        );
    }
}

Interview.propTypes = {
    interview: PropTypes.object,
    isCatalog: PropTypes.bool.isRequired,
    interviewEditView: PropTypes.bool.isRequired,
};
