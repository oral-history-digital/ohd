import React from 'react';

import UserContentContainer from '../containers/UserContentContainer';

export default class UserContents extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            open: false
        };
    }
  
    componentDidMount() {
        if (!this.props.status) {
            this.props.fetchData('user_contents');
        }
    }

    userContentsLoaded() {
        return this.props.status === 'fetched';
    }

    sortedContent() {
        let userContentByType = [];
        for(var i in this.props.contents) {
            if(this.props.contents[i].type === this.props.type) {
                userContentByType.push(<UserContentContainer
                    data={this.props.contents[i]}
                    key={`${this.props.type}-${i}`}/>);
            }
        }
        return userContentByType;
    }

    handleClick(){
        this.setState({['open']: !this.state.open});
    }

    render() {
        let headerCss =   this.state.open ? "accordion active" : 'accordion';
        let panelCss =   this.state.open ? "panel open" : 'panel';
        return (
            <div className='userContents'>
                <button className={headerCss} lang={this.props.locale} onClick={this.handleClick}>
                    {this.props.title}
                </button>
                <div className={panelCss}>{this.sortedContent()} </div>
            </div>
        );
    }
}

