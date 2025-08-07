import { pluralize } from  'modules/strings';
import buildFormData from './buildFormData';

const headerOptions = { 'Accept': 'application/json' };

export default function submitFormDataWithFetch(pathBase, params) {
    const dataType = Object.keys(params)[0];
    const pluralizedDataType = pluralize(dataType);

    let id, path;
    if (params[dataType].id) {
        id = params[dataType].id;
        delete params[dataType].id;
        path = `${pathBase}/${pluralizedDataType}/${id}`;
    } else {
        path = `${pathBase}/${pluralizedDataType}`;

    }

    const formData = new FormData();
    buildFormData(formData, params);

    const options = {
        method: 'POST',
        headers: headerOptions,
        body: formData,
    };

    return fetch(path, options).then(res => res.json());
}
