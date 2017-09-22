import React from 'react';
import Heading from '../components/Heading';

export default class TableOfContents extends React.Component {

  render () {
    return ( 
      <div>
        {this.props.headings.map( (heading, index) => {
          return <Heading 
                   key={'mainheading-' + index}
                   data={heading}
                   handleSegmentClick={this.props.handleSegmentClick}
                 />
        })}
      </div>
    );
  }
}

