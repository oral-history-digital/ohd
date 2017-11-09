import React from 'react';
import '../../../css/headings';

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

  handleClick(time) {
    this.props.handleSegmentClick(time);
    this.toggle();
  }

  subHeadings() {
    if(this.props.data.main) {
      return <div className={this.state.expanded ? 'expanded' : 'collapsed'}>
               {this.props.data.subheadings.map( (heading, index) => {
                 return <div key={'heading-' + index} >
                          <div onClick={() => this.props.handleSegmentClick(heading.time)} className='subheading'>
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
        <div className={icoClass}></div>
        <div 
          className='mainheading'
          onClick={() => this.handleClick(this.props.data.time)} 
        >
          {this.props.data.heading}
        </div>
        {this.subHeadings()}
      </div>
    )
  }
}

