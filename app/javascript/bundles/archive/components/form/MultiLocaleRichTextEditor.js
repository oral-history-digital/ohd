import React from 'react';
import RichTextEditor from 'react-rte';
import MultiLocaleWrapperContainer from '../../containers/form/MultiLocaleWrapperContainer';
import { t } from '../../../../lib/utils';

export default class MultiLocaleRichTextEditor extends React.Component {

    render() {
        return (
            <MultiLocaleWrapperContainer
                data={this.props.data}
                scope={this.props.scope}
                attribute={this.props.attribute}
                onChange={this.props.handleChange}
            >
                <RichTextEditor />
            </MultiLocaleWrapperContainer>
        )
    }

}
