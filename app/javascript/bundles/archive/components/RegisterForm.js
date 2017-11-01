import React from 'react';

export default class RegisterForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.textFields = {
            first_name: {label: {de: "Vorname", el: "Vorname"}, mandatory: true},
            last_name: {label: {de: "Nachname", el: "Nachname"}, mandatory: true},
            email: {label: {de: "Email", el: "Email"}, mandatory: true},
            job_description: {label: {de: "job_description", el: "job_description"}, mandatory: false},
            research_intentions: {label: {de: "research_intentions", el: "research_intentions"}, mandatory: false},
            comments: {label: {de: "comments", el: "comments"}, mandatory: false},
            organization: {label: {de: "organization", el: "organization"}, mandatory: false},
            homepage: {label: {de: "homepage", el: "homepage"}, mandatory: false},
            street: {label: {de: "street", el: "street"}, mandatory: false},
            zipcode: {label: {de: "zipcode", el: "zipcode"}, mandatory: false},
            city: {label: {de: "city", el: "city"}, mandatory: false},
            state: {label: {de: "state", el: "state"}, mandatory: false}
        };

        this.selects = {
            appellation: {
                label: {
                    de: 'Appellation',
                    el: 'Appellation'
                },
                mandatory: true,
                values: {
                    de: [["Herr", "Herr"], ["Frau", "Frau"]],
                    el: [["Herr", "Herr"], ["Frau", "Frau"]],
                }
            },
            country: {
                label: {
                    de: 'Land',
                    el: 'Land'
                },
                mandatory: true,
                values: {
                    de: [
                            ["Deutschland", "de"],
                            ["Griechenland", "el"]
                    ],
                    el: [
                            ["Deutschland", "de"],
                            ["Griechenland", "el"]
                    ]
                }
            }
        };

        this.checkboxes = {
            tos_agreement: {label: {de: "AGB", el: "AGB"}, mandatory: true},
            priv_agreement: {label: {de: "Geheimhaltungsvereinbarung", el: "Geheimhaltungsvereinbarung"}, mandatory: true},
            receive_newsletter: {label: {de: "Newsletter", el: "Newsletter"}, mandatory: false}
        };

    }

    textField(field, index) {
        return  <label key={'textField-' + index}>
                    {this.textFields[field]['label'][this.props.locale]}
                    <input type="text" name={field} value={this.state[field]} onChange={this.handleChange} />
                </label>
    }

    select(field, index) {
        return  <label key={'select-' + index}>
                    {this.selects[field]['label'][this.props.locale]}
                    <select name={field} onChange={this.handleChange} >
                         {this.selects[field].values[this.props.locale].map( (option, index) => {
                             return <option value={option[1]}>{option[0]}</option>
                         })}
                    </select>
                </label>
    }

    checkbox(field, index) {
        return  <label key={'checkbox-' + index}>
                    {this.checkboxes[field]['label'][this.props.locale]}
                    <input type="checkbox" name={field} checked={this.state[field]} onChange={this.handleChange} />
                </label>
    }

    handleChange(event) {
        const value =  event.target.value;
        const name =  event.target.name;

        this.setState({[name]: value});
        if(this.valid()) {
            this.clearErrors();
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.valid()) {
            this.props.submitRegister(this.state);
        } else {
            this.setErrors(); 
        }
    }

    valid() {
        return this.state.email &&
            this.state.email.length > 6 
    }

    setErrors() {
        this.setState({ errors: "Please give your email." })
    }

    clearErrors() {
        this.setState({ errors: undefined })
    }

    render() {
        return (
            <div>
                <div className='errors'>{this.state.errors}</div>
                <form onSubmit={this.handleSubmit}>
                    {this.select('appellation', 0)}
                    {Object.keys(this.textFields).map( (field, index) => {
                        return this.textField(field, index)
                    })}
                    {this.select('country', 1)}
                    {Object.keys(this.checkboxes).map( (field, index) => {
                        return this.checkbox(field, index)
                    })}
                    
                    <input type="submit" value="Register" />
                </form>
            </div>
        );
    }
}
