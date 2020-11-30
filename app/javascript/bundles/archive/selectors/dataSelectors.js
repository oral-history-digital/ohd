const getData = state => state.data;

export const getLanguages = state => getData(state).languages;

export const getPeople = state => getData(state).people;

export const getStatuses = state => getData(state).statuses;

export const getPeopleStatus = state => getStatuses(state).people;

export const getCollections = state => getData(state).collections;

export const getCurrentAccount = state => getData(state).accounts.current;
