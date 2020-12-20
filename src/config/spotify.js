const development = {
  clientId: 'db0460271efc4ab4b5f52fbe09ea4358',
  redirectUrl: 'http://localhost:3000',
};

const production = {
  clientId: '6a53c434d5ce4fc2adb439113a5a7ec5',
  redirectUrl: 'https://haszari.github.io/ajugi/',
};

const spotifyApp = ( process.env.NODE_ENV === 'production' ) ? production : development;

export default spotifyApp;