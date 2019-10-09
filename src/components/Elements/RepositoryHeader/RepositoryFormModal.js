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
import React, { Component, PureComponent } from 'react';
import { Form, Modal, Input, Select, Spin } from 'antd';

// Services
import { RepositoryService } from '../../../services';

// UI
import { ErrorMessage } from '../../UI';

// Utils
import Helpers from '../../../utils/Helpers';

// Components
const { Item } = Form;
const { Option } = Select;

const CreateRepositoryFormModal = Form.create({ name: 'repositoryFormModal' })(
  class extends Component {
    render() {
      const { form, visible, repo, loading, onCancel, onCreate } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          title="Repository Form"
          visible={visible}
          okText="Run"
          onCancel={onCancel}
          onOk={onCreate}
          centered
        >
          <Form layout="vertical">
            <Spin spinning={loading}>
              <Item label="Repository to add to DRAT">
                {getFieldDecorator('repo', {
                  initialValue: repo,
                  rules: [
                    {
                      required: true,
                      message: 'Field is required'
                    }
                  ]
                })(<Input allowClear />)}
              </Item>
              <Item label="Name of the repository">
                {getFieldDecorator('name')(<Input allowClear />)}
              </Item>
              <Item label="Description about the repository">
                {getFieldDecorator('description')(<Input allowClear />)}
              </Item>
              <Item label="Action">
                {getFieldDecorator('action', { initialValue: 'Go' })(
                  <Select>
                    <Option value="go">Go</Option>
                    <Option value="crawl">Crawl</Option>
                    <Option value="index">Index</Option>
                    <Option value="map">Map</Option>
                    <Option value="reduce">Reduce</Option>
                    <Option value="reset">Reset</Option>
                  </Select>
                )}
              </Item>
            </Spin>
          </Form>
        </Modal>
      );
    }
  }
);

class RepositoryFormModal extends PureComponent {
  _isMounted = false;

  state = {
    loading: false,
    error: false,
    errorMsg: 'Error fetching data'
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  callApiResetAction = () => {
    this.setState({
      loading: true,
      error: false
    });

    RepositoryService.resetAction()
      .then(res => {
        if (this._isMounted && res.status === 200) {
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
  };

  callApiSetAction = () => {
    this.setState({
      loading: true,
      error: false
    });

    RepositoryService.setAction()
      .then(res => {
        if (this._isMounted && res.status === 200) {
          console.log(res);
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

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleCreate = () => {
    const { form } = this.formRef.props;

    form.validateFields((error, values) => {
      if (error) {
        return;
      }

      const { repo, name, description, action } = values;
      const data = {
        id: Helpers.uid(''),
        repo,
        name,
        description,
        loc_url: ''
      };

      if (action === 'reset') {
        console.log('callApiResetAction()');

        this.callApiResetAction();
      } else {
        console.log('callApiSetAction()');
      }

      form.resetFields();
    });
  };

  render() {
    const { repo, onCancel } = this.props;
    const { loading } = this.state;

    return (
      <CreateRepositoryFormModal
        wrappedComponentRef={this.saveFormRef}
        repo={repo}
        visible={true}
        loading={loading}
        onCancel={onCancel}
        onCreate={this.handleCreate}
      />
    );
  }
}

export default RepositoryFormModal;
