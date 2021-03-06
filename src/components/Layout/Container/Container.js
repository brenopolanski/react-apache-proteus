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
import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Layout } from 'antd';

// Context API
import { AppConsumer } from '../../../AppContext';

// Elements
import { Footer, RepositoryHeader, Sidebar } from '../../Elements';

// Styles
import './Container.css';

class Container extends PureComponent {
  state = {
    sidebarCollapsed: true
  };

  handleSidebarCollapse = collapsed => {
    this.setState({ sidebarCollapsed: collapsed });
  };

  render() {
    const { children } = this.props;
    const { sidebarCollapsed } = this.state;

    return (
      <Layout className="proteus-container">
        <AppConsumer>
          {({ view, setView }) => (
            <Fragment>
              <Sidebar
                selectedView={view}
                collapsed={sidebarCollapsed}
                onChangeView={setView}
                onCollapse={this.handleSidebarCollapse}
              />
              <Layout
                className={classNames('proteus-container-sidebar', {
                  'proteus-collapsed': sidebarCollapsed,
                  'proteus-no-collapsed': !sidebarCollapsed
                })}
              >
                <RepositoryHeader />
                {children}
                <Footer />
              </Layout>
            </Fragment>
          )}
        </AppConsumer>
      </Layout>
    );
  }
}

Container.propTypes = {
  children: PropTypes.node
};

export default Container;
