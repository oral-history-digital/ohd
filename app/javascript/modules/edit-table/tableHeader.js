export default function tableHeader({
    interview: interview,
    column: column,
    t: t,
}) {
    const translationParams = {
        original_locale: interview.lang,
        translation_locale: interview.translation_locale,
    };

    const header = /heading/.test(column) ?
        (t(`edit_column_header.${column.split('_')[0]}`) + ` (${column.split('_')[1]})`) :
        t(`edit_column_header.${column}`, translationParams).join('');
    return header;
}
