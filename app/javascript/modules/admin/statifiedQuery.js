import parametrizedQuery from './parametrizedQuery';

export default function statifiedQuery(query) {
    return parametrizedQuery(query).replace(/[=&]/g, '_');
}
