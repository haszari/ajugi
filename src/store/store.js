import { configureStore } from '@reduxjs/toolkit';

import app from './app/slice';

const store = configureStore( {
  reducer: {
    app,
  }
} );

export default store;