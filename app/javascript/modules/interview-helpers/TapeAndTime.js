import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import formatTimecode from './formatTimecode';

export default function TapeAndTime({
    tape,
    time,
    separator = ' – ',
    className,
    style,
    transcriptCoupled,
}) {
    const { t } = useI18n();

    return (
        <span className={className} style={style}>
            {t('tape')} {tape}
            {transcriptCoupled ? separator : ''}
            {transcriptCoupled ? formatTimecode(time) : ''}
        </span>
    );
}

TapeAndTime.propTypes = {
    tape: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
    separator: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
};
