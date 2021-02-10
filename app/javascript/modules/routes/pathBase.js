import projectByDomain from './projectByDomain';

export default function pathBase(props) {
    if (projectByDomain(props.projects)) {
        return `/${props.locale}`;
    } else {
        return `/${props.projectId}/${props.locale}`;
    }
}
