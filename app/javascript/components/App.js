import React from 'react';
import { BrowserRouter, Route, hashHistory } from 'react-router-dom'

import Interview from '../components/Interview';
import Interviews from '../components/Interviews';
import FlyoutTabs from '../components/FlyoutTabs';

export default class App extends React.Component {

  content() {
    if(this.props.interview) {
      return <Interview
                src="http://medien.cedis.fu-berlin.de/eog/dedalo_media/av/720/rsc35_rsc167_162.mp4"
                interview={this.props.interview}
             />;
    } else {
      return <Interviews />
    }
  }

  tabIndex() {
    return this.props.flyoutTabIndex;
  }

  render () {
    return ( 
      <div className='app'>
        <div className='wrapper-page'>
          <header className='site-header'>
            <div className='logo'>
              | Logo
            </div>
          </header>

          <BrowserRouter history={hashHistory}>
            <div>
              <Route path="/:lang/interviews/:archiveId" component={Interview} />
              <Route path="/:lang/searches" component={Interviews} />
              <Route path="/:lang/suchen" component={Interviews} />
            </div>
          </BrowserRouter>

          <footer>
            | Footer
          </footer>
        </div>

        <div className='wrapper-flyout'>
          <FlyoutTabs tabIndex={this.tabIndex()} />
        </div>
      </div>
    );
  }
}

