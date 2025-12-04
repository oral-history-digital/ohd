export default function LocaleSwitch({
    alpha3s,
    selected,
    setTranslationLocale,
}) {
    if (!alpha3s || alpha3s.length === 0) return null;

    const links = alpha3s
        .map((a) =>
            a === selected ? (
                <b>{a}</b>
            ) : (
                <a onClick={() => setTranslationLocale(a)}>{a}</a>
            )
        )
        .reduce((prev, curr) => [prev, '|', curr]);

    return <div className="LocaleSwitch">({links})</div>;
}
