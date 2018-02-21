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
        let endTime =  (this.props.data.next_start_time) ? this.props.data.next_start_time : this.props.data.interview_duration;
        let active = this.props.data.next_start_time > nextProps.transcriptTime && this.props.data.start_time <= nextProps.transcriptTime;
        if (active !== this.state.active) {
            this.setState({
                active: active
            })
        }
    }


    handleClick(tape, time) {
            this.props.handleSegmentClick(tape, time);
    }


    render() {
        let css = 'subheading ' + (this.state.active ? 'active' : 'inactive');
        return (
                <div
                    className={css}
                    onClick={() => this.handleClick(this.props.data.tape_nbr, this.props.data.time)}
                >
                    {this.props.data.heading}
                </div>

        )
    }
}

