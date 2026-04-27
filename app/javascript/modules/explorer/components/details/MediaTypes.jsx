import { useI18n } from 'modules/i18n';
import { formatNumber } from 'modules/utils';
import PropTypes from 'prop-types';

export function MediaTypes({ mediaTypes }) {
    const { t, locale } = useI18n();

    const videoCount = Number(mediaTypes?.video) || 0;
    const audioCount = Number(mediaTypes?.audio) || 0;

    const mediaTypesEntries = [
        {
            type: 'videos',
            num: videoCount,
        },
        {
            type: 'audios',
            num: audioCount,
        },
    ];

    const mediaTypesStr = mediaTypesEntries
        .filter((mediaType) => mediaType.num > 0)
        .sort((a, b) => b.num - a.num)
        .map(
            (mediaType) =>
                `${formatNumber(mediaType.num, 0, locale)} ${t(`modules.catalog.${mediaType.type}`)}`
        )
        .join(', ');

    if (!mediaTypesStr) return null;

    return (
        <div className="DescriptionList-group DescriptionList-group--media-types">
            <dt className="DescriptionList-term">
                {t('modules.catalog.media_type')}
            </dt>
            <dd className="DescriptionList-description">{mediaTypesStr}</dd>
        </div>
    );
}

MediaTypes.propTypes = {
    mediaTypes: PropTypes.shape({
        audio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        video: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        audios: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        videos: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    numVideos: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    numAudios: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default MediaTypes;
