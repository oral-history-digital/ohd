import React from 'react';
import { shallow } from 'enzyme';
const getProjectId = () => {};
import UserForm from './UserForm';
import { Dialog } from '@reach/dialog';

// Configure Enzyme adapter
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

//describe('<UserForm />', () => {
    //it('renders one <Dialog /> components', () => {
        //const wrapper = shallow(<UserForm />);
        //expect(wrapper.find(Dialog)).toHaveLength(1);
    //});
//});

describe('UserForm', () => {
  it('renders a form with the correct elements', () => {
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
        user_projects: {},
        user_roles: {},
        workflow_state: "confirmed",
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
    };
    const onSubmit = jest.fn();

    const wrapper = shallow(
      <UserForm
        data={data}
        dataPath={dataPath}
        userId={userId}
        scope={scope}
        locale={locale}
        project={project}
        onSubmit={onSubmit}
      />
    );

    // Assert that the form renders correctly
    expect(wrapper.find(Dialog)).toHaveLength(1);
    expect(wrapper.find('Form')).toHaveLength(1);
  });

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
    //const onSubmit = jest.fn();
    //const wrapper = shallow(<UserForm onSubmit={onSubmit} />);
    //const form = wrapper.find('Form');

    //// Simulate form submission
    //form.prop('onSubmit')();

    //// Assert that the onSubmit handler is called
    //expect(onSubmit).toHaveBeenCalled();
  //});

  // Add more test cases as needed
});


