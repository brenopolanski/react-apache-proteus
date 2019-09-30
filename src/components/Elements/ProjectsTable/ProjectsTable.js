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
import { Layout } from 'antd';

// Services
import { LicenseService } from '../../../services';

// Components
const { Content } = Layout;

class ProjectsTable extends Component {
  componentDidMount() {
    this.callApiLoadData();
  }

  callApiLoadData = () => {
    LicenseService.loadData()
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <Content style={{ margin: '16px' }}>
        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}></div>
      </Content>
    );
  }
}

export default ProjectsTable;
