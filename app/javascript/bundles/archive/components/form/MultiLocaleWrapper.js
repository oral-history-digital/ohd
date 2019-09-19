import React from 'react';
import { t } from '../../../../lib/utils';

export default class MultiLocaleWrapper extends React.Component {

    label(locale) {
        let mandatory = this.props.mandatory ? ' *' : '';
        let label = this.props.label ? this.props.label : t(this.props, `activerecord.attributes.${this.props.scope}.${this.props.attribute}`) + mandatory;
        return `${label} (${locale})`;
    }

    // the (perhaps given) attribute-value is fetched from serialized translations
    // than the new value is send back in a stringified JSON-hash in the scope of the form and further scoped with 'translations_attributes'
    //
    // like this resource.update_attributes(resource_params) needs only to JSON.parse(translations_attributes)
    //
    // so to update a persons translated first_name
    // the transmitted params would be:
    //
    // {"person"=>{"translations_attributes"=>"[{\"locale\":\"de\",\"id\":\"339\",\"first_name\":\"Ewa\"},{\"id\":340,\"locale\":\"ru\",\"first_name\":\"Эва\"]"}
    //
    // TODO: enable validation for this MultiLocaleInput
    //
    preparedProps(locale) {
        let translation = this.props.data && this.props.data.translations && this.props.data.translations.find(t => t.locale === locale)

        let props = Object.assign({}, this.props, {
            attribute: `translations_attributes-${locale}-${this.props.attribute}-${(translation && translation.id) ? translation.id : ''}`,
            value: translation && translation[this.props.attribute],
            label: this.label(locale),
            key: `${this.props.attribute}-${locale}`
        })
        return props;
    }

    render() {
        let _this = this;
        return (
            <div className='multi-locale-input'>
                {this.props.locales.map((locale, index) => {
                    return React.cloneElement(_this.props.children, _this.preparedProps(locale))
                })}
            </div>
        )
    }

}
