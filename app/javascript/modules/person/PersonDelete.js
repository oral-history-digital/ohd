import { usePersonApi } from 'modules/api';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import {
    useMutatePeople,
    useMutatePersonLandingPageMetadata,
    useMutatePersonWithAssociations,
} from './hooks';

export default function PersonDelete({
    data,
    onSubmit = (f) => f,
    onCancel = (f) => f,
}) {
    const { t } = useI18n();
    const { deletePerson } = usePersonApi();
    const mutatePeople = useMutatePeople();
    const mutatePersonWithAssociations = useMutatePersonWithAssociations();
    const mutatePersonLandingPageMetadata =
        useMutatePersonLandingPageMetadata();

    async function handleDeletePerson(id, callback) {
        mutatePeople(async (people) => {
            await deletePerson(id);

            mutatePersonWithAssociations(id);
            mutatePersonLandingPageMetadata(id);

            const updatedPeople = {
                ...people,
                data: { ...people.data },
            };
            delete updatedPeople.data[id];

            return updatedPeople;
        });

        if (typeof callback === 'function') {
            callback();
        }
    }

    return (
        <form className="Form">
            <h3 className="u-mt-none u-mb">{t('modules.tables.delete')}</h3>

            <p className="u-mb">{data.display_name}</p>

            <div className="Form-footer">
                <button
                    type="button"
                    className="Button Button--primaryAction"
                    onClick={() => handleDeletePerson(data.id, onSubmit)}
                >
                    {t('delete')}
                </button>
                <button
                    type="button"
                    className="Button Button--secondaryAction"
                    onClick={onCancel}
                >
                    {t('cancel')}
                </button>
            </div>
        </form>
    );
}

PersonDelete.propTypes = {
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
