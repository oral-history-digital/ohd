export function alertMessage(message) {
    const container = document.getElementsByClassName(
        'notification-container'
    )[0];
    let alertP = document.getElementsByClassName('alert')[0];
    if (!alertP) {
        alertP = document.createElement('p');
        alertP.className = 'alert';
    }
    alertP.innerText = message;

    container.appendChild(alertP);

    //setTimeout(() => {
    //container.removeChild(alertP);
    //}, 5000);
}
