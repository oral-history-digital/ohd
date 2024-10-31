import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaUserPlus, FaUserEdit } from 'react-icons/fa';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePeople, PersonForm } from 'modules/person';
import { Modal } from 'modules/ui';
import { Spinner } from 'modules/spinners';

export default function ContributionForm({
    withSpeakerDesignation,
    project,
    projectId,
    locale,
    data,
    nested,
    contributionTypes,
    interview,
    formClasses,
    onSubmit,
    onSubmitCallback,
    index,
    onCancel,
    submitData,
}) {
    const { t } = useI18n();
    const [selectedPersonId, setSelectedPersonId] = useState(null);

    const { data: peopleData, isLoading } = usePeople();

    if (isLoading) {
        return <Spinner />;
    }

    if (data && selectedPersonId === null) {
        setSelectedPersonId(data.person_id);
    }

    const selectedPerson = selectedPersonId !== null ?
        peopleData?.[selectedPersonId] :
        null;

    function handlePersonChange(attribute, value) {
        if (attribute !== 'person_id') {
            return;
        }

        if (value) {
            setSelectedPersonId(Number(value));
        } else {
            setSelectedPersonId(null);
        }
    }

    const sortedPeopleData = Object.values(peopleData)
        .sort((a, b) => a.name[locale].localeCompare(b.name[locale]));

    const formElements = [
        {
            elementType: 'select',
            attribute: 'person_id',
            values: sortedPeopleData,
            value: data?.person_id,
            withEmpty: true,
            validate: function(v){return /^\d+$/.test(v)},
            handlechangecallback: handlePersonChange,
        },
        {
            elementType: 'select',
            attribute: 'contribution_type_id',
            values: contributionTypes && Object.values(contributionTypes),
            value: data?.contribution_type_id,
            optionsScope: 'contributions',
            keepOrder: true,
            withEmpty: true,
            validate: function(v){return /^\d+$/.test(v)},
        },
        {
            elementType: 'select',
            attribute: 'workflow_state',
            values: ["unshared", "public"],
            value: data ? data.workflow_state : 'public',
            optionsScope: 'workflow_states',
        }
    ]
    if (withSpeakerDesignation) {
        formElements.push({
            attribute: 'speaker_designation',
            value: data?.speaker_designation,
        });
    }

    return (
        <>
            <Form
                scope='contribution'
                data={data}
                nested={nested}
                values={{
                    interview_id: interview?.id,
                    workflow_state: data ? data.workflow_state : 'public'
                }}
                onSubmit={(params) => {
                    if (typeof submitData === 'function') {
                        submitData({ locale, projectId, project }, params, index);
                    }
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                onSubmitCallback={onSubmitCallback}
                onCancel={onCancel}
                formClasses={formClasses}
                elements={formElements}
                helpTextCode="contribution_form"
            >
            </Form>
            <div className="u-mt">
                <Modal
                    title={t('edit.person.new')}
                    trigger={(
                        <>
                            <FaUserPlus className="Icon Icon--editorial" />
                            {' '}
                            {t('edit.person.new')}
                        </>
                    )}
                >
                    {close => (
                        <PersonForm
                            onSubmit={close}
                            onCancel={close}
                        />
                    )}
                </Modal>
                {selectedPerson && (
                    <>
                        {' | '}
                        <Modal
                            title={t('edit.person.edit')}
                            hideHeading
                            trigger={(
                                <>
                                    <FaUserEdit className="Icon Icon--editorial" />
                                    {' '}
                                    {t('edit.default.edit_record', { name: selectedPerson.name[locale]}) }
                                </>
                            )}
                        >
                            {close => (
                                <PersonForm
                                    data={selectedPerson}
                                    onSubmit={close}
                                    onCancel={close}
                                />
                            )}
                        </Modal>
                    </>
                )}
            </div>
        </>
    );
}

ContributionForm.propTypes = {
    interview: PropTypes.object,
    withSpeakerDesignation: PropTypes.bool,
    data: PropTypes.object,
    contributionTypes: PropTypes.object.isRequired,
    formClasses: PropTypes.string,
    index: PropTypes.number,
    nested: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    onSubmitCallback: PropTypes.func,
    onCancel: PropTypes.func,
};
