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
import React, { Fragment } from 'react';
import { Row, Col } from 'antd';

// Elements
import {
  AllMimeTypesChart,
  LicenseTypesChart,
  ProjectsTable,
  TopMimeTypesChart
} from '../../components/Elements';

const Summary = () => {
  return (
    <Fragment>
      <ProjectsTable />
      <AllMimeTypesChart />
      <Row>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <LicenseTypesChart />
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <TopMimeTypesChart />
        </Col>
      </Row>
    </Fragment>
  );
};

export default Summary;
