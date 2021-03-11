export default function t(props, key, params) {
    let text, defaultKey;
    if (!key)
        return '';
    let keyArray = key.split('.');
    let productionFallback = keyArray[keyArray.length - 1];

    if (keyArray.length > 2) {
        keyArray[keyArray.length - 2] = 'default';
        defaultKey = keyArray.join('.');
    }

    try {
        try {
            eval(`text = props.translations.${props.locale}.${key}`);
        } catch (e) {
        } finally {
            if (typeof(text) !== 'string') {
                eval(`text = props.translations.${props.locale}.${defaultKey}`);
            }
        }
    } catch (e) {
    } finally {
        if (typeof(text) === 'string') {
            if(params) {
                for (let [key, value] of Object.entries(params)) {
                    text = text.replace(`%{${key}}`, value)
                }
            }
            return text
        } else {
            if (developmentMode === 'true') {
                return `translation for ${props.locale}.${key} is missing!`;
            } else {
                return productionFallback;
            }
        }
    }
}
