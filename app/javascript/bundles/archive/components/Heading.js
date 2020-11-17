import React from 'react';
import SubHeadingContainer from '../containers/SubHeadingContainer';
import SegmentHeadingFormContainer from '../containers/SegmentHeadingFormContainer';
import { t, admin } from '../../../lib/utils';

export default class Heading extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            expanded: false,
            active: false
        }
        this.toggle = this.toggle.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }


    componentWillReceiveProps(nextProps) {
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

    handleClick(tape, time) {
        if (this.props.data.subheadings.length > 0) {
            this.toggle();
        } else {
            let tabIndex = (this.props.interview.lang === this.props.locale) ? 0 : 1;
            this.props.handleSegmentClick(tape, time, false);
        }
    }

    subHeadings() {
        if (this.props.data.main) {
            return <div className={this.state.expanded ? 'expanded' : 'collapsed'}>
                {this.props.data.subheadings.map((heading, index) => {
                    return <div><SubHeadingContainer
                        key={'heading-' + index}
                        data={heading}
                        nextSubHeading={this.props.data.subheadings[index+1] || this.props.nextHeading}
                    />{this.editHeading()}
                    </div>
                })}
            </div>;
        }
    }

    expandable() {
        if (this.props.data.subheadings.length === 0) {
            return <div className='heading-ico active'/>
        } else {
            let icoClass = this.state.expanded ? 'heading-ico active' : 'heading-ico';
            return <div className={icoClass}
                        onClick={() => this.toggle()}/>
        }
    }

    editHeading() {
        if (admin(this.props, this.props.data.segment)) {
            return (
                <span
                    className='flyout-sub-tabs-content-ico-link'
                    onClick={() => this.props.openArchivePopup({
                        content: <SegmentHeadingFormContainer
                              segment={this.props.data.segment}
                              contentLocale={this.props.locale} />
                    })}
                >
                        <i className="fa fa-pencil"/>
                </span>
            )
        }
    }

    render() {
        let css = 'mainheading ' + (this.state.active ? 'active' : 'inactive');
        return (
            <div className='heading'>
                {this.expandable()}
                <div
                    className={css}
                    onClick={() => this.handleClick(this.props.data.tape_nbr, this.props.data.time)}
                >
                    <span className='chapter-number'>{this.props.data.chapter}</span>
                    <span className='chapter-text' dangerouslySetInnerHTML={{__html: this.props.data.heading}} />
                    {this.editHeading()}
                </div>
                {this.subHeadings()}
            </div>
        )
    }
}
