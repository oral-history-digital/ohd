import React from 'react';

export default class Heading extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            active: false
        }
        this.handleClick = this.handleClick.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        let endTime = (this.props.nextSubHeading) ? this.props.nextSubHeading.time : this.props.data.interview_duration;
        let active = this.props.tape === this.props.data.tape_nbr && endTime >= nextProps.transcriptTime && this.props.data.time <= nextProps.transcriptTime;
        if (active !== this.state.active) {
            this.setState({
                active: active
            })
        }
    }


    handleClick(tape, time) {
            // let tabIndex = (this.props.interview.lang === this.props.locale) ? 0 : 1;
            this.props.handleSegmentClick(tape, time, false);
    }


    render() {
        let css = 'subheading ' + (this.state.active ? 'active' : 'inactive');
        return (
            <div>
                <div
                    className={css}
                    onClick={() => this.handleClick(this.props.data.tape_nbr, this.props.data.time)}
                >
                    <div className='chapter-number'>{this.props.data.chapter}</div><div className='chapter-text'>{this.props.data.heading}</div>
                </div>
            </div>
        )
    }
}

