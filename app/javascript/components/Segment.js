import React from 'react';
import '../css/segments';

export default class Segment extends React.Component {
  render () {
    let active = this.props.data.end_time >= this.props.time && this.props.data.start_time < this.props.time; 
    let klass = 'segment ' + (active ? 'active' : 'inactive');
    return (
      <div 
        onClick={() => this.props.handleClick(this.props.data.time)} 
        className={klass}
      >
        <div className='text'>{this.props.data.transcripts[this.props.data.lang]}</div>
        <div className='annotations'>
          {this.props.data.annotation_texts.map( (annotation, index) => {
            return <p key={"annotation-" + index} >{annotation}</p>
          })}
        </div>
      </div>
    )
  }
}

