/**
 * Bernd Wessels (https://github.com/BerndWessels/)
 *
 * Copyright © 2016 Bernd Wessels. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Import dependencies.
 */
import {h, render} from 'preact';
import {BrowserRouter} from 'react-router-dom';

/**
 * Import local dependencies.
 */
import Root from './component';

/**
 * Render the application.
 */
let root = document.body.lastElementChild;
const renderRoot = () => {
  let Root = require('./component').default;
  requestAnimationFrame(() => {
    root = render(
      <BrowserRouter basename={process.env.BASE_URL}>
        <Root/>
      </BrowserRouter>,
      document.body,
      root
    );
  });
};

/**
 * Enable hot module reloading in development mode.
 */
if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    // Handle updates to the components.
    module.hot.accept('./component', () => {
      console.log('Updated components');
      renderRoot();
    });
  }
}

/**
 * Finally render the app.
 */
renderRoot();
