import React from 'react';
import RefTreeEntryContainer from '../containers/RefTreeEntryContainer';
import FoundSegmentContainer from '../containers/FoundSegmentContainer';
import { t } from "../../../lib/utils";

export default class RefTree extends React.Component {

    componentDidMount() {
        //this.loadRefTree();
    }

    componentDidUpdate() {
        //this.loadRefTree();
    }

    loadRefTree() {
        if (
            !this.props.interview.ref_tree_status
        ) {
            this.props.fetchInterviewData(this.props.archiveId, 'ref_tree');
        }
    }

    renderChildren(children) {
        let that = this;
        return children.map((entry, index) => {
            if (entry.type === 'leafe') {
                return (
                    <FoundSegmentContainer
                        className='heading'
                        key={'entry-' + index}
                        data={entry}
                    />
                )
            } else {
                return <RefTreeEntryContainer
                    className='heading'
                    key={'entry-' + index}
                    entry={entry}
                    index={index}
                    renderChildren={this.renderChildren.bind(that)}
                />
            }
        })
    }

    refTree() {
        if (false) {
        //if (this.props.interview.ref_tree && this.props.interview.ref_tree.children) {
            return this.renderChildren(this.props.interview.ref_tree.children);
        } else {
            return this.emptyRefTree();
        }
    }

    emptyRefTree() {
        if(this.props.translations !== undefined) {
            return t(this.props, 'without_ref_tree');
        }
        return null;
    }

    render() {
        return (
            <div className={'content-index content-ref-tree'}>
                {this.refTree()}
            </div>
        );
    }
}

