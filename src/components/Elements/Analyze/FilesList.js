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

// Services
import { RepositoryService } from '../../../services';

// Context API
import AppContext from '../../../AppContext';

// Layout
import Content from '../../Layout/Content';

// UI
import { TitleBar } from '../../UI';

// Constants
const INTERVAL = 1000;

class FilesList extends Component {
  static contextType = AppContext;

  _isMounted = false;

  state = {
    currentRepo: null,
    loading: true,
    error: false,
    errorMsg: 'Error fetching data'
  };

  componentWillMount() {
    const { currentRepo } = this.context;

    this.setState({ currentRepo });
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearTimeout(this.timeout);
  }

  callApiLoadData = () => {
    try {
      const { currentRepo } = this.state;

      this.setState({
        loading: true,
        error: false
      });

      RepositoryService.loadCurrentRepo(currentRepo)
        .then(res => {
          if (this._isMounted && res.status === 200) {
            console.log(res);
            this.setState({ loading: false });
          } else {
            if (this._isMounted) {
              this.setState({
                loading: false,
                error: true
              });
            }
          }
        })
        .catch(error => {
          if (this._isMounted) {
            this.setState({
              loading: false,
              error: true
            });
          }
        });
    } catch (error) {
      this.setState({ loading: false, error: true });
    } finally {
      this.timeout = setTimeout(() => this.callApiLoadData(), INTERVAL);
    }
  };

  render() {
    return (
      <Content>
        <TitleBar title="Files List" />
      </Content>
    );
  }
}

export default FilesList;
