import PropTypes from 'prop-types';
import {useEffect} from 'react'

import { Form } from 'modules/forms';
import { usePeople } from 'modules/person';
import { Spinner } from 'modules/spinners';
import { getCurrentInterview } from 'modules/data';
import classNames from 'classnames';

import { useSelector } from 'react-redux';

import MediaControlsForSegment from './MediaControlsForSegment';

export default function SegmentForm({
    locale,
    projectId,
    project,
    contentLocale,
    segment,
    submitData,
    onSubmit,
    onCancel,
}) {
    const { data: people, isLoading } = usePeople();
    const interview = useSelector(getCurrentInterview);

    if (isLoading) {
        return <Spinner />;
    }

    const isRtlLanguage = (locale) => {
        const rtlLanguages = ['ara', 'heb'];
        return rtlLanguages.includes(locale);
    }

    const isRtl = isRtlLanguage(contentLocale);

    useEffect(() => {
        if (isRtl) {
            const textarea = document.getElementById('segment_text');
            if (textarea) {
                textarea.setAttribute('dir', 'rtl');
                textarea.style.direction = 'rtl';
                textarea.style.textAlign = 'right';
            }
        }
    }, [isRtl]);

    return (
        <>
            <div className="SegmentForm-mediaControls">
                <MediaControlsForSegment 
                    className='SegmentForm-mediaControlsInner'
                    interview={interview}
                />
            </div>
            <div>
                <Form
                    className="SegmentForm-textarea"
                    scope='segment'
                    onSubmit={(params) => { submitData({ locale, projectId, project }, params); onSubmit(); }}
                    onCancel={onCancel}
                    data={segment}
                    helpTextCode="segment_form"
                    values={{locale: contentLocale}}
                    submitText='submit'
                    elements={[
                        {
                            elementType: 'select',
                            attribute: 'speaker_id',
                            values: Object.values(people),
                            value: segment?.speaker_id,
                            withEmpty: true,
                            individualErrorMsg: 'empty'
                        },
                        {
                            elementType: 'textarea',
                            value: (segment?.text[contentLocale] || segment?.text[`${contentLocale}-public`]),
                            attribute: 'text',
                            className: isRtl ? 'textarea-rtl' : '',
                            dir: isRtl ? 'rtl' : 'ltr',
                        },
                    ]}
                />
            </div>
        </>
    );
}

SegmentForm.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
    segment: PropTypes.object,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};