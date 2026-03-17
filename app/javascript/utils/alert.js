export function alertMessage(message, className = 'alert') {
    const container = document.getElementsByClassName(
        'notification-container'
    )[0];

    let alertP = document.getElementsByClassName(className)[0];

    if (!alertP) {
        alertP = document.createElement('p');
        alertP.className = className;
        container.appendChild(alertP);
    }

    alertP.innerText = message;
}
