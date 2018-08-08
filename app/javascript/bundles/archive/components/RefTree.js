import React from 'react';
import RefTreeEntryContainer from '../containers/RefTreeEntryContainer';
import FoundSegmentContainer from '../containers/FoundSegmentContainer';
import { t } from "../../../lib/utils";
import spinnerSrc from '../../../images/large_spinner.gif'

export default class RefTree extends React.Component {

    componentDidMount() {
        this.loadRefTree();
    }

    componentDidUpdate() {
        this.loadRefTree();
    }

    loadRefTree() {
        if (!this.props.refTreeStatus[`for_interviews_${this.props.archiveId}`]) {
            this.props.fetchData('interviews', this.props.archiveId, 'ref_tree');
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
        if (
            this.props.refTreeStatus[`for_interviews_${this.props.archiveId}`] && 
            this.props.refTreeStatus[`for_interviews_${this.props.archiveId}`].split('-')[0] === 'fetched'
        ) {
            if (this.props.interview.ref_tree && this.props.interview.ref_tree.children) {
                return this.renderChildren(this.props.interview.ref_tree.children);
            } else {
                return this.emptyRefTree();
            }
        } else {
            return <img src={spinnerSrc} className="archive-search-spinner"/>;
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

