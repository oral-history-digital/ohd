import React from 'react';
import RegistryNameFormContainer from '../containers/RegistryNameFormContainer';
import { t, admin } from '../../../lib/utils';

export default class RegistryName extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: false,
        };
        this.setEditing = this.setEditing.bind(this);
    }

    setEditing() {
        this.setState({editing: !this.state.editing});
    }

    editButton() {
        return (
            <span
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, `edit.default.${this.state.editing ? 'cancel' : 'edit'}`)}
                onClick={() => this.setEditing()}
            >
                <i className={`fa fa-${this.state.editing ? 'times' : 'pencil'}`}></i>
            </span>
        )
    }

    //destroy() {
        //this.props.deleteData(this.props, pluralize(this.props.scope), this.props.data.id, null, null, false);
        //this.props.closeArchivePopup();
    //}

    //delete() {
        //if (
            //this.props.registryName &&
            //admin(this.props, this.props.registryName)
        //) {
            //return <div
                //className='flyout-sub-tabs-content-ico-link'
                //title={t(this.props, 'delete')}
                //onClick={() => this.props.openArchivePopup({
                    //title: t(this.props, 'delete'),
                    //content: (
                        //<div>
                            //<div className='any-button' onClick={() => this.destroy()}>
                                //{t(this.props, 'delete')}
                            //</div>
                        //</div>
                    //)
                //})}
            //>
                //<i className="fa fa-trash-o"></i>
            //</div>
        //} else {
            //return null;
        //}
    //}

    form() {
        let _this = this;
        return (
            <RegistryNameFormContainer 
                registryName={this.props.registryName}
                registryEntryId={this.props.registryEntryId}
                submitData={function(params){_this.props.submitData(_this.props, params);_this.setEditing()}}
            />
        )
    }

    show() {
        let translations = this.props.registryName.translations || this.props.registryName.translations_attributes;
        let translation = translations.find(t => t.locale === this.props.locale);
        return (
            <span>{translation.descriptor}</span>
        )
    }

    render() {
        return (
            <div>
                {this.state.editing ? this.form() : this.show()}
                {this.editButton()}
            </div>
        )
    }
}
