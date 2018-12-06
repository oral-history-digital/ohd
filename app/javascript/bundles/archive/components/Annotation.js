import React from 'react';

import AnnotationFormContainer from '../containers/AnnotationFormContainer';
import { t, pluralize, admin } from '../../../lib/utils';

export default class Annotation extends React.Component {

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.annotation.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.annotation.edit'),
                    content: <AnnotationFormContainer 
                                 annotation={this.props.annotation} 
                                 segment={this.props.segment}
                                 locale={this.props.locale}
                             />
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    destroy() {
        this.props.deleteData('annotations', this.props.annotation.id, null, null, true);
        this.props.closeArchivePopup();
    }

    delete() {
        if (this.props.annotation) {
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.annotation.delete')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.annotation.delete'),
                    content: (
                        <div>
                            <p dangerouslySetInnerHTML={{__html: this.props.annotation.text[this.props.locale]}} />
                            <div className='any-button' onClick={() => this.destroy()}>
                                {t(this.props, 'edit.annotation.delete')}
                            </div>
                        </div>
                    )
                })}
            >
                <i className="fa fa-trash-o"></i>
            </div>
        } else {
            return null;
        }
    }

    buttons() {
        if (admin(this.props)) {
            return (
                <span className={'flyout-sub-tabs-content-ico'}>
                    {this.edit()}
                    {this.delete()}
                </span>
            )
        }
    }

    annotation() {
        return (
            <p 
                className='content-trans-text-element-data'
                key={"annotation-" + this.props.annotation.id}
                dangerouslySetInnerHTML={{__html: this.props.annotation.text[this.props.locale]}}
            />
        )
    }

    render() {
        return (
            <div>
                {this.annotation()}
                {this.buttons()}
            </div>
        )
    }
}

