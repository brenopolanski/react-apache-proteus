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
import axios, { CancelToken } from 'axios';

// Utils
import Helpers from '../utils/Helpers';

// Constants
const REST_URL = '/solr/statistics/select';

// Axios Cancellation
let axiosCancelRequest;
const cancelToken = {
  cancelToken: new CancelToken(function executor(c) {
    // An executor function receives a cancel function as a parameter
    axiosCancelRequest = c;
  })
};

class LicenseService {
  static async loadData() {
    let response;

    try {
      response = await axios.get(`${REST_URL}?q=type:project&wt=json`, {
        ...cancelToken
      });

      const { data } = response;
      const { numFound } = data.response;

      if (numFound !== null && numFound > 10) {
        response = await axios.get(
          `${REST_URL}?q=type:project&rows=${numFound}&wt=json`,
          {
            ...cancelToken
          }
        );
      }
    } catch (error) {
      Helpers.axiosHandleErrors(
        'services → LicenseService.js → loadData()',
        error
      );

      return error.response;
    }

    return response;
  }

  static async loadLicenseData(repo) {
    let response;

    try {
      // TODO: Test using id:"${repo}"
      response = await axios.get(
        `${REST_URL}?q=id:"${repo}"&fl=license_*&wt=json`,
        {
          ...cancelToken
        }
      );

      const { data } = response;
      const { numFound } = data.response;

      if (numFound !== null) {
        response = await axios.get(
          `${REST_URL}?q=id:"${repo}"&fl=license_*&rows=${numFound}&wt=json`,
          {
            ...cancelToken
          }
        );
      }
    } catch (error) {
      Helpers.axiosHandleErrors(
        'services → LicenseService.js → loadLicenseData()',
        error
      );

      return error.response;
    }

    return response;
  }

  static async loadFileDetails(repo) {
    let response;

    try {
      response = await axios.get(
        `${REST_URL}?q=parent:"${repo}"&rows=5000&wt=json`,
        {
          ...cancelToken
        }
      );

      // TODO ADD SOME IF (numFound) {...}

      const { data } = response;
      const { numFound } = data.response;

      response = await axios.get(
        `${REST_URL}?q=parent:"${repo}"&rows=${numFound}&wt=json`,
        {
          ...cancelToken
        }
      );
    } catch (error) {
      Helpers.axiosHandleErrors(
        'services → LicenseService.js → loadFileDetails()',
        error
      );

      return error.response;
    }

    return response;
  }

  static cancelRequest() {
    // Cancel the axios request
    // Reference: https://github.com/axios/axios#cancellation
    axiosCancelRequest();
  }
}

export default LicenseService;
