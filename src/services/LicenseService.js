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

// Utils
import Helpers from '../utils/Helpers';

// Constants
const REST_URL = '/solr/statistics/select';

class LicenseService {
  static async loadProjectData() {
    let response;

    try {
      response = await axios.get(`${REST_URL}?q=type:project&wt=json`);

      const { data } = response;
      const { numFound } = data.response;

      if (numFound !== null && numFound > 10) {
        response = await axios.get(
          `${REST_URL}?q=type:project&rows=${numFound}&wt=json`
        );
      }
    } catch (error) {
      Helpers.axiosHandleErrors(
        'services → LicenseService.js → loadProjectData()',
        error
      );

      return error.response;
    }

    return response;
  }

  static async loadLicenseData(repo) {
    let response;

    try {
      response = await axios.get(
        `${REST_URL}?q=id:"${repo}"&fl=license_*&wt=json`
      );

      const { data } = response;
      const { numFound } = data.response;

      if (numFound !== null) {
        response = await axios.get(
          `${REST_URL}?q=id:"${repo}"&fl=license_*&rows=${numFound}&wt=json`
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
        `${REST_URL}?q=parent:"${repo}"&rows=5000&wt=json`
      );

      const { data } = response;
      const { numFound } = data.response;

      if (numFound !== null) {
        response = await axios.get(
          `${REST_URL}?q=parent:"${repo}"&rows=${numFound}&wt=json`
        );
      }
    } catch (error) {
      Helpers.axiosHandleErrors(
        'services → LicenseService.js → loadFileDetails()',
        error
      );

      return error.response;
    }

    return response;
  }

  static async loadSoftwareData() {
    let response;

    try {
      response = await axios.get(
        `${REST_URL}?q=type:software&fl=mime_*&wt=json`
      );

      const { data } = response;
      const { numFound } = data.response;

      if (numFound !== null) {
        response = await axios.get(
          `${REST_URL}?q=type:software&rows=${numFound}&fl=mime_*&wt=json`
        );
      }
    } catch (error) {
      Helpers.axiosHandleErrors(
        'services → LicenseService.js → loadSoftwareData()',
        error
      );

      return error.response;
    }

    return response;
  }

  static async loadSoftwareLicenseData() {
    let response;

    try {
      response = await axios.get(
        `${REST_URL}?q=type:software&fl=license_*,id&sort=id+asc&wt=json`
      );

      const { data } = response;
      const { numFound } = data.response;

      if (numFound !== null) {
        response = await axios.get(
          `${REST_URL}?q=type:software&rows=${numFound}&fl=license_*,id&sort=id+asc&wt=json`
        );
      }
    } catch (error) {
      Helpers.axiosHandleErrors(
        'services → LicenseService.js → loadSoftwareLicenseData()',
        error
      );

      return error.response;
    }

    return response;
  }

  static async loadLicenseTypesData() {
    let response;

    try {
      response = await axios.get(
        `${REST_URL}?q=type:software&fl=license_*&wt=json`
      );

      const { data } = response;
      const { numFound } = data.response;

      if (numFound !== null) {
        response = await axios.get(
          `${REST_URL}?q=type:software&rows=${numFound}&fl=license_*&wt=json`
        );
      }
    } catch (error) {
      Helpers.axiosHandleErrors(
        'services → LicenseService.js → loadLicenseTypesData()',
        error
      );

      return error.response;
    }

    return response;
  }
}

export default LicenseService;
