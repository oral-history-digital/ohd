import { getLocale } from 'modules/archive';
import { getContributionTypesForCurrentProject } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ContributionForm from './ContributionForm';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    contributionTypes: getContributionTypesForCurrentProject(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            // please NO submitData in here: it would disable
            // ContributionForm`s functionality
            // as sub-form
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ContributionForm);
