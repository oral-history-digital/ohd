import { createStore } from 'redux';
import interviewReducer from '../reducers/interviewReducer';

const archiveStore = (railsProps) => (
  createStore(interviewReducer, railsProps)
);

export default archiveStore;
