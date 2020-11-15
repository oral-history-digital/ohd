import React from 'react';
import RichTextEditor from 'react-rte';
import MultiLocaleWrapperContainer from '../../containers/form/MultiLocaleWrapperContainer';
import { t } from '../../../../lib/utils';

export default class MultiLocaleRichTextEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value ? 
                      RichTextEditor.createValueFromString(this.props.value, 'html') : 
                      RichTextEditor.createEmptyValue()
        }
    }

    render() {
        return (
            <MultiLocaleWrapperContainer
                data={this.props.data}
                scope={this.props.scope}
                attribute={this.props.attribute}
                onChange={this.props.handleChange}
            >
                <RichTextEditor value={this.state.value} />
            </MultiLocaleWrapperContainer>
        )
    }

}
