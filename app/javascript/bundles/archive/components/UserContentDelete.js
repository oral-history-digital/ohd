import React from 'react';

export default class UserContentDelete extends React.Component {

    destroy() {
        this.props.deleteUserContent(this.props.id);
        this.props.closeArchivePopup();
    }

    cancel() {
        this.props.closeArchivePopup();
    }

    render() {
        return (
            <div>
                Realy?
                <div onClick={() => this.cancel()}>
                    Cancel
                </div>
                <div onClick={() => this.destroy()}>
                    {'Delete'}
                </div>
            </div>
        );
    }
}
