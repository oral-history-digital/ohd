import { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import SubmitInterviewIds from './SubmitInterviewIds';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function DownloadLinks({
    archiveId,
    numTapes,
    languages,
}) {
    const pathBase = usePathBase();
    const { t } = useI18n();
    const tapeNumbers = Array.from({length: numTapes}, (_, index) => index + 1);

    return (
        <div>
            <h4>{archiveId}:</h4>

            <ul>
                {tapeNumbers.map(tapeNumber => (
                    <li key={tapeNumber}>
                        {`${t('tape')} ${tapeNumber}: `}
                        {languages.map((lang, index) => (
                            <Fragment key={lang}>
                                <a
                                    href={`${pathBase}/interviews/${archiveId}.ods?lang=${lang}&tape_number=${tapeNumber}`}
                                    download
                                >
                                    {`ods-${lang}`}
                                </a>
                                {', '}
                                <a
                                    href={`${pathBase}/interviews/${archiveId}.vtt?lang=${lang}&tape_number=${tapeNumber}`}
                                    download
                                >
                                    {`vtt-${lang}`}
                                </a>
                                {(index < languages.length - 1) && ', '}
                            </Fragment>
                        ))}
                    </li>
                ))}
                <li>
                    <SubmitInterviewIds
                        selectedArchiveIds={[archiveId]}
                        action="export_photos"
                        filename={`${archiveId}_photos_${moment().format('YYYY-MM-DD')}.zip`}
                    />
                </li>
            </ul>
        </div>
    );
}

DownloadLinks.propTypes = {
    archiveId: PropTypes.string.isRequired,
    numTapes: PropTypes.number.isRequired,
    languages: PropTypes.array.isRequired,
};
