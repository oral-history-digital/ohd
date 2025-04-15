export default function LocaleSwitch({
    interview,
    selected,
    setTranslationLocale,
}) {
    return interview.translation_alpha3s.map( a => {
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
