import React from 'react';
import UserContentFormContainer from '../containers/UserContentFormContainer';
import '../../../css/segments';

export default class Segment extends React.Component {

  css() {
    let active = this.props.data.end_time >= this.props.transcriptTime && this.props.data.start_time <= this.props.transcriptTime; 
    return 'segment ' + (active ? 'active' : 'inactive');
  }

  transcript() {
    let locale = this.props.originalLocale ? this.props.interview.lang : this.props.locale
    return this.props.data.transcripts[locale]
  }

    userContentForm() {
        return  <UserContentFormContainer 
                    properties={{}}
                    reference_id={this.props.data.id}
                    reference_type='Segment'
                    mediaId={this.props.data.media_id}
                    type='UserAnnotation'
                />
    }

  render () {
    return (
      <div 
        onClick={() => this.props.handleSegmentClick(this.props.data.time)} 
        className={this.css()}
      >
        <div className='text'>{this.transcript()}</div>
        <div 
            className='annotate' 
            onClick={() => this.props.openArchivePopup({
                title: 'Add Annotation', 
                content: this.userContentForm()
            })}
        >
            Annotate
        </div>
        <div className='annotations'>
          {this.props.data.annotation_texts.map( (annotation, index) => {
            return <p className='annotation' key={"annotation-" + index} >{annotation}</p>
          })}
        </div>
        <div className='references'>
          {this.props.data.references.map( (reference, index) => {
            return <p className='reference' key={"reference-" + index} >{reference.desc[this.props.data.locale]}</p>
          })}
        </div>
      </div>
    )
  }
}

