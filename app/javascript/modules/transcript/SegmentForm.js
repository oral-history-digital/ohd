import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { usePeople } from 'modules/person';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

export default function SegmentForm({
    contentLocale,
    segment,
    onSubmit,
    onCancel,
}) {
    const dispatch = useDispatch();
    const { locale } = useI18n();
    const { project, projectId } = useProject();

    const { data: people, isLoading } = usePeople();

    if (isLoading) {
        return <Spinner />;
    }

    let textValue = segment?.text[contentLocale];
    if (typeof textValue === 'undefined') {
        textValue = segment?.text[`${contentLocale}-public`];
    }

    return (
        <div>
            <Form
                scope='segment'
                onSubmit={(params) => {
                    dispatch(submitData({ locale, projectId, project }, params));
                    onSubmit();
                }}
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
                        value: textValue,
                        attribute: 'text',
                    },
                ]}
            />
        </div>
    );
}

SegmentForm.propTypes = {
    contentLocale: PropTypes.string.isRequired,
    segment: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};
