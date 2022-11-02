import { pluralize } from  'modules/strings';

const headerOptions = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export default function submitDataWithFetch(pathBase, params) {
    const dataType = Object.keys(params)[0];
    const pluralizedDataType = pluralize(dataType);

    if (params[dataType].id) {
        const id = params[dataType].id;
        delete params[dataType].id;

        const path = `${pathBase}/${pluralizedDataType}/${id}`;
        const options = {
            method: 'PUT',
            headers: headerOptions,
            body: JSON.stringify(params),
        };

        return fetch(path, options).then(res => res.json());
    } else {
        const path = `${pathBase}/${pluralizedDataType}`;
        const options = {
            method: 'POST',
            headers: headerOptions,
            body: JSON.stringify(params),
        };

        return fetch(path, options).then(res => res.json());
    }
}
