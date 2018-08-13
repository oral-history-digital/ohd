import React from 'react';

import AnnotationFormContainer from '../containers/AnnotationFormContainer';
import AnnotationContainer from '../containers/AnnotationContainer';
import { t, admin } from '../../../lib/utils';

export default class Annotations extends React.Component {

    annotations() {
        let annotations = [];
        for (var c in this.props.segment.annotations) {
            let annotation = this.props.segment.annotations[c];
            annotations.push(<AnnotationContainer annotation={annotation} segment={this.props.segment} key={`annotation-${annotation.id}`} locale={this.props.locale} />);
        }
        return annotations;
    }

    addAnnotation() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.annotation.new')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.annotation.new'),
                    content: <AnnotationFormContainer 
                                 segment={this.props.segment}
                                 locale={this.props.locale}
                             />
                })}
            >
                <i className="fa fa-plus"></i>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.annotations()}
                {this.addAnnotation()}
            </div>
        )
    }
}

