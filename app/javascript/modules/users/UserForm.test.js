import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { shallow, render } from 'enzyme';
import { Dialog } from '@reach/dialog';

// Configure Enzyme adapter
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
Enzyme.configure({ adapter: new Adapter() });

import UserForm from './UserForm';

describe('<UserForm />', () => {
    const initialState = {
        data: {},
        archive: {
            locale: 'en',
        },
    };
    const mockStore = configureStore();

    const data = {
        access_token: null,
        admin: null,
        appellation: null,
        city: "Kairo",
        confirmed_at: 1624392054000,
        country: "Ägypten",
        created_at: "22.06.2021",
        default_locale: "de",
        email: "test@web.de",
        first_name: "Hans",
        last_name: "Tester",
        gender: "male",
        id: 456116,
        job_description: null,
        organization: null,
        pre_register_location: null,
        priv_agreement: true,
        processed_at: "22.06.2021",
        research_intentions: null,
        specification: "alsjd lkajsdlkja sldkjal ksdj laksjdl",
        state: null,
        street: "Heinrichstr. 1",
        tos_agreement: true,
        translations_attributes: [],
        type: "User",
        user_id: 456116,
        user_projects: {
            id: 1,
            project_id: 1,
            user_id: 456116,
            workflow_state: '',
            workflow_states: '',
            mail_text: '',
            receive_newsletter: '',
            appellation: '',
            first_name: '',
            last_name: '',
            street: '',
            zipcode: '',
            city: '',
            country: '',
            job_description: '',
            research_intentions: '',
            specification: '',
            organization: '',
            pre_register_location: '',
            activated_at: '',
            processed_at: '',
            terminated_at: '',
            updated_at: '',
            created_at: '',
        },
        user_roles: {},
        workflow_state: "afirmed",
        workflow_states: [ "block", "remove" ],
        zipcode: "87979",
    };

    const dataPath = 'path/to/data';
    const userId = 123;
    const scope = 'scope';
    const locale = 'en';
    const project = {
        id: 123,
        shortname: 'zwar',
        external_links: {
            1: {
                id: 1,
                name: {de: 'Test Link', en: 'Test Link'},
                url: {de: 'https://test.de', en: 'https://test.de'},
            },
        },
    };

    const onSubmit = jest.fn();

    const wrapper = render(
        <Provider store={mockStore(initialState)}>
            <BrowserRouter>
                <UserForm
                    data={data}
                    dataPath={dataPath}
                    userId={userId}
                    scope={scope}
                    locale={locale}
                    project={project}
                    onSubmit={onSubmit}
                />
            </BrowserRouter>
        </Provider>
    );

    it('renders a form with the correct elements', () => {
        // Assert that the form renders correctly
        expect(wrapper.find('Form')).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
        //expect(wrapper.find('Form').prop('onSubmit')).toEqual(onSubmit);
        //expect(wrapper.find('Form').prop('initialValues')).toEqual(data);
        //expect(wrapper.equals(<form id="user" class="Form user default"><div class="form-group"><div class="form-label"><label class="FormLabel">Status</label></div><div class="form-input"><select name="workflow_state" class="Input"><option value="">Bitte auswählen</option><option value="block">sperren</option><option value="remove">löschen</option></select></div></div><div class="form-group has-error"><div class="form-label"><label class="FormLabel">E-Mail-Text *</label></div><div class="form-input"><textarea name="mail_text" class="Input"></textarea></div><div class="help-block">Bitte angeben</div></div><input type="submit" class="Button Button--primaryAction" value="Absenden"><div class="Form-footer u-mt"></div></form>)).to.equal(true);
    });

//    <div aria-modal="true" role="dialog" tabindex="-1" class="Modal-dialog" aria-label="Eintrag bearbeiten" data-reach-dialog-content=""><div class="details"><h3>Registrierung</h3><p class="detail"><span class="name">Titel: </span><span class="content"></span></p><p class="detail"><span class="name">Vorname: </span><span class="content"></span></p><p class="detail"><span class="name">Nachname: </span><span class="content"></span></p><p class="detail"><span class="name">E-Mail: </span><span class="content">anna.c.welker@stud.leuphana.de</span></p><p class="detail"><span class="name">Straße: </span><span class="content"></span></p><p class="detail"><span class="name">PLZ: </span><span class="content"></span></p><p class="detail"><span class="name">Ort: </span><span class="content"></span></p><p class="detail"><span class="name">Land: </span><span class="content"></span></p><p class="detail"><span class="name">Registrierung bestätigt am: </span><span class="content">22.01.2022</span></p><p class="detail"><span class="name">Sprache: </span><span class="content">deutsch</span></p><h3>Freischaltungen</h3><ul class="DetailList"><li class="DetailList-item"><h4>adg</h4><div class="hidden"><p>aktueller Status: freigeschaltet</p><p>am: 2022-01-27T09:06:12.000+01:00</p></div></li></ul><div class="LoadingOverlay"><form id="user" class="Form user default"><div class="form-group"><div class="form-label"><label class="FormLabel">Status</label></div><div class="form-input"><select name="workflow_state" class="Input"><option value="">Bitte auswählen</option><option value="block">sperren</option><option value="remove">löschen</option></select></div></div><div class="form-group has-error"><div class="form-label"><label class="FormLabel">E-Mail-Text *</label></div><div class="form-input"><textarea name="mail_text" class="Input"></textarea></div><div class="help-block">Bitte angeben</div></div><input type="submit" class="Button Button--primaryAction" value="Absenden"><div class="Form-footer u-mt"></div></form></div></div><button type="button" class="Modal-close"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 352 512" class="Modal-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg></button></div>

    //it('handles the select change correctly', () => {
    //// Create a shallow wrapper with minimal props
    //const wrapper = shallow(<UserForm />);

    //// Simulate a change event on the select input
    //wrapper.find('select').simulate('change', {
    //target: { value: 'new_state' },
    //});

    //// Assert that the state is updated correctly
    //expect(wrapper.state('workflowState')).toBe('new_state');
    //});

    //it('calls onSubmit handler when form is submitted', () => {
        ////const onSubmit = jest.fn();
        ////const wrapper = shallow(<UserForm onSubmit={onSubmit} />);
        ////const form = wrapper.find('Form');
        //const submit = wrapper.find('input[type="submit"]');
        //console.log(wrapper);
        //console.log(submit);
        //submit.simulate('submit');
        //expect(onSubmit).toHaveBeenCalled();
    //});

});


