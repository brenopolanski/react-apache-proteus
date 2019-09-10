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
import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

// Elements
import Sidebar from '../../Elements/Sidebar';
import RepositoryHeader from '../../Elements/RepositoryHeader';

// UI
import { Logo } from '../../UI';

// Components
const { Footer } = Layout;

const Container = props => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <RepositoryHeader />
        <Footer style={{ textAlign: 'center' }}>
          <Logo width={25} height={25} /> Apache DRAT
        </Footer>
      </Layout>
    </Layout>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired
};

export default Container;