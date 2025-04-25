export default function LocaleSwitch({
    alpha3s,
    selected,
    setTranslationLocale,
}) {
    const links = alpha3s.map( a => (
        a === selected ?
            <b>{a}</b> :
            <a onClick={() => setTranslationLocale(a)} >{a}</a>
    ))
    .reduce((prev, curr) => [prev, '|', curr]);

    return (
        <div className="LocaleSwitch">
            ({links})
        </div>
    );
}
