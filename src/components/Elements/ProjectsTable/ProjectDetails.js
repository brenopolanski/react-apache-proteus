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
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { Button, Descriptions, Drawer, Icon, Input, Table } from 'antd';
import Highlighter from 'react-highlight-words';

// Services
import { LicenseService } from '../../../services';

// Layout
import Content from '../../Layout/Content';

// UI
import { ErrorMessage, TableRowSkeleton, TitleBar } from '../../UI';

// Utils
import Helpers from '../../../utils/Helpers';

// Styles
import './ProjectDetails.css';

// Components
const { Item } = Descriptions;

// Constants
const ITEM_SPAN = 3;

class ProjectDetails extends Component {
  _isMounted = false;

  state = {
    fileDocs: [],
    searchText: '',
    loading: true,
    error: false,
    errorMsg: 'Error fetching data'
  };

  componentDidMount() {
    this._isMounted = true;
    this.callApiLoadFileDetails();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.state.fileDocs, nextState.fileDocs) ||
      this.state.searchText !== nextState.searchText ||
      this.state.loading !== nextState.loading ||
      this.state.error !== nextState.error
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  callApiLoadFileDetails = () => {
    const { item } = this.props;

    this.setState({
      loading: true,
      error: false
    });

    LicenseService.loadFileDetails(item.repo)
      .then(res => {
        if (this._isMounted && res.status === 200) {
          const { data } = res;
          const { docs } = data.response;

          this.setState({
            fileDocs: docs.map(doc => {
              return {
                ...doc,
                key: Helpers.uid(doc.id)
              };
            }),
            loading: false
          });
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
  };

  getColumnSearchProps = (dataIndex, name = null) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => (this.searchInput = node)}
          placeholder={`Search ${name || dataIndex}`}
          value={selectedKeys[0]}
          onChange={event =>
            setSelectedKeys(event.target.value ? [event.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
          onClick={() => this.handleSearch(selectedKeys, confirm)}
        >
          Search
        </Button>
        <Button
          size="small"
          style={{ width: 90 }}
          onClick={() => this.handleReset(clearFilters)}
        >
          Reset
        </Button>
      </div>
    ),

    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),

    onFilter: (value, record) => {
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },

    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },

    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        textToHighlight={text ? text.toString() : ''}
        autoEscape
      />
    )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  renderLicenseDetails() {
    const { item } = this.props;
    const { name, description, repo, loc_url } = item;

    return (
      <Content>
        <TitleBar title="License Details" />
        <Descriptions bordered>
          <Item label="Project Name" span={ITEM_SPAN}>
            {name}
          </Item>
          <Item label="Project Description" span={ITEM_SPAN}>
            {description}
          </Item>
          <Item label="Project Repository" span={ITEM_SPAN}>
            {repo}
          </Item>
          <Item label="Project Location" span={ITEM_SPAN}>
            {loc_url}
          </Item>
        </Descriptions>
      </Content>
    );
  }

  renderFileDetails() {
    const { fileDocs, loading, error, errorMsg } = this.state;
    const columns = [
      {
        title: 'Location',
        dataIndex: 'id',
        key: 'id',
        width: 450,
        sorter: (a, b) => a.id.length - b.id.length,
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('id', 'location')
      },
      {
        title: 'Mime Type',
        dataIndex: 'mimetype',
        key: 'mimetype',
        width: 200,
        sorter: (a, b) => a.mimetype.length - b.mimetype.length,
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('mimetype', 'mime type')
      },
      {
        title: 'License',
        dataIndex: 'license',
        key: 'license',
        filters: [
          {
            text: 'Standard',
            value: 'Standard'
          },
          {
            text: 'Unknown',
            value: 'Unknown'
          },
          {
            text: 'Apache',
            value: 'Apache'
          },
          {
            text: 'Binaries',
            value: 'Binaries'
          },
          {
            text: 'Generated',
            value: 'Generated'
          },
          {
            text: 'Notes',
            value: 'Notes'
          },
          {
            text: 'Archives',
            value: 'Archives'
          }
        ],
        width: 200,
        onFilter: (value, record) => record.license.indexOf(value) === 0,
        sorter: (a, b) => a.license.length - b.license.length,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Header',
        dataIndex: 'header',
        key: 'header',
        sorter: (a, b) => a.header.length - b.header.length,
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('header')
      }
    ];

    return (
      <Content>
        <TitleBar title="File Details" />
        {loading ? (
          <TableRowSkeleton />
        ) : error ? (
          <ErrorMessage text={errorMsg} callApi={this.callApiLoadFileDetails} />
        ) : (
          <Table scroll={{ y: 200 }} columns={columns} dataSource={fileDocs} />
        )}
      </Content>
    );
  }

  render() {
    const { visible, item, onClose } = this.props;

    return (
      <Drawer
        className="proteus-project-details"
        title={item.name}
        placement="bottom"
        width="100%"
        height="100%"
        visible={visible}
        onClose={onClose}
      >
        {this.renderLicenseDetails()}
        {this.renderFileDetails()}
      </Drawer>
    );
  }
}

ProjectDetails.propTypes = {
  visible: PropTypes.bool,
  item: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

ProjectDetails.defaultProps = {
  visible: false
};

export default ProjectDetails;
