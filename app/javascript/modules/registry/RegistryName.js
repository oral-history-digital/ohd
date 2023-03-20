import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTimes, FaTrash } from 'react-icons/fa';

import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import RegistryNameFormContainer from './RegistryNameFormContainer';

export default class RegistryName extends Component {
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
        const { editing } = this.state;

        return (
            <button
                type="button"
                className="Button Button--transparent Button--icon"
                title={t(this.props, `edit.default.${editing ? 'cancel' : 'edit'}`)}
                onClick={() => this.setEditing()}
            >
                {
                    editing ?
                        <FaTimes className="Icon Icon--editorial" /> :
                        <FaPencilAlt className="Icon Icon--editorial" />
                }
            </button>
        )
    }

    destroy() {
        this.props.deleteData(this.props, 'registry_names', this.props.registryName.id, null, null, false);
    }

    confirmDeleteButton() {
        if (
            this.props.registryName &&
            admin(this.props, this.props.registryName, 'destroy') &&
            this.state.showConfirmDeleteButton
        ) {
            return (
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    title={t(this.props, 'really_destroy')}
                    onClick={() => this.destroy()}
                >
                    <FaTrash className="Icon Icon--danger" />
                </button>
            );
        }
    }

    delete() {
        if (
            this.props.registryName &&
            admin(this.props, this.props.registryName, 'destroy') &&
            !this.state.showConfirmDeleteButton
        ) {
            return (
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    title={t(this.props, 'delete')}
                    onClick={() => this.setState({showConfirmDeleteButton: true})}
                >
                    <FaTrash className="Icon Icon--editorial" />
                </button>
            );
        } else {
            return null;
        }
    }

    form() {
        return (
            <RegistryNameFormContainer
                registryName={this.props.registryName}
                registryEntryId={this.props.registryEntryId}
                onSubmit={this.props.submitData}
                formClasses={this.props.formClasses}
                onSubmitCallback={this.setEditing}
            />
        )
    }

    show() {
        let translation = this.props.registryName.translations_attributes.find(t => t.locale === this.props.locale);
        translation ||= this.props.registryName.translations_attributes[0];
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
    user: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    submitData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
};
