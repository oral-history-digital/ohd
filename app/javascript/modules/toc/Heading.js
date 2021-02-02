import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AuthorizedContent from 'bundles/archive/components/AuthorizedContent';
import SubHeadingContainer from './SubHeadingContainer';
import SegmentHeadingFormContainer from './SegmentHeadingFormContainer';

export default class Heading extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            active: false
        }

        this.toggle = this.toggle.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let endTime = (this.props.nextHeading) ? this.props.nextHeading.time : this.props.data.duration;
        let active = this.props.tape === this.props.data.tape_nbr && endTime > nextProps.transcriptTime && this.props.data.time <= nextProps.transcriptTime;
        if (active !== this.state.active) {
            this.setState({
                active: active
            })
        }
    }

    toggle() {
        if (this.props.data.main) {
            this.setState(prevState => ({
                expanded: !prevState.expanded
            }));
        }
    }

    handleClick() {
        const { data, handleSegmentClick } = this.props;

        handleSegmentClick(data.tape_nbr, data.time, false);
    }

    subHeadings() {
        if (this.props.data.main) {
            return <div className={this.state.expanded ? 'expanded' : 'collapsed'}>
                {this.props.data.subheadings.map((heading, index) => (
                    <div key={index}>
                        <SubHeadingContainer
                            data={heading}
                            nextSubHeading={this.props.data.subheadings[index+1] || this.props.nextHeading}
                        />
                        {this.editHeading()}
                    </div>
                ))}
            </div>;
        }
    }

    expandable() {
        if (this.props.data.subheadings.length === 0) {
            return <div className='heading-ico active'/>
        } else {
            let icoClass = this.state.expanded ? 'heading-ico active' : 'heading-ico';
            return <div className={icoClass}
                        onClick={this.toggle}/>
        }
    }

    editHeading() {
        return (
            <AuthorizedContent object={this.props.data.segment}>
                <span
                    className='flyout-sub-tabs-content-ico-link'
                    onClick={() => this.props.openArchivePopup({
                        content: <SegmentHeadingFormContainer segment={this.props.data.segment} />
                    })}
                >
                        <i className="fa fa-pencil"/>
                </span>
            </AuthorizedContent>
        );
    }

    render() {
        return (
            <div className='heading'>
                {this.expandable()}
                <div className={classNames('mainheading', this.state.active ? 'active' : 'inactive')}>
                    <span className='chapter-number' onClick={this.handleClick}>
                        {this.props.data.chapter}
                    </span>
                    <span
                        className='chapter-text'
                        onClick={this.handleClick}
                        dangerouslySetInnerHTML={{__html: this.props.data.heading}}
                    />
                    {this.editHeading()}
                </div>
                {this.subHeadings()}
            </div>
        )
    }
}

Heading.propTypes = {
    data: PropTypes.object.isRequired,
    nextHeading: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    tape: PropTypes.number.isRequired,
    transcriptTime: PropTypes.number.isRequired,
    handleSegmentClick: PropTypes.func.isRequired,
    openArchivePopup: PropTypes.func.isRequired,
};
