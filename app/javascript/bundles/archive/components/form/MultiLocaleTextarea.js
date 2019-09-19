import React from 'react';
import TextareaContainer from '../../containers/form/TextareaContainer';
import MultiLocaleWrapperContainer from '../../containers/form/MultiLocaleWrapperContainer';
import { t } from '../../../../lib/utils';

export default class MultiLocaleTextarea extends React.Component {

    render() {
        return (
            <MultiLocaleWrapperContainer
                data={this.props.data}
                scope={this.props.scope}
                attribute={this.props.attribute}
            >
                <TextareaContainer />
            </MultiLocaleWrapperContainer>
        )
    }

}
