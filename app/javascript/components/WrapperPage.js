import React from 'react';

import FlyoutTabs from '../components/FlyoutTabs';

export default class WrapperPage extends React.Component {

  render () {
    return (
      <div>
        <div className='wrapper-page'>
          <header className='site-header'>
            <div className='logo'>
              | Logo
            </div>
          </header>

          {this.props.children}

          <footer>
            | Footer
          </footer>
        </div>

        <FlyoutTabs 
          tabIndex={this.props.tabIndex} 
          appState={this.props.appState}
          archiveSearch={this.props.archiveSearch}
        />
      </div>
    )
  }
}

