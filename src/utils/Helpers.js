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
import { uniqueId } from 'lodash';

// Utils
import { log } from './dev-logs';

class Helpers {
  /**
   * Generate UID for an item.
   *
   * @example:
   *
   *    <li key={`${Helpers.uid(key)}`}>Lorem ipsum</li>
   */
  static uid(item) {
    if (typeof item === 'number' || typeof item === 'string') {
      return `${uniqueId(`${item}_`)}`;
    }

    log('The value for the uid must be a "string" or "number".', 'warn');
  }

  // Reference: https://github.com/axios/axios#handling-errors
  static axiosHandleErrors(name, error) {
    if (name) {
      log(`Logging for: ${name}`);
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }

    console.error(error.config);
  }
}

export default Helpers;
