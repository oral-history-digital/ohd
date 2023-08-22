import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';
import classNames from 'classnames';

import { Modal, Checkbox } from 'modules/ui';
import { AuthorizedContent, admin } from 'modules/auth';
import { t } from 'modules/i18n';
import RegistryEntryShowContainer from './RegistryEntryShowContainer';
import RegistryEntries from './RegistryEntries';
import OpenStreetMapLink from './OpenStreetMapLink';
import RegistryEntryEditButtons from './RegistryEntryEditButtons';

export default class RegistryEntry extends Component {
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

    normDataLinks() {
        return this.props.data.norm_data.map( normDatum => {
            return (
                <>
                    <a
                        href={`${normDatum.norm_data_provider.url_without_id}${normDatum.nid}`}
                        target="_blank"
                        rel="noreferrer"
                        className="Link flyout-sub-tabs-content-ico-link"
                        title={t(this.props, 'norm_data.link_hover')}
                    >
                        &nbsp;{normDatum.norm_data_provider.name}&nbsp;
                    </a>
                </>
            )
        })
    }

    showChildren() {
        this.setState(prevState => ({ childrenVisible: !prevState.childrenVisible }));
    }

    entry() {
        const { data, locale, registryEntryParent } = this.props;

        const hasReferences = admin(this.props, {type: 'General'}, 'edit') ?
            data.registry_references_count > 0 :
            data.public_registry_references_count > 0;

        const localizedName = data.name[locale];
        const name = localizedName && localizedName.length > 0 ?
            localizedName :
            <i>{t(this.props, 'modules.registry.name_missing')}</i>;
        const displayName = (<>
            {name}
            <AuthorizedContent object={data} action='update'>
                {` (ID: ${data.id})`}
            </AuthorizedContent>
        </>);

        if (hasReferences) {
            return (
                <Modal
                    title={t(this.props, 'activerecord.models.registry_entry.actions.show')}
                    triggerClassName="Button Button--transparent Button--withoutPadding RegistryEntry-label is-clickable"
                    trigger={displayName}
                >
                    {close => (
                        <RegistryEntryShowContainer
                            registryEntryId={data.id}
                            registryEntryParent={registryEntryParent}
                            onSubmit={close}
                            normDataLinks={this.normDataLinks()}
                        />
                    )}
                </Modal>
            );
        } else {
            return (
                <span className="RegistryEntry-label">{displayName}</span>
            );
        }
    }

    showHideChildren() {
        const { data } = this.props;
        const { childrenVisible } = this.state;

        if (data.children_count > 0) {
            return (
                <button
                    className="Button Button--transparent Button--icon RegistryEntry-toggleChildren"
                    title={`${data.children_count} ${t(this.props, 'edit.registry_entry.show_children')}`}
                    onClick={this.showChildren}
                    >
                    {
                        childrenVisible ?
                            <FaMinus className="Icon Icon--primary" /> :
                            <FaPlus className="Icon Icon--primary" />
                    }
                </button>
            );
        } else {
            return (
                <div className="RegistryEntry-toggleChildren" />
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

    render() {
        const { className, selectedRegistryEntryIds, data, addRemoveRegistryEntryId,
            registryEntryParent, children, hideEditButtons } = this.props;

        const showOpenStreetMapLink = data.latitude + data.longitude !== 0;
        const showEditButtons = !hideEditButtons;

        return (
            <li
                id={`entry_${data.id}`}
                className={classNames('RegistryEntry', className)}
            >
                <div className="RegistryEntry-content">
                    { !this.props.hideCheckbox && <AuthorizedContent object={{type: 'RegistryEntry'}} action='update'>
                        <Checkbox
                            className='select-checkbox'
                            checked={selectedRegistryEntryIds.includes(data.id)}
                            onChange={() => addRemoveRegistryEntryId(data.id)}
                        />
                    </AuthorizedContent> }
                    {showEditButtons && this.showHideChildren()}
                    {this.entry()}

                    <div>
                        <AuthorizedContent object={this.props.data} action='update'>
                            {this.normDataLinks()}
                        </AuthorizedContent>

                        {showOpenStreetMapLink && (
                            <OpenStreetMapLink
                                lat={data.latitude}
                                lng={data.longitude}
                            />
                        )}

                        {showEditButtons && (
                            <AuthorizedContent object={data} action="update">
                                <RegistryEntryEditButtons
                                    registryEntry={data}
                                    parentRegistryEntry={registryEntryParent}
                                />
                            </AuthorizedContent>
                        )}
                    </div>
                </div>
                {children}
                {
                    this.state.childrenVisible && (
                    <RegistryEntries
                        className="RegistryEntry-children"
                        registryEntryParent={data}
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
    hideEditButtons: PropTypes.bool,
    hideCheckbox: PropTypes.bool,
    translations: PropTypes.object.isRequired,
    registryEntries: PropTypes.object.isRequired,
    registryEntriesStatus: PropTypes.object.isRequired,
    registryEntryParent: PropTypes.object.isRequired,
    selectedRegistryEntryIds: PropTypes.array.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    fetchData: PropTypes.func.isRequired,
    addRemoveRegistryEntryId: PropTypes.func.isRequired,
};
