import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { PopupMenu } from 'modules/ui';
import { AuthorizedContent } from 'modules/auth';
import { t } from 'modules/i18n';
import RegistryHierarchyFormContainer from './RegistryHierarchyFormContainer';
import RegistryEntryShowContainer from './RegistryEntryShowContainer';
import RegistryEntryFormContainer from './RegistryEntryFormContainer';
import RegistryEntriesContainer from './RegistryEntriesContainer';

export default class RegistryEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            childrenVisible: false,
            editButtonsVisible: false,
        };

        this.showChildren = this.showChildren.bind(this);
    }

    componentDidMount() {
        this.reloadRegistryEntry();
    }

    componentDidUpdate() {
        this.reloadRegistryEntry();
    }

    reloadRegistryEntry() {
        if (
            (
                !this.props.registryEntries[this.props.data.id] &&
                !this.props.registryEntriesStatus[this.props.data.id]
            ) ||
            /^reload/.test(this.props.registryEntriesStatus[this.props.data.id])
        ) {
            this.props.fetchData(this.props, 'registry_entries', this.props.data.id);
        }
    }

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_entry.edit')}
                onClick={() => {
                    this.setState({ editButtonsVisible: false });
                    this.props.openArchivePopup({
                        title: t(this.props, 'edit.registry_entry.edit'),
                        content: <RegistryEntryFormContainer
                            registryEntryId={this.props.data.id}
                            registryEntryParent={this.props.registryEntryParent}
                            />
                    })
                }}
            >
                <i className="fa fa-pencil" />
                {t(this.props, 'edit.registry_entry.edit')}
            </div>
        )
    }

    destroy() {
        this.props.deleteData(this.props, 'registry_entries', this.props.data.id, null, null, true);
        this.props.closeArchivePopup();
    }

    delete() {
        if (this.props.data) {
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'delete')}
                onClick={() => {
                    this.setState({ editButtonsVisible: false });
                    this.props.openArchivePopup({
                        title: t(this.props, 'delete'),
                        content: (
                            <div>
                                <p>{this.props.data.name[this.props.locale]}</p>
                                <div className='any-button' onClick={() => this.destroy()}>
                                    {t(this.props, 'delete')}
                                </div>
                            </div>
                        )
                    })
                }}
            >
                <i className="fa fa-trash-o" />
                {t(this.props, 'delete')}
            </div>
        } else {
            return null;
        }
    }

    rmParent() {
        this.props.deleteData(this.props, 'registry_hierarchies', this.parentRegistryHierarchyId(), null, null, true);
        this.props.closeArchivePopup();
    }

    parentRegistryHierarchyId() {
        return this.props.data.parent_registry_hierarchy_ids[this.props.registryEntryParent.id];
    }

    deleteParent() {
        if (this.props.registryEntryParent) {
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_entry.delete_parent')}
                onClick={() => {
                    this.setState({ editButtonsVisible: false });
                    this.props.openArchivePopup({
                        title: t(this.props, 'edit.registry_entry.delete_parent'),
                        content: (
                            <div>
                                <p>{this.props.registryEntryParent.name[this.props.locale]}</p>
                                <div className='any-button' onClick={() => this.rmParent()}>
                                    {t(this.props, 'delete')}
                                </div>
                            </div>
                        )
                    })
                }}
            >
                <i className="fa fa-minus-circle" />
                {t(this.props, 'edit.registry_entry.delete_parent')}
            </div>
        } else {
            return null;
        }
    }

    addParent() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_entry.add_parent')}
                onClick={() => {
                    this.setState({ editButtonsVisible: false });
                    this.props.openArchivePopup({
                        title: t(this.props, 'edit.registry_entry.add_parent'),
                        content: <RegistryHierarchyFormContainer descendantRegistryEntry={this.props.data} />
                    })
                }}
            >
                <i className="fa fa-sitemap" style={{'transform': 'rotate(180deg)'}} />
                {t(this.props, 'edit.registry_entry.add_parent')}
            </div>
        )
    }

    addRegistryEntry() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_entry.new')}
                onClick={() => {
                    this.setState({ editButtonsVisible: false });
                    this.props.openArchivePopup({
                        title: t(this.props, 'edit.registry_entry.new'),
                        content: <RegistryEntryFormContainer registryEntryParent={this.props.data} />
                    })
                }}
            >
                <i className="fa fa-sitemap" />
                {t(this.props, 'edit.registry_entry.new')}
            </div>
        )
    }

    osmLink() {
        if((this.props.data.latitude + this.props.data.longitude) !== 0 ) {
            return (
                <a
                    href={`https://www.openstreetmap.org/?mlat=${this.props.data.latitude}&mlon=${this.props.data.longitude}&zoom=6`}
                    target="_blank"
                    rel="noreferrer"
                    className="flyout-sub-tabs-content-ico-link"
                    title={`${this.props.data.latitude}, ${this.props.data.longitude}`}
                >
                    <i className='fa fa-globe' />
                    &nbsp;
                </a>
            )
        }
        else {
            return null;
        }
    }

    buttons() {
        return (
            <div className="flyout-sub-tabs-content-ico">
                {this.osmLink()}
                {this.editButtons()}
            </div>
        )
    }

    editButtons() {
        return (
            <AuthorizedContent object={this.props.data}>
                <PopupMenu>
                    <PopupMenu.Item>{this.edit()}</PopupMenu.Item>
                    <PopupMenu.Item>{this.delete()}</PopupMenu.Item>
                    <PopupMenu.Item>{this.addRegistryEntry()}</PopupMenu.Item>
                    <PopupMenu.Item>{this.addParent()}</PopupMenu.Item>
                    <PopupMenu.Item>{this.deleteParent()}</PopupMenu.Item>
                </PopupMenu>
            </AuthorizedContent>
        );
    }

    showChildren() {
        this.setState(prevState => ({ childrenVisible: !prevState.childrenVisible }));
    }

    entry() {
        const { data, locale, openArchivePopup } = this.props;
        const hasReferences = data.registry_references_count > 0;

        return (
            <div
                id={`entry_${data.id}`}
                key={data.id}
                className={classNames('RegistryEntry-label', {
                    'is-clickable': hasReferences,
                })}
                onClick={() => {
                    if (hasReferences) {
                        openArchivePopup({
                            content: (
                                <RegistryEntryShowContainer
                                    registryEntryId={data.id}
                                    registryEntryParent={this.props.registryEntryParent}
                                />
                            )
                        });
                    }
                }}
            >
                {data.name[locale]}

                <AuthorizedContent object={data}>
                    {` (ID: ${data.id})`}
                </AuthorizedContent>
            </div>
        )
    }

    showHideChildren() {
        const { data } = this.props;

        if (data.children_count > 0) {
            return (
                <div
                    className="RegistryEntry-toggleChildren"
                    title={`${data.children_count} ${t(this.props, 'edit.registry_entry.show_children')}`}
                    onClick={this.showChildren}
                    >
                    <i className={classNames('fa fa-fw', this.state.childrenVisible ? 'fa-minus' : 'fa-plus')}></i>
                </div>
            );
        } else {
            return (
                <div className="RegistryEntry-toggleChildren">
                    <i className="fa fa-fw" />
                </div>
            );
        }
    }

    description() {
        if(this.props.data.desc !== ''){
            return (
                <div style={{color: 'grey', marginTop: '6px' }}>{this.props.data.desc}</div>
            )
        }
    }

    renderCheckbox() {
        return (
            <AuthorizedContent object={{type: 'RegistryEntry', action: 'update'}}>
                <input
                    type='checkbox'
                    className='select-checkbox'
                    checked={this.props.selectedRegistryEntryIds.indexOf(this.props.data.id) > 0}
                    onChange={() => {this.props.addRemoveRegistryEntryId(this.props.data.id)}}
                />
            </AuthorizedContent>
        );
    }

    render() {
        return (
            <li className={classNames('RegistryEntry', this.props.className)}>
                <div className="RegistryEntry-content">
                    {this.renderCheckbox()}
                    {this.showHideChildren()}
                    {this.entry()}
                    {this.buttons()}
                </div>
                {this.props.children}
                {
                    this.state.childrenVisible && (
                    <RegistryEntriesContainer
                        className="RegistryEntry-children"
                        registryEntryParent={this.props.data}
                    />
                )}
            </li>
        )
    }
}

RegistryEntry.propTypes = {
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    registryEntriesStatus: PropTypes.object.isRequired,
    registryEntryParent: PropTypes.object.isRequired,
    selectedRegistryEntryIds: PropTypes.array.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    openArchivePopup: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    addRemoveRegistryEntryId: PropTypes.func.isRequired,
};
