export default function pathBase(props) {
    if (props.project.archive_domain) {
        return `/${props.locale}`;
    } else {
        return `/${props.project.shortname}/${props.locale}`;
    }
}
