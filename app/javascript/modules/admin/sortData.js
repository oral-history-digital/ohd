export default function sortData(
    data,
    sortAttribute,
    sortAttributeTranslated,
    locale
) {
    let sorted = [];
    if (data) {
        if (sortAttribute) {
            sorted = Object.values(data).sort((a, b) => {
                if (!(sortAttribute in a) || !(sortAttribute in b)) {
                    return 0;
                }

                let aa = sortAttributeTranslated
                    ? a[sortAttribute][locale]
                    : a[sortAttribute];
                let bb = sortAttributeTranslated
                    ? b[sortAttribute][locale]
                    : b[sortAttribute];
                if (aa < bb) {
                    return -1;
                }
                if (aa > bb) {
                    return 1;
                }
                return 0;
            });
        } else {
            sorted = Object.values(data);
        }
    }

    return sorted.filter((s) => s);
}
