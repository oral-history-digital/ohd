import { useState } from 'react';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

export default function NormDatumForm({
    index,
    submitData,
    onSubmitCallback,
    onCancel,
    formClasses,
    data,
    nested,
    registryEntryId,
    descriptor,
    norm_data_provider_id,
    nid,
    projectId,
    projects,
    normDataProviders,
    locale,
}) {

    const { t } = useI18n();
    const pathBase = usePathBase();
    const [fromAPI, setFromAPI] = useState(false);
    const [selected, setSelected] = useState(null);
    const [apiResults, setApiResults] = useState([]);

    const fetchAPIResults = async() => {
        fetch(`${pathBase}/norm_data_api?expression=${descriptor}`)
            .then(res => res.json())
            .then(json => { console.log(`json = ${json}`); setApiResults(json)});
    };

    return (
        <>
            { registryEntryId &&
                <button
                    type="button"
                    className="Button Button--primaryAction"
                    onClick={() => {
                        !fromAPI && fetchAPIResults();
                        setFromAPI(!fromAPI);
                    }}
                >
                    {t('search_in_normdata')}
                </button>
            }
            { fromAPI ?
                <ul>
                    {apiResults.map( result => {
                        return (
                            <li onClick={ result => setSelected(result) } >
                                {`${result.Entry.Name}: ${result.Entry.Label}`}
                            </li>
                        )
                    })}
                </ul> :
                <Form
                    scope='norm_datum'
                    onSubmit={params => {
                        const paramsWithSelectedEntryValues = {
                            norm_datum: Object.assign({}, params.norm_datum, {
                                registry_entry_id: (data?.registry_entry_id) || registryEntryId,
                                norm_data_provider_id: norm_data_provider_id,
                                nid:  nid,
                            }),
                        };
                        submitData({projectId, locale, projects}, paramsWithSelectedEntryValues, index);
                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }
                    }}
                    onSubmitCallback={onSubmitCallback}
                    onCancel={onCancel}
                    formClasses={formClasses}
                    data={data}
                    nested={nested}
                    values={{
                        registry_entry_id: (data?.registry_entry_id) || registryEntryId,
                    }}
                    submitText='submit'
                    elements={[
                        {
                            attribute: 'norm_data_provider_id',
                            elementType: 'select',
                            value: norm_data_provider_id,
                            values: normDataProviders,
                            withEmpty: true,
                        },
                        {
                            attribute: 'nid',
                            value: nid,
                        },
                    ]}
                />
            }
        </>
    );
}
