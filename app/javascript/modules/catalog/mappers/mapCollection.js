export default function mapCollection(locale, collection) {
    return {
        type: 'collection',
        id: collection.id,
        name: collection.name[locale],
        num_interviews: collection.num_interviews,
    };
}
