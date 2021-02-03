import React from 'react';
import PropTypes from 'prop-types';

import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import RegistryNameFormContainer from './RegistryNameFormContainer';

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
        return (
            <RegistryNameFormContainer
                registryName={this.props.registryName}
                registryEntryId={this.props.registryEntryId}
                submitData={this.props.submitData}
                formClasses={this.props.formClasses}
                onSubmitCallback={this.setEditing}
            />
        )
    }

    show() {
        let translation = this.props.registryName.translations.find(t => t.locale === this.props.locale);
        translation ||= this.props.registryName.translations[0];
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

RegistryName.propTypes = {
    registryName: PropTypes.object.isRequired,
    registryEntryId: PropTypes.number.isRequired,
    formClasses: PropTypes.string,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    submitData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
};
