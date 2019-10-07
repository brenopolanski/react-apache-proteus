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
import React from 'react';
import PropTypes from 'prop-types';

// Images
import dratLogo from '../../images/drat-logo.png';
import leafLogo from '../../images/leaf-logo.png';

// Styles
const logoStyle = {
  display: 'block',
  margin: '10px',
  marginRight: 'auto',
  marginLeft: 'auto'
};

const Logo = ({ className, width, height, full, center }) => {
  const logo = full ? dratLogo : leafLogo;
  const style = center ? logoStyle : {};

  return (
    <img
      className={className}
      src={logo}
      width={width}
      height={height}
      alt="Apache logo"
      style={style}
    />
  );
};

Logo.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  full: PropTypes.bool
};

Logo.defaultProps = {
  width: 150,
  height: 150
};

export default Logo;
