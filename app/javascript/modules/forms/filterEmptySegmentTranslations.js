export default function filterEmptySegmentTranslations(translations) {
    return translations?.filter(t =>
        t.text?.length > 0 ||
        t.mainheading?.length > 0 ||
        t.subheading?.length > 0
    );
}
