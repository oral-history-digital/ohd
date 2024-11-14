import { Component } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte-18support';

export default class AnnotationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                id: props.annotation && props.annotation.id,
                locale: this.props.locale,
                segment_id: props.segment.id,
                interview_id: props.segment.interview_id,
                text: props.annotation?.text ?
                    RichTextEditor.createValueFromString(props.annotation.text, 'html') :
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
        this.props.onSubmit();
    }

    render () {
        const { onCancel, submitLabel, cancelLabel } = this.props;

        return (
            <form
                id='annotation'
                className='Form'
                onSubmit={this.handleSubmit}
            >
                <RichTextEditor
                    value={this.state.values.text}
                    toolbarConfig={{
                        display: ['LINK_BUTTONS', 'HISTORY_BUTTONS'],
                    }}
                    onChange={this.handleChange}
                />

                <div className="Form-footer u-mt">
                    <input
                        type="submit"
                        className="Button Button--primaryAction"
                        value={submitLabel}
                    />
                    <button
                        type="button"
                        className="Button Button--secondaryAction"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                </div>
            </form>
        );
    }

}

AnnotationForm.propTypes = {
    annotation: PropTypes.object,
    segment: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};
