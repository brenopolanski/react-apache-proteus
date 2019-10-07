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

const isProduction = process.env.REACT_APP_STAGE === 'production';

// not replacing newlines (which \s does)
const spacesAndTabs = /[ \t]{2,}/g;
const lineStartWithSpaces = /^[ \t]*/gm;

// using .trim() to clear the any newlines before the first text and after last text
const clean = value =>
  value
    .replace(spacesAndTabs, ' ')
    .replace(lineStartWithSpaces, '')
    .trim();

const getDevMessage = message =>
  clean(`
  %cApache Proteus

  %c${clean(message)}

  %c👷‍ This is a development only message. It will be removed in production builds.
`);

export const getFormattedMessage = message => [
  getDevMessage(message),
  // title (green400)
  'color: #00c584; font-size: 1.2em; font-weight: bold;',
  // message
  'line-height: 1.5',
  // footer (purple300)
  'color: #723874;'
];

const isDisabledFlag = '__react-app-disable-dev-logs';

export const log = (message, logType) => {
  // no logs in production
  if (isProduction) {
    return;
  }

  // manual opt out of logs
  if (typeof window !== 'undefined' && window[isDisabledFlag]) {
    return;
  }

  // eslint-disable-next-line no-console
  console[logType || 'log'](...getFormattedMessage(message));
};
