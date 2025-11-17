import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import { getCurrentInterview } from 'modules/data';
import { useTrackPageView } from 'modules/analytics';
import { MediaPlayer } from 'modules/media-player';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import MediaPreview from './MediaPreview';

export default function MediaComponent({}) {
    const interview = useSelector(getCurrentInterview);
    const archiveId = interview?.archive_id;
    const { t, locale } = useI18n();

    useTrackPageView();

    const documentTitle = `${t('activerecord.models.interview.one')} ${interview?.archive_id}`;

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
                </AuthorizedContent>
            </AuthShowContainer>
            <AuthShowContainer ifLoggedOut ifNoProject>
                <MediaPreview />
            </AuthShowContainer>
        </div>
    );
}
