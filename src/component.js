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
import {h, Component} from 'preact';
import {Route} from 'react-router-dom';

/**
 * Import local dependencies.
 */
import Demo from './containers/demo/component';
import DemoButton from './components/demo-button/component';
import DemoCard from './components/demo-card/component';
import DemoCheckbox from './components/demo-checkbox/component';
import DemoDrawer from './components/demo-drawer/component';
import DemoIconToggle from './components/demo-icon-toggle/component';
import DemoList from './components/demo-list/component';
import DemoSnackbar from './components/demo-snackbar/component';
import DemoSwitch from './components/demo-switch/component';
import DemoTextField from './components/demo-text-field/component';
import DemoTheme from './components/demo-theme/component';

/**
 * Import styles.
 */
import 'roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss';
import styles from './styles';

/**
 * Export the component.
 */
export default class App extends Component {

  render(props, state, context) {
    return (
      <div class={styles.root}>
        <Route exact path="/" component={Demo}/>
        <Route path="/button" component={DemoButton}/>
        <Route path="/card" component={DemoCard}/>
        <Route path="/checkbox" component={DemoCheckbox}/>
        <Route path="/drawer" component={DemoDrawer}/>
        <Route path="/icon-toggle" component={DemoIconToggle}/>
        <Route path="/list" component={DemoList}/>
        <Route path="/snackbar" component={DemoSnackbar}/>
        <Route path="/switch" component={DemoSwitch}/>
        <Route path="/text-field" component={DemoTextField}/>
        <Route path="/theme" component={DemoTheme}/>
      </div>
    );
  }
}
