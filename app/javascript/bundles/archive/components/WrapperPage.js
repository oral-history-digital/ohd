import React from 'react';
import {Link, hashHistory} from 'react-router-dom';

import FlyoutTabs from '../components/FlyoutTabs';
import ArchivePopupContainer from '../containers/ArchivePopupContainer';

export default class WrapperPage extends React.Component {

  componentDidMount() {
    this.setLocale();
  }

  componentDidUpdate() {
    this.setLocale();
  }

  setLocale() {
    if(this.context.router.route.match.params.locale !== this.props.locale) {
      this.props.setLocale(this.context.router.route.match.params.locale);
    }
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  css() {
    let css = ["wrapper-page"];
    if (this.props.transcriptScrollEnabled) {
      css.push("fix-video");
      $('.flyout-toggle').addClass('white');
    } else {
      window.scrollTo(0,0);
      $('.flyout-toggle').removeClass('white');
    }
    if (this.props.disabled) 
          css.push('disabled');
    return css.join(' ');
  }

  render () {
    return (
      <div>
        <div className={this.css()}>
          <header className='site-header'>
            <div className='logo'>
              | Logo
            </div>
            <div className='locales'>
              {this.props.locales.map((locale, index) => {
                return (
                  <Link
                    key={'locale-link-' + locale}
                    to={'/' + locale + '/interviews/' + this.props.archiveId}
                  >
                    {locale}
                  </Link>
                )
              })}
            </div>
          </header>

          {this.props.children}

          <ArchivePopupContainer />
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

