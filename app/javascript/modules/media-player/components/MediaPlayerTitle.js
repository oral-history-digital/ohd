import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getCurrentIntervieweeId } from 'modules/data';
import { usePeople, formatPersonName } from 'modules/person';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';

export default function MediaPlayerTitle({
    className
}) {
    const { locale, translations } = useI18n();
    const intervieweeId = useSelector(getCurrentIntervieweeId);
    const { data: peopleData, isLoading } = usePeople();

    if (isLoading) {
        return <Spinner small />;
    }

    const interviewee = peopleData[intervieweeId];

    return (
        <h1 className={className}>
            {formatPersonName(
                interviewee, translations, { locale, withTitle: true }
            )}
        </h1>
    );
}

MediaPlayerTitle.propTypes = {
    className: PropTypes.string,
};
