import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import ActionCable from 'actioncable';

import FlyoutTabsContainer from '../containers/FlyoutTabsContainer';
import ArchivePopupContainer from '../containers/ArchivePopupContainer';

import ResizeAware from 'react-resize-aware';

import deLogoSrc from '../../../images/mog-archiv-logo_de.svg'
import elLogoSrc from '../../../images/mog-archiv-logo_el.svg'
import zwarLogoEn from '../../../images/zwar-logo-red_en.png'
import zwarLogoDe from '../../../images/zwar-logo-red_de.svg'
import zwarLogoDe2 from '../../../images/zwar-logo-red_de.png'
import zwarLogoRu from '../../../images/zwar-logo-red_ru.png'
import hagenLogo from '../../../images/hagen-logo.gif'
import campscapesLogo from '../../../images/campscapes.png'

import { t } from '../../../lib/utils';
import '../css/wrapper_page'

export default class WrapperPage extends React.Component {


    constructor(props) {
        super(props);
        this.onResize = this.onResize.bind(this);
        this.state = {
            currentMQ: 'unknown',
            notifications: []
        };
    }

    static contextTypes = {
        router: PropTypes.object
    }

    componentWillMount() {
        //this.createSocket()
    }

    componentDidMount() {
        if(this.props.locale !== this.context.router.route.match.params.locale) {
            this.props.setLocale(this.context.router.route.match.params.locale);
        }
        if(!this.props.translations) {
            let url = `/${this.context.router.route.match.params.projectId}/${this.context.router.route.match.params.locale}`;
            this.props.fetchStaticContent(url);
        }
        this.loadCollections();
        this.loadProjects();
        //this.setProjectId();
    }

    componentDidUpdate() {
        if (this.props.visible && (this.state.currentMQ === 'S' || this.state.currentMQ === 'XS')) {
            if (!document.body.classList.contains('noScroll')) {
                document.body.classList.add('noScroll');
            }
        } else {
            document.body.classList.remove('noScroll');
        }
        this.loadCollections();
        this.loadProjects();
        this.loadLanguages();
        //this.setProjectId();
    }

    loadCollections() {
        if (
            this.props.projectId &&
            !this.props.collectionsStatus[`collections_for_project_${this.props.projectId}`]
        ) {
            this.props.fetchData(this.props, 'collections', null, null, `collections_for_project=${this.props.projectId}`);
        }
    }

    loadProjects() {
        if (this.props.projectId && !this.props.projectsStatus.all) {
            this.props.fetchData(this.props, 'projects', null, null, 'all');
        }
    }

    loadLanguages() {
        if (!this.props.languagesStatus) {
            this.props.fetchData(this.props, 'languages', null, null, 'all');
        }
    }

    setProjectId() {
        //
        // TODO: enable this for really multi-project use
        //
        if (this.context.router.route.match.params.projectId !== this.props.projectId) {
            this.props.setProjectId(this.context.router.route.match.params.projectId);
        }
    }

    createSocket() {
        let cable = ActionCable.createConsumer('/cable');

        this.notifications = cable.subscriptions.create({
            channel: "WebNotificationsChannel"
        }, {
            //connected: () => {},
            received: (data) => {
                console.log(data);
                this.setState({notifications: [...this.state.notifications, data]})
            },
            //create: function(content) {}
        });
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
        if (activeMQ != this.state.currentMQ) {
            if (activeMQ == 'XS') {
                this.setState({['currentMQ']: activeMQ});
                // Add code you want to sync with this breakpoint
                // document.getElementById('msg').innerHTML = ('Active media query: <br><strong>' + this.currentMQ + '</strong>');
                // console.log(this.currentMQ);
                //RA.respondToXS();
            }
            if (activeMQ == 'S') {
                if(this.state.currentMQ != 'XS') {
                    this.props.hideFlyoutTabs();
                }
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

    handleLogoClick(e) {
        e.preventDefault();
        this.context.router.history.push(`/${this.props.locale}`);
    }

    onResize(dimensions) {
        this.mqSync();
    }

    css() {
        let css = ["wrapper-page"];
        if (this.props.transcriptScrollEnabled) {
            css.push("fix-video");
        } else {
            // window.scrollTo(0, 1); // ACHIM?
        }
        return css.join(' ');
    }

    flyoutCss() {
        let css = this.props.visible ? ['flyout-is-visible'] : ['flyout-is-hidden'];

        if (this.props.transcriptScrollEnabled) {
            css.push("fix-video");
        } else {
            // window.scrollTo(0, 1); // ACHIM?
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

    renderLogos() {
        //
        // TODO: fit this to uploadable project-logos
        //
        switch(this.props.project && this.props.project.identifier) {
            case 'zwar':
                return (
                    <div className='home-content-logos' style={{paddingLeft: 0, paddingTop: 10}}>
                        <a className='fu-logo' href="https://www.fu-berlin.de/" target="_blank" title="Freie Universität Berlin" rel="noopener">
                            <img src="/packs/fu-logo-3x.png" />
                        </a>
                        <a href="https://www.stiftung-evz.de/start.html" target="_blank" title="Stiftung Erinnerung, Verantwortung und Zukunft" rel="noopener">
                            <img src="/packs/evz-off-co-d-hd-s.jpg" />
                        </a>
                    </div>
                )
                break;
            case 'campscapes':
                return (
                    <div className='home-content-logos' style={{paddingLeft: 0, paddingTop: 10}}>
                        <a className='fu-logo' href="https://www.fu-berlin.de/" target="_blank" title="Freie Universität Berlin" rel="noopener">
                            <img src="/packs/fu-logo-3x.png" />
                        </a>
                        <a href="http://heranet.info/" target="_blank" title="Humanities in the European Research Area" rel="noopener">
                            <img src="/packs/heralogot.png" />
                        </a>
                        <a  href="https://ec.europa.eu/programmes/horizon2020/en">
                            <img src="/packs/EU-logo.jpg" alt="Logo eu" style={{maxHeight: 66, maxWidth: 100}}/>
                        </a>
                    </div>
                )
                break;
            case 'cdoh':
                return (
                    <div className='home-content-logos' style={{paddingLeft: 0, paddingTop: 10}}>
                        <a className='fu-logo' href="https://www.fu-berlin.de/" target="_blank" title="Freie Universität Berlin" rel="noopener">
                            <img src="/packs/fu-logo-3x.png" />
                        </a>
                        <a href="https://www.auswaertiges-amt.de" target="_blank" title="Auswärtiges Amt" rel="noopener">
                            <img src="/packs/auswaertiges-amt-logo.png" />
                        </a>
                    </div>
                )
                break;
        }
    }

    renderExternalLinks() {
        if (this.props.project) {
            let links = this.props.project.external_links;
            let locale = this.props.locale;
            let props = this.props;
            return Object.keys(links).map(function (key, index) {
                return (
                    <li key={'external-link-' + key}>
                        <a href={links[key].url[locale]}
                            target="_blank" rel="noopener">
                            {t(props, links[key].name)}
                        </a>
                    </li>
                )
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
        } else if (this.state.notifications.length > 0) {
            return (
                <div className='notifications'>
                    {this.state.notifications.map((notification, index) => {
                        return (
                            <p key={`notification-${index}`}>
                                {t(this.props, notification.title, {file: notification.file, archiveId: notification.archive_id})}
                                <Link
                                    to={'/' + this.props.locale + '/interviews/' + notification.archive_id}>
                                    {notification.archive_id}
                                </Link>
                            </p>
                        )
                    })}
                </div>
            )
        } else {
            return null;
        }
    }

    renderProjectSpecificFooter() {
        switch(this.props.project && this.props.project.identifier){
            case 'zwar':
                if (this.props.locale === 'de') {
                    return (
                        <div>
                            <p>Weitere Angebote:</p>
                            <div style={{display: 'inline-block'}}>
                            {/* lieber ein div, das sich ausklappt, dann sind normale <a>-Links möglich */}
                                <img src={zwarLogoDe2} style={{paddingRight: '10px', borderRight: '2px solid #9f403f', float: 'left', marginRight: 8, width: '36%'}} />
                                <select style={{color: '#9f403f', marginTop: 5, fontSize: 14}} onChange={(e) => window.open(e.target.value, '_blank')}>
                                    <option defaultValue>Archiv: Vollständige Interviews</option>
                                    <option value="https://zwangsarbeit-archiv.de/">Infos: Geschichte und Projekt</option>
                                    <option value="https://lernen-mit-interviews.de/">Bildung: Lernen mit Interviews</option>
                                    <option value="https://forum.lernen-mit-interviews.de/">Forum: Für Lehrende</option>
                                </select>
                            </div>
                            <p></p>
                            <p>Eine Kooperation der Stiftung "Erinnerung, Verantwortung und Zukunft" mit der Freien Universität Berlin </p>
                        </div>
                    )
                }
            break;
            case 'campscapes':
                return (
                    <div>
                        <p>Created by Freie Universität Berlin within the HERA-funded project Accessing Campscapes. Inclusive Strategies for Using European Conflicted Heritage</p>
                        <p><a href='https://ec.europa.eu/programmes/horizon2020/en'>This project has received funding from the European Union's Horizon 2020 research and innovation programme under grant agreement No 649307</a></p>
                    </div>
                )
        }
    }

    render() {
        let logoSrc = '';
        switch(this.props.project && this.props.project.identifier){
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
                break;
            case 'hagen':
                logoSrc = hagenLogo;
                break;
            case 'campscapes':
            logoSrc = campscapesLogo;
            break;
        }

        return (
            <ResizeAware onResize={this.onResize}>
                {/* <div className="layout-indicator" style={{display: 'block'}}>{this.state.currentMQ}</div> */}
                <div className={this.flyoutCss()}>
                    <div className={this.css()}>
                        <header className='site-header'>
                            <a className="logo-link" href={`/${this.props.locale}`} onClick={(e) => this.handleLogoClick(e)} title={t(this.props, 'home')}>
                                <img className="logo-img" src={logoSrc}>
                                </img>
                                {/* <span className="logo-text">{this.props.project}</span> */}
                            </a>
                        </header>

                        {this.messages()}
                        {this.props.children}
                        <footer>
                            <ul className='footer-bottom-nav'>
                                {this.renderExternalLinks()}
                            </ul>
                            <p>{this.props.project && this.props.project.name[this.props.locale]}</p>
                            { this.renderProjectSpecificFooter() }
                            {this.renderLogos()}
                        </footer>
                        <div className={this.compensationCss()}/>
                    </div>

                    <div className='flyout-toggle'>
                        <div className={this.flyoutToggleCss()}
                             onClick={() => this.props.toggleFlyoutTabs(this.props.visible)}>
                            <i className={this.flyoutButtonCss()}/>
                        </div>
                    </div>

                    <FlyoutTabsContainer
                        tabIndex={this.props.tabIndex}
                    />

                    <ArchivePopupContainer/>

                </div>
            </ResizeAware>

        )
    }
}

