import React from 'react';
import '../../../css/segments';

export default class Segment extends React.Component {

  css() {
    let active = this.props.data.end_time >= this.props.time && this.props.data.start_time <= this.props.time; 
    return 'segment ' + (active ? 'active' : 'inactive');
  }

  render () {
    return (
      <div 
        onClick={() => this.props.handleClick(this.props.data.time)} 
        className={this.css()}
      >
        <div className='text'>{this.props.data.transcripts[this.props.data.lang]}</div>
        <div className='annotations'>
          {this.props.data.annotation_texts.map( (annotation, index) => {
            return <p className='annotation' key={"annotation-" + index} >{annotation}</p>
          })}
        </div>
        <div className='references'>
          {this.props.data.references.map( (reference, index) => {
            return <p className='reference' key={"reference-" + index} >{reference[this.props.data.lang]}</p>
          })}
        </div>
      </div>
    )
  }
}

