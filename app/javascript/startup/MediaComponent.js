import { Provider } from 'react-redux';

import { default as MC } from 'modules/interview/components/MediaComponent';
import ReactOnRails from 'react-on-rails';

const MediaComponent = () => {
    const archiveStore = ReactOnRails.getStore('archiveStore');
    
    return (
        <Provider store={archiveStore}>
            <MC />
        </Provider>
    );
};

export default MediaComponent;

