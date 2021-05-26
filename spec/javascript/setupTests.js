import Enzyme from 'enzyme';
import EnzymeAdapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new EnzymeAdapter() })

window.matchMedia =
    window.matchMedia ||
    function() {
        return {
            matches: false,
            addListener: function() {},
            removeListener: function() {}
        };
    };
