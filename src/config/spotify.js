const development = {
  clientId: '5d648b4d2fd14f5db3d80e5f0e7e1f7e',
  redirectUrl: 'http://localhost:3000/callback',
};

const production = {
  clientId: '6a53c434d5ce4fc2adb439113a5a7ec5',
  redirectUrl: 'https://haszari.github.io/ajugi/callback',
};

const spotifyApp = ( process.env.NODE_ENV === 'production' ) ? production : development;

export default spotifyApp;