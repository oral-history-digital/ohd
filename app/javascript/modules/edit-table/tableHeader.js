export default function tableHeader({
    interview: interview,
    column: column,
    t: t,
}) {
    const translationParams = {
        original_locale: interview.alpha3,
        translation_locale: interview.translation_alpha3,
    };

    let result = /heading|translation|annotation/.test(column)
        ? t(`edit_column_header.${column.split('_')[0]}`) +
          ` (${column.split('_')[1]})`
        : t(`edit_column_header.${column}`, translationParams);

    // Handle both string and array return types from t()
    // t() returns arrays when parameters are substituted
    const header = Array.isArray(result) ? result.join('') : result;
    return header;
}
