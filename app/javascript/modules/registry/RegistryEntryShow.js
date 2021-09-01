import { Component } from 'react';
import { Link } from 'react-router-dom';

import { PixelLoader } from 'modules/spinners';
import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import { admin } from 'modules/auth';

export default class RegistryEntryShow extends Component {

    componentDidMount() {
        this.loadWithAssociations();
        this.loadRegistryReferenceTypes()
    }

    componentDidUpdate() {
        this.loadWithAssociations();
        this.loadRegistryReferenceTypes()
    }

    loadWithAssociations() {
        if (
            !this.registryEntry()?.associations_loaded &&
            this.props.registryEntriesStatus[this.props.registryEntryId] !== 'fetching'
        ) {
            this.props.fetchData(this.props, 'registry_entries', this.props.registryEntryId, null, 'with_associations=true');
        }
    }

    fetchInterview(archiveId) {
        if(archiveId && !this.props.interviewsStatus[archiveId]) {
            this.props.fetchData(this.props, 'interviews', archiveId)
            this.props.fetchData(this.props, 'interviews', archiveId, 'short_title')
        }
    }

    interviewIsFetched(archiveId) {
        return this.props.interviewsStatus[archiveId] && this.props.interviewsStatus[archiveId].split('-')[0] === 'fetched'
    }

    fetchSegment(id) {
        if(id && !this.props.segmentsStatus[id]) {
            this.props.fetchData(this.props, 'segments', id)
        }
    }

    segmentIsFetched(id) {
        return this.props.segmentsStatus[id] && this.props.segmentsStatus[id].split('-')[0] === 'fetched'
    }

    loadRegistryReferenceTypes() {
        if (!this.props.registryReferenceTypesStatus[`for_projects_${this.props.project?.id}`]) {
            this.props.fetchData(this.props, 'registry_reference_types', null, null, `for_projects=${this.props.project?.id}`);
        }
    }

    loader(references){
        if(!references || ( Object.keys(references).length !== Object.keys(this.registryEntry().registry_references).length ) ){
            return <PixelLoader/>
        }
    }

    registryEntry() {
        return this.props.registryEntries[this.props.registryEntryId];
    }

    tape(segment) {
        if (segment && segment.tape_count && segment.tape_count > 1){
            return `(${t(this.props, 'tape')} ${segment.tape_nbr}/${segment.tape_count})`
        }
        else {
            return '';
        }
    }

    refObject(rr) {
        let ref_object_string = ''
        let isAllowedToSee =  admin(this.props, {type: 'General'}, 'edit') ||
            this.props.interviews[rr.archive_id]?.workflow_state === 'public'

        switch (rr.ref_object_type) {
            case 'Segment':
                if(this.segmentIsFetched(rr.ref_object_id) && isAllowedToSee) {
                    if (this.interviewIsFetched(rr.archive_id)) {
                        ref_object_string = this.props.segments[rr.ref_object_id].timecode + ' ' +
                                            this.tape(this.props.segments[rr.ref_object_id]) + ' ' +
                                            t(this.props, 'in') + ' ' +
                                            this.props.interviews[rr.archive_id]?.short_title[this.props.locale] + ' ' +
                                            `(${rr.archive_id})`
                        return (
                            <Link className={'search-result-link'}
                                onClick={() => {
                                    this.props.closeArchivePopup();
                                    this.props.setArchiveId(rr.archive_id);
                                    this.props.sendTimeChangeRequest(this.props.segments[rr.ref_object_id].tape_nbr, this.props.segments[rr.ref_object_id].time)
                                }}
                                to={pathBase(this.props) + '/interviews/' + rr.archive_id}
                            >
                                {`${ref_object_string}`}
                            </Link>
                        )
                    } else if (rr.archive_id) {
                        this.fetchInterview(rr.archive_id)
                    }
                } else if (rr.ref_object_id) {
                    this.fetchSegment(rr.ref_object_id)
                }
                break;
            default:
                if(this.interviewIsFetched(rr.archive_id) && isAllowedToSee) {
                    ref_object_string = `${this.props.interviews[rr.archive_id]?.short_title[this.props.locale]} (${rr.archive_id})`
                    return (
                        <Link className={'search-result-link'}
                            onClick={() => {
                                this.props.closeArchivePopup();
                                this.props.setArchiveId(rr.archive_id);
                            }}
                            to={pathBase(this.props) + '/interviews/' + rr.archive_id}
                        >
                            {`${ref_object_string}`}
                        </Link>
                    )
                } else if (rr.archive_id) {
                    this.fetchInterview(rr.archive_id)
                }
                break;
        }
    }

    registryReferences() {
        let references = []
        if (
            this.props.registryReferenceTypesStatus[`for_projects_${this.props.project?.id}`] &&
            this.props.registryReferenceTypesStatus[`for_projects_${this.props.project?.id}`].split('-')[0] === 'fetched'
        ) {
            for (var r in this.registryEntry().registry_references) {
                let rr = this.registryEntry().registry_references[r]
                let rr_type = this.props.registryReferenceTypes[rr.registry_reference_type_id]
                let ro = this.refObject(rr);

                if (ro) {
                    references.push(
                        <li
                            key={`this.registryEntry().registry_reference-${r}`}
                        >
                            <strong>
                                {rr_type && `${rr_type.name[this.props.locale]} `}
                            </strong>
                            {`${t(this.props, 'in')} ${t(this.props, rr.ref_object_type.toLowerCase())} `}
                            {ro}
                        </li>
                    );
                }
            }
        }
        return references;
    }

    show(id, key) {
        if(this.registryEntry().ancestors[id]){
            return (
                <span className={'breadcrumb'} key={key}>
                    {this.registryEntry().ancestors[id].name[this.props.locale]}
                    {/* {` (ID: ${id})`} */}
                </span>
            )
        } else {
            return null;
        }
    }

    breadCrumb() {
        let paths = []
        let bread_crumbs = this.registryEntry().bread_crumb;
        if (bread_crumbs) {
            Object.keys(bread_crumbs).map((id, key) => {
                let breadCrumbPath = [];
                breadCrumbPath.push(this.show(id, `${key}`));
                let current = bread_crumbs[id]
                let counter = 0
                while (current) {
                    counter = counter + 1;
                    let currentId = Object.keys(current)[0];
                    breadCrumbPath.push(this.show(currentId, `${key}-${counter}`));
                    current = current[currentId];
                }
                paths.push(breadCrumbPath.reverse().splice(1)); // remove first "Register"
                paths.push(<br key={key}/>)
            })
            paths.splice(-1,1) //remove last <br />
        }
        return paths;
    }

    osmLink() {
        if((this.registryEntry().latitude + this.registryEntry().longitude) !== 0 ) {
            return(
                <small style={{float: 'right'}}>
                    <i className='fa fa-globe' />
                    &nbsp;
                    <a
                        href={`https://www.openstreetmap.org/?mlat=${this.registryEntry().latitude}&mlon=${this.registryEntry().longitude}&zoom=6`}
                        target="_blank"
                        rel="noopener"
                        >
                        {`${this.registryEntry().latitude}, ${this.registryEntry().longitude}`}
                        &nbsp;
                    </a>
                </small>
            )
        } else {
            return null;
        }
    }

    render() {
        if (this.registryEntry()?.associations_loaded) {
            let references = this.registryReferences();
            return (
                <div>
                    <div>
                    {this.osmLink()}
                    {this.breadCrumb()}
                    </div>
                    <h3>
                        {this.registryEntry().name[this.props.locale]}
                    </h3>
                    <p>
                        {this.registryEntry().notes[this.props.locale]}
                    </p>
                    <h4>
                        {references.length}
                        &nbsp;
                        {(references.length === 1) ? t(this.props, 'activerecord.models.registry_reference.one') : t(this.props, 'activerecord.models.registry_reference.other')}
                        {references.length > 0 ? ':' : ''}
                    </h4>
                    <br/>
                    <ul>
                        {references}
                    </ul>
                    {this.loader(references)}

                </div>
            );
        } else {
            return null;
        }
    }
}
