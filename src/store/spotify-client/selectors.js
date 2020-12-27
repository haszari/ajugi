export const getApiToken = (state) => state.spotifyClient.apiToken;

export const isAuthorised = (state) => state.spotifyClient.apiToken.length > 0;
