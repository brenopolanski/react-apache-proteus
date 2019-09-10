/*
 *   Licensed to the Apache Software Foundation (ASF) under one or more contributor
 *   license agreements.  See the NOTICE.txt file distributed with this work for
 *   additional information regarding copyright ownership.  The ASF licenses this
 *   file to you under the Apache License, Version 2.0 (the "License"); you may not
 *   use this file except in compliance with the License.  You may obtain a copy of
 *   the License at
 *        http://www.apache.org/licenses/LICENSE-2.0
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *   WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 *   License for the specific language governing permissions and limitations under
 *   the License.
 */

// Packages
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Routes
import { routes } from './routes';

// Styles
import 'antd/dist/antd.css';
import './styles/app.css';

class App extends Component {
  constructor() {
    super();

    this.$el = document.getElementById('proteus-app-loading');

    this.showSplashScreen();
  }

  componentDidMount() {
    this.hideSplashScreen();
  }

  showSplashScreen() {
    this.$el.removeAttribute('hidden');
  }

  hideSplashScreen() {
    if (this.$el) {
      setTimeout(() => {
        this.$el.setAttribute('hidden', 'hidden');
        this.$el.classList.remove('proteus-loading-available');
      }, 3000);
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              component={route.component}
              exact={route.exact}
            />
          ))}
        </Switch>
      </Router>
    );
  }
}

export default App;
