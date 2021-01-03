export const getApiToken = (state) => state.app.apiToken;

export const getView = (state) => state.app.view;

export const isAuthorised = (state) => state.app.apiToken.length > 0;
