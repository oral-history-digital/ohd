export default function LocaleSwitch({
    alpha3s,
    selected,
    setTranslationLocale,
}) {
    const links = alpha3s.map( (a, i) => (
        a === selected ? (
            <b className='u-ml-tiny'>{a}</b>
        ) : (
            <a
                onClick={() => setTranslationLocale(a)}
                className='u-ml-tiny'
            >{a}</a>
        )
    ))
    .reduce((prev, curr) => [prev, '|', curr]);

    return (
        <div className="LocaleSwitch">
            ({links})
        </div>
    );
}
            //{ `(${links})` }
