import React from 'react';
import {Link, hashHistory} from 'react-router-dom';

import FlyoutTabsContainer from '../containers/FlyoutTabsContainer';
import ArchivePopupContainer from '../containers/ArchivePopupContainer';

import ResizeAware from 'react-resize-aware';


export default class WrapperPage extends React.Component {


    constructor(props) {
        super(props);
        this.onResize = this.onResize.bind(this);
        this.state = {
            currentMQ: 'unknown',
        };
    }

    static contextTypes = {
        router: React.PropTypes.object
    }

    componentDidMount() {
        if(!this.props.translations) {
            this.props.fetchStaticContent();
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
            $('.flyout-toggle').addClass('white');
        } else {
            window.scrollTo(0, 0);
            $('.flyout-toggle').removeClass('white');
        }
        return css.join(' ');
    }

    flyoutCss() {
        let css = this.props.visible ? ['flyout-is-visible'] : ['flyout-is-hidden'];

        if (this.props.transcriptScrollEnabled) {
            css.push("fix-video");
        } else {
            window.scrollTo(0, 0);
        }
        return css.join(' ');
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
            return Object.keys(this.props.externalLinks).map(function (key, index) {
                let link = links[key][locale];
                return (
                    <li key={'external-link-' + key}>
                        <a href={link}
                            target="_blank">
                            {key}
                        </a>
                    </li>
                )
            })
        }
    }


    render() {
        return (
            <ResizeAware onResize={this.onResize}>
                <div className="layout-indicator" style={{display: 'block'}}>{this.state.currentMQ}</div>
                <div className={this.flyoutCss()}>
                    <div className={this.css()}>
                        <header className='site-header'>
                            <a className="logo-link" href="#" title="Zur Startseite MOG Archiv">
                                <img className="logo-img" src="/assets/eog/mog-archiv-logo.svg">
                                </img>
                                <span className="logo-text">MOG</span>
                            </a>
                        </header>

                        {this.props.children}

                        <footer>
                            <ul className='footer-bottom-nav'>
                                {this.renderExternalLinks()}
                            </ul>
                            <p>Projekt Erinnerungen an die Okkupation in Griechenland</p>
                        </footer>
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

