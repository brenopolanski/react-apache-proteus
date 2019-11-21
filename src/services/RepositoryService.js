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
import axios from 'axios';
import { isEmpty } from 'lodash';

// Utils
import Helpers from '../utils/Helpers';

// Constants
const REST_URL = '/proteus/drat';

class RepositoryService {
  static async resetAction() {
    const url = `${REST_URL}/reset`;
    let response;

    try {
      response = await axios.post(url, '');
    } catch (error) {
      Helpers.axiosHandleErrors(
        'services → RepositoryService.js → resetAction()',
        error
      );

      return error.response;
    }

    return response;
  }

  static async analyze(action, data) {
    const url = `${REST_URL}/${action}`;
    let response;

    try {
      response = await axios.post(url, data);
    } catch (error) {
      Helpers.axiosHandleErrors(
        'services → RepositoryService.js → analyze()',
        error
      );

      return error.response;
    }

    return response;
  }

  static async loadCurrentRepo(currentRepo) {
    let repo = '';
    let response;

    try {
      if (currentRepo.indexOf('http') !== -1) {
        response = await axios.get(`${REST_URL}/currentrepo`);

        const { data } = response;

        repo = data;
      }

      if (!isEmpty(currentRepo)) {
        response = await axios.get('/proteus/service/products?topn=10');
      }
    } catch (error) {
      Helpers.axiosHandleErrors(
        'services → RepositoryService.js → loadCurrentRepo()',
        error
      );

      return error.response;
    }

    return { repo, response };
  }
}

export default RepositoryService;
