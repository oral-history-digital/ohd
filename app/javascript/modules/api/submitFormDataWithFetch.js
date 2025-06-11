import { pluralize } from  'modules/strings';
import buildFormData from './buildFormData';

const headerOptions = { 'Accept': 'application/json' };

export default function submitFormDataWithFetch(pathBase, params) {
    const dataType = Object.keys(params)[0];
    const pluralizedDataType = pluralize(dataType);

    const isUpdate = typeof params[dataType].id !== 'undefined';

    let id, path;
    if (isUpdate) {
        id = params[dataType].id;
        delete params[dataType].id;
        path = `${pathBase}/${pluralizedDataType}/${id}.json`;
    } else {
        path = `${pathBase}/${pluralizedDataType}.json`;
    }

    const formData = new FormData();
    buildFormData(formData, params);

    const options = {
        method: isUpdate ? 'PUT' : 'POST',
        headers: headerOptions,
        body: formData,
    };

    return fetch(path, options).then(res => res.json());
}
