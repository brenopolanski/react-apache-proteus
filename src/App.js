/*
 * Licensed to the Apache Software Foundation (ASF) under one or more contributor
 * license agreements.  See the NOTICE.txt file distributed with this work for
 * additional information regarding copyright ownership.  The ASF licenses this
 * file to you under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You may obtain a copy of
 * the License at
 *      http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

// Packages
import React, { Component } from 'react';

// Context API
import { AppConsumer, AppProvider } from './AppContext';

// Layout
import Container from './components/Layout/Container';

// Views
import { Analyze, Audit, Summary } from './views';

// Styles
import 'antd/dist/antd.css';
import './styles/app.css';

// Constants
const SPLASH_SCREEN_TIME = 3000;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'summary',
      currentActionRequest: null
    };

    this.$el = document.getElementById('proteus-app-loading');

    this.showSplashScreen();
  }

  componentDidMount() {
    this.hideSplashScreen();
  }

  setView = view => {
    this.setState({ view });
  };

  setCurrentActionRequest = action => {
    this.setState({ currentActionRequest: action });
  };

  showSplashScreen() {
    this.$el.removeAttribute('hidden');
  }

  hideSplashScreen() {
    if (this.$el) {
      setTimeout(() => {
        this.$el.setAttribute('hidden', 'hidden');
        this.$el.classList.remove('proteus-loading-available');
      }, SPLASH_SCREEN_TIME);
    }
  }

  render() {
    const { setView, setCurrentActionRequest } = this;
    const contextValue = {
      ...this.state,
      setView,
      setCurrentActionRequest
    };

    return (
      <AppProvider value={contextValue}>
        <AppConsumer>
          {({ view }) => (
            <Container>
              {view === 'summary' ? (
                <Summary />
              ) : view === 'audit' ? (
                <Audit />
              ) : (
                <Analyze />
              )}
            </Container>
          )}
        </AppConsumer>
      </AppProvider>
    );
  }
}

export default App;
