import React from 'react';
import '../css/segments';

export default class Segment extends React.Component {
  render () {
    let active = this.props.data.time >= this.props.time - 5 && this.props.data.time <= this.props.time + 20; 
    let klass = 'segment ' + (active ? 'active' : 'inactive');
    return (
      <div 
        onClick={() => this.props.handleClick(this.props.data.time)} 
        className={klass}
      >
        <div className='text'>{this.props.data.transcripts[this.props.data.lang]}</div>
        <div className='annotations'>
          {this.props.data.annotation_texts.map( (annotation, index) => {
            return <p>{annotation}</p>
          })}
        </div>
      </div>
    )
  }
}

