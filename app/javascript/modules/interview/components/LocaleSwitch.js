export default function LocaleSwitch({
    alpha3s,
    selected,
    setTranslationLocale,
}) {
    return alpha3s.map( a => {
        if (a === selected) {
            return (
                <b className='u-ml-tiny'>{a}</b>
            );
        } else {
            return (
                <a
                    onClick={() => setTranslationLocale(a)}
                    className='u-ml-tiny'
                >{a}</a>
            );
        }
    })
}
