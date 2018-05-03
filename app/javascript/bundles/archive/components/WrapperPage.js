import React from 'react';
import PropTypes from 'prop-types';
import {Link, hashHistory} from 'react-router-dom';

import FlyoutTabsContainer from '../containers/FlyoutTabsContainer';
import ArchivePopupContainer from '../containers/ArchivePopupContainer';

import ResizeAware from 'react-resize-aware';

import { PROJECT } from '../constants/archiveConstants';
import deLogoSrc from '../../../images/mog-archiv-logo_de.svg'
import elLogoSrc from '../../../images/mog-archiv-logo_el.svg'
import zwarLogoEn from '../../../images/zwar-logo-red_en.png'
import zwarLogoDe from '../../../images/zwar-logo-red_de.svg'
import zwarLogoRu from '../../../images/zwar-logo-red_ru.png'

import { t } from '../../../lib/utils';
import '../css/wrapper_page'

export default class WrapperPage extends React.Component {


    constructor(props) {
        super(props);
        this.onResize = this.onResize.bind(this);
        this.state = {
            currentMQ: 'unknown',
        };
    }

    static contextTypes = {
        router: PropTypes.object
    }

    componentDidMount() {
        if(this.props.locale !== this.context.router.route.match.params.locale) {
            this.props.setLocale(this.context.router.route.match.params.locale);
        }
        if(!this.props.translations) {
            this.props.fetchStaticContent();
        }
    }

    componentDidUpdate() {
        if (this.props.visible && (this.state.currentMQ === 'S' || this.state.currentMQ === 'XS')) {
            if (!document.body.classList.contains('noScroll')) {
                document.body.classList.add('noScroll');
            }
        } else {
            document.body.classList.remove('noScroll');
        }
    }

    // Checks CSS value in active media query and syncs Javascript functionality
    mqSync() {
        // Fix for Opera issue when using font-family to store value
        if (window.opera) {
            var activeMQ = window.getComputedStyle(document.body, ':after').getPropertyValue('content');
        }
        // For all other modern browsers
        else if (window.getComputedStyle) {
            var activeMQ = window.getComputedStyle(document.head, null).getPropertyValue('font-family');
        }
        // For oldIE
        else {
            // Use .getCompStyle instead of .getComputedStyle so above check for window.getComputedStyle never fires true for old browsers
            window.getCompStyle = function (el, pseudo) {
                this.el = el;
                this.getPropertyValue = function (prop) {
                    var re = /(\-([a-z]){1})/g;
                    if (prop == 'float') prop = 'styleFloat';
                    if (re.test(prop)) {
                        prop = prop.replace(re, function () {
                            return arguments[2].toUpperCase();
                        });
                    }
                    return el.currentStyle[prop] ? el.currentStyle[prop] : null;
                }
                return this;
            }
            var compStyle = window.getCompStyle(document.getElementsByTagName('head')[0], "");
            var activeMQ = compStyle.getPropertyValue("font-family");
        }

        activeMQ = activeMQ.replace(/"/g, "");
        activeMQ = activeMQ.replace(/'/g, "");

        // Conditions for each breakpoint
        if (activeMQ != this.setState.currentMQ) {
            if (activeMQ == 'XS') {
                this.setState({['currentMQ']: activeMQ});
                // Add code you want to sync with this breakpoint
                // document.getElementById('msg').innerHTML = ('Active media query: <br><strong>' + this.currentMQ + '</strong>');
                // console.log(this.currentMQ);
                //RA.respondToXS();
            }
            if (activeMQ == 'S') {
                this.setState({['currentMQ']: activeMQ});
                // Add code you want to sync with this breakpoint
                // document.getElementById('msg').innerHTML = ('Active media query: <br><strong>' + this.currentMQ + '</strong>');
                // console.log(this.currentMQ);
                //RA.respondToS();
            }
            if (activeMQ == 'M') {
                this.setState({['currentMQ']: activeMQ});
                // Add code you want to sync with this breakpoint
                // document.getElementById('msg').innerHTML = ('Active media query: <br><strong>' + this.currentMQ + '</strong>');
                // console.log(this.currentMQ);
                //RA.respondToM();
            }
            if (activeMQ == 'L') {
                this.setState({['currentMQ']: activeMQ});
                // Add code you want to sync with this breakpoint
                // document.getElementById('msg').innerHTML = ('Active media query: <br><strong>' + this.currentMQ + '</strong>');
                // console.log(this.currentMQ);
                //RA.respondToL();
            }
            if (activeMQ == 'XL') {
                this.setState({['currentMQ']: activeMQ});
                this.props.showFlyoutTabs();
                // Add code you want to sync with this breakpoint
                // document.getElementById('msg').innerHTML = ('Active media query: <br><strong>' + this.currentMQ + '</strong>');
                // console.log(this.currentMQ);
                //RA.respondToXL();
            }
        }
    };


    onResize(dimensions) {
        this.mqSync();
    }

    css() {
        let css = ["wrapper-page"];
        if (this.props.transcriptScrollEnabled) {
            //css.push("fix-video");
        } else {
            window.scrollTo(0, 1);
        }
        return css.join(' ');
    }

    flyoutCss() {
        let css = this.props.visible ? ['flyout-is-visible'] : ['flyout-is-hidden'];

        if (this.props.transcriptScrollEnabled) {
            css.push("fix-video");
        } else {
            window.scrollTo(0, 1);
        }
        return css.join(' ');
    }

    compensationCss() {
        let css = '';
        // possible solution for only adding comension class if necessary
        // (but small problems when toggeling e.g tableofcontents items)
        // ($('.wrapper-page').height() - 500) < window.innerHeight
        if (this.props.transcriptScrollEnabled) {
            css = 'compensation';
        }
        return css;
    }


    flyoutToggleCss() {
        let css = this.props.visible ? 'icon-close' : 'icon-open';
        return css;
    }

    flyoutButtonCss() {
        let css = this.props.visible ? 'fa fa-close' : 'fa fa-bars';
        return css;
    }

    renderExternalLinks() {
        if (this.props.locale && this.props.externalLinks) {
            let links = this.props.externalLinks;
            let locale = this.props.locale;
            let props = this.props;
            return Object.keys(this.props.externalLinks).map(function (key, index) {
                let link = links[key][locale];
                if(link !== undefined) {
                    return (
                        <li key={'external-link-' + key}>
                            <a href={link}
                                target="_blank">
                                {t(props, key)}
                            </a>
                        </li>
                    )
                }
            })
        }
    }

    messages() {
        if (this.props.loggedInAt + 5000 > Date.now()) {
            return (
                <p className='messages'>
                    {t(this.props, 'devise.omniauth_callbacks.success')}
                </p>
            )
        }
    }

    render() {
        let logoSrc = '';
        switch(PROJECT) {
            case 'mog':
                logoSrc = this.props.locale == "de" ? deLogoSrc : elLogoSrc;
                break;
            case 'zwar':
                switch(this.props.locale) {
                    case 'de':
                        logoSrc = zwarLogoDe;
                        break;
                    case 'en':
                        logoSrc = zwarLogoEn;
                        break;
                    case 'ru':
                        logoSrc = zwarLogoRu;
                        break;
                }
        }

        return (
            <ResizeAware onResize={this.onResize}>
                {/* <div className="layout-indicator" style={{display: 'block'}}>{this.state.currentMQ}</div> */}
                <div className={this.flyoutCss()}>
                    <div className={this.css()}>
                        <header className='site-header'>
                            <a className="logo-link" href={`http://${this.props.projectDomain}`} title={t(this.props, 'home')}>
                                <img className="logo-img" src={logoSrc}>
                                </img>
                                <span className="logo-text">{PROJECT}</span>
                            </a>
                        </header>

                        {this.messages()}
                        {this.props.children}

                        <footer>
                            <ul className='footer-bottom-nav'>
                                {this.renderExternalLinks()}
                            </ul>
                            <p>{t(this.props, 'project_title')}</p>
                        </footer>
                        <div className={this.compensationCss()}/>
                    </div>

                    <div className='flyout-toggle'>
                        <div className={this.flyoutToggleCss()}
                             onClick={() => this.props.toggleFlyoutTabs(this.props.visible)}>
                            <i className={this.flyoutButtonCss()}/>
                        </div>
                    </div>


                    <ArchivePopupContainer/>

                    <FlyoutTabsContainer
                        tabIndex={this.props.tabIndex}
                    />
                </div>
            </ResizeAware>

        )
    }
}

