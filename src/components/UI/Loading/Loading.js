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
import React from 'react';

// UI
import { Logo } from '../';

// Styles
import './Loading.css';

const Loading = ({ style }) => {
  return (
    <div className="proteus-loading" style={style}>
      <div className="proteus-loading-logo">
        <Logo width={50} height={50} />
      </div>
      <svg className="proteus-loading-spinner" viewBox="25 25 50 50">
        <circle
          className="proteus-loading-path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  );
};

export default Loading;
