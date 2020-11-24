import React from 'react';
import RegistryNameFormContainer from '../containers/RegistryNameFormContainer';
import { t, admin } from '../../../lib/utils';

export default class RegistryName extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            showConfirmDeleteButton: false
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

    destroy() {
        this.props.deleteData(this.props, 'registry_names', this.props.registryName.id, null, null, false);
    }

    confirmDeleteButton() {
        if (
            this.props.registryName &&
            admin(this.props, this.props.registryName) &&
            this.state.showConfirmDeleteButton
        ) {
            return <div
                className='flyout-sub-tabs-content-ico-link warn'
                title={t(this.props, 'really_destroy')}
                onClick={() => this.destroy()}
            >
                <i className="fa fa-trash-o"></i>
            </div>
        }
    }

    delete() {
        if (
            this.props.registryName &&
            admin(this.props, this.props.registryName) &&
            !this.state.showConfirmDeleteButton
        ) {
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'delete')}
                onClick={() => this.setState({showConfirmDeleteButton: true})}
            >
                <i className="fa fa-trash-o"></i>
            </div>
        } else {
            return null;
        }
    }

    form() {
        let _this = this;
        return (
            <RegistryNameFormContainer 
                registryName={this.props.registryName}
                registryEntryId={this.props.registryEntryId}
                submitData={this.props.submitData}
                formClasses={this.props.formClasses}
                onSubmitCallback={() => _this.setEditing()}
            />
        )
    }

    show() {
        let translation = this.props.registryName.translations.find(t => t.locale === this.props.locale);
        return (
            <span>{translation.descriptor}</span>
        )
    }

    render() {
        return (
            <div>
                {this.state.editing ? this.form() : this.show()}
                {this.editButton()}
                {this.delete()}
                {this.confirmDeleteButton()}
            </div>
        )
    }
}
