import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FaTrash } from 'react-icons/fa';

import { Spinner } from 'modules/spinners';
import { deleteData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

export default function DestroyTranscript({
    interview,
}) {
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const dispatch = useDispatch();
    const [alpha3ToDestroy, setAlpha3ToDestroy] = useState(null);
    const [alpha3IsDestroying, setAlpha3IsDestroying] = useState(null);

    return (
        <>
            { interview?.alpha3s_with_transcript.map( alpha3 => {
                if (alpha3IsDestroying === alpha3) {
                    return <span>{alpha3 + ': '}<Spinner /></span>;
                } else if (alpha3ToDestroy === alpha3) {
                    return <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        title={t('really_destroy')}
                        onClick={() => {
                            dispatch(deleteData({locale, projectId, project},
                                'interviews', interview.archive_id, 'transcripts', alpha3,
                                false, false, setAlpha3IsDestroying(alpha3)
                            ));
                        }}
                    >
                        <span>{t('destroy.really_destroy_transcript', { alpha3: alpha3 })}</span>
                        <FaTrash className="Icon Icon--danger" />
                    </button>
                } else {
                    return <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        title={t('delete')}
                        onClick={() => setAlpha3ToDestroy(alpha3)}
                    >
                        <span>{t('destroy.delete_transcript', { alpha3: alpha3 })}</span>
                        <FaTrash className="Icon Icon--editorial" />
                    </button>
                }
            })}
        </>
    );
}

DestroyTranscript.propTypes = {
    interview: PropTypes.object.isRequired,
};

