import React from 'react';
import Interview from '../components/Interview';
import FlyoutTabs from '../components/FlyoutTabs';

export default class App extends React.Component {

  content() {
    if(this.props.interview) {
      return <Interview
                src="http://medien.cedis.fu-berlin.de/eog/dedalo_media/av/720/rsc35_rsc167_162.mp4"
                interview={this.props.interview}
             />
    } else {
      return <div>
               Suche
             </div>;
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
          {this.content()}
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

