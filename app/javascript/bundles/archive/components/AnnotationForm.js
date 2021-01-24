import React from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import { t } from 'lib/utils';

export default class AnnotationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                id: props.annotation && props.annotation.id,
                locale: this.props.contentLocale,
                segment_id: props.segment.id,
                interview_id: props.segment.interview_id,
                text: props.annotation && props.annotation.text[props.contentLocale] ?
                    RichTextEditor.createValueFromString(props.annotation.text[props.contentLocale], 'html') :
                    RichTextEditor.createEmptyValue()
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(value) {
        this.setState({
            values: Object.assign({}, this.state.values, {text: value})
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        let preparedValues = this.state.values;
        preparedValues.text = this.state.values.text.toString('html');
        this.props.submitData(this.props, {annotation: preparedValues});
        this.props.closeArchivePopup();
    }

    render () {
        return (
            <form
                id='annotation'
                className='annotation default'
                onSubmit={this.handleSubmit}
            >
                <RichTextEditor
                    value={this.state.values.text}
                    toolbarConfig={{
                        display: ['LINK_BUTTONS', 'HISTORY_BUTTONS'],
                    }}
                    onChange={this.handleChange}
                />
                <input
                    type="submit"
                    value={t({ locale: this.props.locale, translations: this.props.translations }, 'submit')}
                />
            </form>
        );
    }

}

AnnotationForm.propTypes = {
    annotation: PropTypes.object,
    segment: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    contentLocale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
};
