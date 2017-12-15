import React from 'react';

export default class Heading extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      expanded: false,
    }

    this.toggle = this.toggle.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  toggle() {
    if (this.props.data.main) {
      this.setState(prevState => ({
        expanded: !prevState.expanded
      }));
    }
  }

  handleClick(tape, time) {
      //if(this.props.data.subheadings.length > 0) {
          this.toggle();
      //} else {
          this.props.handleSegmentClick(tape, time);
      //}
  }

  subHeadings() {
    if(this.props.data.main) {
      return <div className={this.state.expanded ? 'expanded' : 'collapsed'}>
               {this.props.data.subheadings.map( (heading, index) => {
                 return <div key={'heading-' + index} >
                          <div onClick={() => this.props.handleSegmentClick(heading.tape_nbr, heading.time)} className='subheading'>
                            {heading.heading}
                          </div> 
                        </div>;
               })}
             </div>;
    }
  }

  render () {
    let icoClass = this.state.expanded ? 'heading-ico active': 'heading-ico' ;
    return (
      <div className='heading'>
        <div className={icoClass}
             onClick={() => this.toggle()}/>
        <div 
          className='mainheading'
          onClick={() => this.handleClick(this.props.data.tape_nbr, this.props.data.time)} 
        >
          {this.props.data.heading}
        </div>
        {this.subHeadings()}
      </div>
    )
  }
}

