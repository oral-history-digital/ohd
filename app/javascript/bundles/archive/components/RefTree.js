import React from 'react';
import RefTreeEntryContainer from '../containers/RefTreeEntryContainer';

export default class RefTree extends React.Component {

    renderChildren(children) {
        let that = this;
        if (children) {
            return children.map( (entry, index) => {
                return  <RefTreeEntryContainer 
                            key={'entry-' + index}
                            entry={entry}
                            index={index}
                            renderChildren={this.renderChildren.bind(that)}
                        />
                })
        }
    }

    render () {
        return ( 
            <div className={'content-index'}>
                {this.renderChildren(this.props.refTree[0].children)}
            </div>
        );
    }
}

