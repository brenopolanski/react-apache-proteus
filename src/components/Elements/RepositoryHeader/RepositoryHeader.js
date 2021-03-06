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
import React, { PureComponent } from 'react';
import { Input, Layout } from 'antd';

// Root
import RepositoryFormModal from './RepositoryFormModal';

// Styles
import './RepositoryHeader.css';

// Components
const { Header } = Layout;
const { Search } = Input;

class RepositoryHeader extends PureComponent {
  state = {
    repositoryUrl: '',
    showRepositoryFormModal: false
  };

  handleShowRepositoryFormModal = value => {
    this.setState(prevState => ({
      repositoryUrl: typeof value === 'string' ? value : '',
      showRepositoryFormModal: !prevState.showRepositoryFormModal
    }));
  };

  render() {
    const { repositoryUrl, showRepositoryFormModal } = this.state;

    return (
      <Header className="proteus-repository-header">
        <Search
          placeholder="Repository to add to DRAT"
          enterButton="RUN"
          size="large"
          onSearch={this.handleShowRepositoryFormModal}
        />

        {showRepositoryFormModal && (
          <RepositoryFormModal
            repo={repositoryUrl}
            onCancel={this.handleShowRepositoryFormModal}
          />
        )}
      </Header>
    );
  }
}

export default RepositoryHeader;
