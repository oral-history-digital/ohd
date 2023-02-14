import projectByDomain from './projectByDomain';

export default function pathBase(props) {
    if (props.projectId === 'ohd' || !props.projectId || projectByDomain(props.projects)) {
        return `/${props.locale}`;
    } else {
        return `/${props.projectId}/${props.locale}`;
    }
}
