import React from 'react';
import { t } from '../../../lib/utils';
import {Link} from 'react-router-dom';
import PixelLoader from '../../../lib/PixelLoader'

export default class RegistryEntryShow extends React.Component {

    componentDidMount() {
        this.loadRegistryReferenceTypes()
    }

    componentDidUpdate() {
        this.loadRegistryReferenceTypes()
    }

    fetchInterview(archiveId) {
        if(!this.props.interviewsStatus || !this.props.interviewsStatus[archiveId]) {
            this.props.fetchData('interviews', archiveId)
        }
    }

    interviewIsFetched(archiveId) {
        return this.props.interviewsStatus && this.props.interviewsStatus[archiveId] && this.props.interviewsStatus[archiveId].split('-')[0] === 'fetched'
    }

    fetchSegment(id) {
        if(!this.props.segmentsStatus || !this.props.segmentsStatus[id]) {
            this.props.fetchData('segments', id)
        }
    }

    segmentIsFetched(id) {
        return this.props.segmentsStatus && this.props.segmentsStatus[id] && this.props.segmentsStatus[id].split('-')[0] === 'fetched' 
    }

    loadRegistryReferenceTypes() {
        if (!this.props.registryReferenceTypesStatus) {
            this.props.fetchData('registry_reference_types');
        }
    }

    loader(){
        if(!this.registryReferences() || ( Object.keys(this.registryReferences()).length !== Object.keys(this.props.registryEntry.registry_references).length ) ){
            return <PixelLoader/>
        }
    }

    refObject(rr) {
        let ref_object_string = ''
        switch (rr.ref_object_type.toLowerCase()) {
            case 'interview':
                this.fetchInterview(rr.ref_interview_archive_id)
                if(this.interviewIsFetched(rr.ref_interview_archive_id)) {
                    ref_object_string = `${this.props.interviews[rr.ref_interview_archive_id].short_title[this.props.locale]} (${this.props.interviews[rr.ref_interview_archive_id].archive_id})`
                    return (
                        <Link className={'search-result-link'}
                        onClick={() => {
                            this.props.closeArchivePopup();
                            this.props.setArchiveId(rr.ref_interview_archive_id);
                        }}
                        to={'/' + this.props.locale + '/interviews/' + rr.ref_interview_archive_id}
                        >
                            {`${ref_object_string}`}
                        </Link>
                    )
                }

            case 'segment':
                this.fetchSegment(rr.ref_object_id)
                if(this.segmentIsFetched(rr.ref_object_id)) {
                    let interview_id = this.props.segments[rr.ref_object_id].interview_archive_id
                    this.fetchInterview(interview_id)
                    if (this.interviewIsFetched(interview_id)) {
                        ref_object_string = `${this.props.segments[rr.ref_object_id].timecode} ${t(this.props, 'in')} ${this.props.interviews[interview_id].short_title[this.props.locale]} (${this.props.interviews[interview_id].archive_id})`
                        return (
                            <Link className={'search-result-link'}
                            onClick={() => {
                                this.props.closeArchivePopup();
                                this.props.setArchiveId(this.props.segments[rr.ref_object_id].interview_archive_id);
                                this.props.setTapeAndTime(this.props.segments[rr.ref_object_id].tape_nbr, this.props.segments[rr.ref_object_id].time)
                            }}
                            to={'/' + this.props.locale + '/interviews/' + this.props.segments[rr.ref_object_id].interview_archive_id}
                            >
                                {`${ref_object_string}`}
                            </Link>
                        )
                    } 
                } 
            default:
                return null;
        }
    }

    registryReferences() {
        if (this.props.registryReferenceTypesStatus && this.props.registryReferenceTypesStatus.split('-')[0] === 'fetched') {
            let references = []
            for (var r in this.props.registryEntry.registry_references) {
                let rr = this.props.registryEntry.registry_references[r]
                let rr_type = this.props.registryReferenceTypes[rr.registry_reference_type_id]
                
                if (this.refObject(rr)) {
                    references.push(
                        <li
                            key={`this.props.registryEntry.registry_reference-${r}`} 
                        >
                            <strong>
                                {rr_type && `${rr_type.name[this.props.locale]} `}
                            </strong>
                            {`${t(this.props, 'in')} ${t(this.props, rr.ref_object_type.toLowerCase())} `}
                            {this.refObject(rr)}
                        </li>
                    );
                }
            }
            return references;
        }
    }

    show(id, key) {
        return (
            <span className={'breadcrumb'} key={key}>
                {this.props.registryEntry.ancestors[id].name[this.props.locale]}
                {/* {` (ID: ${id})`} */}
            </span>
        )
    }

    breadCrumb() {
        let paths = []
        // debugger;
        let bread_crumbs = this.props.registryEntry.bread_crumb;
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

    render() {
        return (
            <div>
                <div>
                    {this.breadCrumb()}
                </div>
                <h3>
                    {this.props.registryEntry.name[this.props.locale]}
                </h3>
                <h4>
                    {Object.keys(this.props.registryEntry.registry_references).length}
                    &nbsp;
                    {(Object.keys(this.props.registryEntry.registry_references).length === 1) ? t(this.props, 'activerecord.models.registry_references.one') : t(this.props, 'activerecord.models.registry_references.other')}
                    {(Object.keys(this.props.registryEntry.registry_references).length > 0) ? ':' : ''}
                </h4>
                <br/>
                <ul>
                    {this.registryReferences()}
                </ul>
                {this.loader()}

            </div>
        );
    }
}
