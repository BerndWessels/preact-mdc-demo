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
import classnames from 'classnames/dedupe';
import {Link} from 'react-router-dom';

/**
 * Import local dependencies.
 */
import List from 'preact-mdc/material-list';
import ListItem from 'preact-mdc/material-list-item';

/**
 * Import styles.
 */
import '@material/typography/mdc-typography.scss';
import styles from './styles';

/**
 * Create the component.
 */
export default class Demo extends Component {

  render(props, state, context) {
    let classes = classnames(styles.root, 'mdc-typography');
    return (
      <div class={classes}>
        <h1>Preact Material Design Components Web (preact-mdc)</h1>
        <List links>
          <ListItem><Link to="/button">Button Demo</Link></ListItem>
          <ListItem><Link to="/card">Card Demo</Link></ListItem>
          <ListItem><Link to="/checkbox">Checkbox / Radio Demo</Link></ListItem>
          <ListItem><Link to="/drawer">Drawer / Toolbar Demo</Link></ListItem>
          <ListItem><Link to="/icon-toggle">Icon Toggle Demo</Link></ListItem>
          <ListItem><Link to="/list">List Demo</Link></ListItem>
          <ListItem><Link to="/snackbar">Snackbar Demo</Link></ListItem>
          <ListItem><Link to="/switch">Switch Demo</Link></ListItem>
          <ListItem><Link to="/text-field">Text field Demo</Link></ListItem>
          <ListItem><Link to="/theme">Theme Demo</Link></ListItem>
        </List>
      </div>
    );
  }
}
