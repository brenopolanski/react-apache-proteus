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
import { Button, Icon, Input, Layout, Result, Table } from 'antd';
import Highlighter from 'react-highlight-words';

// Services
import { LicenseService } from '../../../services';

// Components
const { Content } = Layout;

class ProjectsTable extends Component {
  state = {
    docs: [],
    searchText: '',
    loading: true,
    error: false,
    errorMsg: 'Error fetching data'
  };

  componentDidMount() {
    this.callApiLoadData();
  }

  callApiLoadData = () => {
    this.setState({
      loading: true,
      error: false
    });

    LicenseService.loadData()
      .then(res => {
        if (res.status === 200) {
          console.log(res);

          const { data } = res;
          const { docs } = data.response;

          this.setState({
            docs: docs.map(doc => {
              return {
                ...doc,
                key: doc.id
              };
            }),
            loading: false
          });
        } else {
          this.setState({
            loading: false,
            error: true
          });
        }
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: true
        });
      });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
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

  renderError() {
    const { errorMsg } = this.state;

    return (
      <Result
        status="error"
        title={errorMsg}
        subTitle="Try again:"
        extra={
          <Button icon="sync" type="danger" onClick={this.callApiLoadData}>
            Refresh
          </Button>
        }
      />
    );
  }

  renderTable() {
    const { docs } = this.state;
    const columns = [
      {
        title: 'Repository',
        dataIndex: 'repo',
        key: 'repo',
        width: '20%',
        ...this.getColumnSearchProps('repo')
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name')
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        ...this.getColumnSearchProps('description')
      }
    ];

    return <Table columns={columns} dataSource={docs} />;
  }

  render() {
    const { loading, error } = this.state;

    return (
      <Content style={{ margin: '16px' }}>
        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
          {!loading ? (
            !error ? (
              this.renderTable()
            ) : (
              this.renderError()
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Content>
    );
  }
}

export default ProjectsTable;
