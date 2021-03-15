import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Modal } from 'modules/ui';
import { AuthorizedContent } from 'modules/auth';
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
        let active = this.props.tape === this.props.data.tape_nbr && endTime > nextProps.mediaTime && this.props.data.time <= nextProps.mediaTime;
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
        const { data, sendTimeChangeRequest } = this.props;

        sendTimeChangeRequest(data.tape_nbr, data.time);
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
                        {this.editHeading(heading.segment)}
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

    editHeading(segment) {
        return (
            <AuthorizedContent object={segment}>
                <Modal
                    title=""
                    trigger={<i className="fa fa-pencil" />}
                >
                    {closeModal => (
                        <SegmentHeadingFormContainer
                            segment={segment}
                            onSubmit={closeModal}
                        />
                    )}
                </Modal>
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
                    {this.editHeading(this.props.data.segment)}
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
    mediaTime: PropTypes.number.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
