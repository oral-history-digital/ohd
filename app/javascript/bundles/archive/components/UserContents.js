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
        if (!this.userContentsLoaded()) {
            this.props.fetchUserContents();
        }
    }

    userContentsLoaded() {
        return this.props.userContents && !this.props.userContents.fetched;
    }

    sortedContent() {
        let userContentByType = [];
        for(let i = 0; i < this.props.contents.length; i++) {
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
        let searches = this.sortedContent()
        return (
            <div className='userContents'>
                <button className={headerCss} onClick={this.handleClick}>
                    {this.props.title}
                </button>
                <div className={panelCss}>{searches} </div>
            </div>
        );
    }
}

