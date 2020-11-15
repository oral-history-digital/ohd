import React from 'react';
import InputContainer from '../../containers/form/InputContainer';
import MultiLocaleWrapperContainer from '../../containers/form/MultiLocaleWrapperContainer';
import { t } from '../../../../lib/utils';

export default class MultiLocaleInput extends React.Component {

    render() {
        return (
            <MultiLocaleWrapperContainer
                data={this.props.data}
                scope={this.props.scope}
                attribute={this.props.attribute}
                handleChange={this.props.handleChange}
            >
                <InputContainer />
            </MultiLocaleWrapperContainer>
        )
    }

}
