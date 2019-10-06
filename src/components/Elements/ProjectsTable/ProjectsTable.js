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
import React, { Component, Fragment } from 'react';
import isEqual from 'react-fast-compare';
import { Button, Icon, Input, Result, Table } from 'antd';
import Highlighter from 'react-highlight-words';

// Services
import { LicenseService } from '../../../services';

// Layout
import Content from '../../Layout/Content';

// UI
import { TableRowSkeleton, TitleBar } from '../../UI';

// Root
import ProjectDetails from './ProjectDetails';

// Utils
import Helpers from '../../../utils/Helpers';

class ProjectsTable extends Component {
  _isMounted = false;

  state = {
    docs: [],
    selectedItem: {},
    searchText: '',
    showProjectDetails: false,
    loading: true,
    error: false,
    errorMsg: 'Error fetching data'
  };

  componentDidMount() {
    this._isMounted = true;
    this.callApiLoadProjectData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.state.docs, nextState.docs) ||
      this.state.searchText !== nextState.searchText ||
      this.state.showProjectDetails !== nextState.showProjectDetails ||
      this.state.loading !== nextState.loading ||
      this.state.error !== nextState.error
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  callApiLoadProjectData = () => {
    this.setState({
      loading: true,
      error: false
    });

    LicenseService.loadProjectData()
      .then(res => {
        if (this._isMounted && res.status === 200) {
          const { data } = res;
          const { docs } = data.response;

          this.setState({
            docs: docs.map(doc => {
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
        textToHighlight={text.toString()}
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

  handleShowProjectDetails = item => {
    this.setState(prevState => ({
      selectedItem: item.repo ? item : {},
      showProjectDetails: !prevState.showProjectDetails
    }));
  };

  renderError() {
    const { errorMsg } = this.state;

    return (
      <Result
        status="error"
        title={errorMsg}
        subTitle="Try again:"
        extra={
          <Button
            icon="sync"
            type="danger"
            onClick={this.callApiLoadProjectData}
          >
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
        width: 350,
        sorter: (a, b) => a.repo.length - b.repo.length,
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('repo', 'repository')
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 350,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('name')
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 350,
        sorter: (a, b) => a.description.length - b.description.length,
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('description')
      },
      {
        title: 'Audit',
        key: 'audit',
        align: 'right',
        render: (text, record) => (
          <Button
            type="primary"
            icon="file-text"
            onClick={this.handleShowProjectDetails.bind(this, record)}
          />
        )
      }
    ];

    return <Table scroll={{ y: 400 }} columns={columns} dataSource={docs} />;
  }

  render() {
    const { selectedItem, showProjectDetails, loading, error } = this.state;

    return (
      <Fragment>
        <Content>
          <TitleBar title="Projects" />
          {!loading ? (
            !error ? (
              this.renderTable()
            ) : (
              this.renderError()
            )
          ) : (
            <TableRowSkeleton />
          )}
        </Content>

        {showProjectDetails && (
          <ProjectDetails
            visible={showProjectDetails}
            item={selectedItem}
            onClose={this.handleShowProjectDetails}
          />
        )}
      </Fragment>
    );
  }
}

export default ProjectsTable;
