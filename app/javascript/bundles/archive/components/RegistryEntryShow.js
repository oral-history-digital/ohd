import React from 'react';
import { t } from '../../../lib/utils';
import {Link} from 'react-router-dom';

export default class RegistryEntryShow extends React.Component {

    componentDidMount() {
        this.loadRegistryReferenceTypes()
    }

    componentDidUpdate() {
        this.loadRegistryReferenceTypes()
    }

    
    parentRegistryEntry() {
        if (this.props.registryEntryParent){
            return (
                <div>
                    <span><b>{t(this.props, 'edit.registry_entry.parent') + ': '}</b></span>
                    <span>{this.props.registryEntryParent.name[this.props.locale]}</span>
                </div>
            )
        }
    }

    fetchInterview(id) {
        if(!this.props.interviewsStatus || !this.props.interviewsStatus[id]) {
            this.props.fetchData('interviews', id)
        }
    }

    fetchSegment(id) {
        if(!this.props.segmentsStatus || !this.props.segmentsStatus[id]) {
            this.props.fetchData('segments', id)
        }
    }

    loadRegistryReferenceTypes() {
        if (!this.props.registryReferenceTypesStatus) {
            this.props.fetchData('registry_reference_types');
        }
    }

    refObject(rr) {
        let ref_object_string = ''
        switch (rr.ref_object_type.toLowerCase()) {
            case 'interview':
                this.fetchInterview(rr.ref_interview_archive_id)
                if(this.props.interviewsStatus && this.props.interviewsStatus[rr.ref_interview_archive_id] && this.props.interviewsStatus[rr.ref_interview_archive_id].split('-')[0] === 'fetched') {
                    ref_object_string = `${this.props.interviews[rr.ref_interview_archive_id].short_title[this.props.locale]} (${this.props.interviews[rr.ref_interview_archive_id].archive_id})`
                }
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

            case 'segment':
                this.fetchSegment(rr.ref_object_id)
                if(this.props.segmentsStatus && this.props.segmentsStatus[rr.ref_object_id] && this.props.segmentsStatus[rr.ref_object_id].split('-')[0] === 'fetched') {
                    let interview_id = this.props.segments[rr.ref_object_id].interview_archive_id
                    this.fetchInterview(interview_id)
                    if (this.props.interviewsStatus && this.props.interviewsStatus[interview_id] && this.props.interviewsStatus[interview_id].split('-')[0] === 'fetched') {
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
                return '';
        }
    }

    registryReferences() {
        if (this.props.registryReferenceTypesStatus && this.props.registryReferenceTypesStatus.split('-')[0] === 'fetched') {
            let references = []
            for (var r in this.props.registryEntry.registry_references) {
                let rr = this.props.registryEntry.registry_references[r]
                let rr_type = this.props.registryReferenceTypes[rr.registry_reference_type_id]
                
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
            return references;
        }
    }

    render() {
        return (
            <div>
                {this.parentRegistryEntry()}
                <br/>
                <h4>
                    {t(this.props, 'activerecord.models.registry_references.other')}
                    :
                </h4>
                <ul>
                    {this.registryReferences()}
                </ul>

            </div>
        );
    }
}
