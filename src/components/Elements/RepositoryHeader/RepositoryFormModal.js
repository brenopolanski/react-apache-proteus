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
import { Form, Modal, Icon, Input, Select, Spin } from 'antd';

// Services
import { RepositoryService } from '../../../services';

// Context API
import AppContext from '../../../AppContext';

// Utils
import Helpers from '../../../utils/Helpers';

// Components
const { Item } = Form;
const { Option } = Select;

const CreateRepositoryFormModal = Form.create({ name: 'repositoryFormModal' })(
  class extends Component {
    render() {
      const { form, visible, repo, loading, onCreate, onCancel } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          title="Repository Form"
          visible={visible}
          okText="Run"
          onOk={onCreate}
          onCancel={onCancel}
          centered
        >
          <Form layout="vertical">
            <Spin
              indicator={<Icon type="loading" style={{ fontSize: 30 }} spin />}
              spinning={loading}
            >
              <Item label="Repository to add to DRAT">
                {getFieldDecorator('repo', {
                  initialValue: repo,
                  rules: [
                    {
                      required: true,
                      message: 'Field is required'
                    }
                  ]
                })(<Input autoFocus allowClear />)}
              </Item>
              <Item label="Name of the repository">
                {getFieldDecorator('name')(<Input allowClear />)}
              </Item>
              <Item label="Description about the repository">
                {getFieldDecorator('description')(<Input allowClear />)}
              </Item>
              <Item label="Action">
                {getFieldDecorator('action', { initialValue: 'go' })(
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
  static contextType = AppContext;

  _isMounted = false;

  state = {
    loading: false,
    error: false
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
  };

  callApiSetAction = values => {
    const {
      setView,
      setCurrentRepo,
      setCurrentActionRequest,
      setProgress
    } = this.context;
    const { onCancel } = this.props;
    const { repo, name, description, action } = values;
    const data = {
      id: Helpers.uid(''),
      repo,
      name,
      description,
      loc_url: ''
    };

    this.setState({
      loading: true,
      error: false
    });

    RepositoryService.analyze(action, data)
      .then(res => {
        if (this._isMounted && res.status === 200) {
          this.setState({ loading: false });

          setView('analyze');
          setCurrentRepo(repo);
          setCurrentActionRequest(action);
          setProgress(true);
          onCancel();
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

      const { action } = values;

      if (action === 'reset') {
        this.callApiResetAction();
      } else {
        this.callApiSetAction(values);
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
        onCreate={this.handleCreate}
        onCancel={onCancel}
      />
    );
  }
}

export default RepositoryFormModal;
