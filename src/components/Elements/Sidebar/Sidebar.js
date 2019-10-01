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
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Layout, Menu } from 'antd';

// UI
import { Logo } from '../../UI';

// Styles
import './Sidebar.css';

// Components
const { Sider } = Layout;
const { Item } = Menu;

class Sidebar extends PureComponent {
  render() {
    const { collapsed, onCollapse } = this.props;

    return (
      <Sider
        className="proteus-sidebar"
        collapsed={collapsed}
        onCollapse={onCollapse}
        collapsible
      >
        {collapsed ? (
          <Logo width={50} height={50} center />
        ) : (
          <Logo width={130} height={50} full center />
        )}
        <Menu theme="dark" defaultSelectedKeys={['summaryMenu']} mode="inline">
          <Item key="summaryMenu">
            <Icon type="appstore" />
            <span>Summary</span>
          </Item>
          <Item key="auditMenu">
            <Icon type="bar-chart" rotate={90} />
            <span>Audit</span>
          </Item>
        </Menu>
      </Sider>
    );
  }
}

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
  onCollapse: PropTypes.func
};

Sidebar.defaultProps = {
  collapsed: true
};

export default Sidebar;
