import { Component } from 'react';
import PropTypes from 'prop-types';

import { t } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { FoundSegmentContainer } from 'modules/transcript';
import RefTreeEntryContainer from './RefTreeEntryContainer';

export default class RefTree extends Component {
    componentDidMount() {
        this.loadRefTree();
    }

    componentDidUpdate() {
        this.loadRefTree();
    }

    loadRefTree() {
        if (!this.props.refTreeStatus[`for_interviews_${this.props.archiveId}`]) {
            this.props.fetchData(this.props, 'interviews', this.props.archiveId, 'ref_tree');
        }
    }

    renderChildren(children) {
        return children.map((entry, index) => {
            if (entry.type === 'leafe') {
                return (
                    <FoundSegmentContainer
                        className='heading'
                        key={index}
                        data={entry}
                    />
                )
            } else {
                return <RefTreeEntryContainer
                    key={index}
                    entry={entry}
                    index={index}
                    renderChildren={this.renderChildren.bind(this)}
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
            return <Spinner />;
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

RefTree.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    refTreeStatus: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
};
