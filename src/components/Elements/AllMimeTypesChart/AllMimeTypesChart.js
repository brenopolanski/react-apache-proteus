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
import React, { Component } from 'react';
import isEqual from 'react-fast-compare';
import { Button, Result } from 'antd';
import * as d3 from 'd3';
import tinycolor from 'tinycolor2';

// Services
import { LicenseService } from '../../../services';

// Layout
import Content from '../../Layout/Content';

// UI
import { Loading, TitleBar } from '../../UI';

// Styles
import './AllMimeTypesChart.css';

class AllMimeTypesChart extends Component {
  _isMounted = false;

  state = {
    docs: [],
    loading: true,
    error: false,
    errorMsg: 'Error fetching data'
  };

  componentDidMount() {
    this._isMounted = true;
    this.callApiLoadSoftwareData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.state.docs, nextState.docs) ||
      this.state.loading !== nextState.loading ||
      this.state.error !== nextState.error
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.d3Chart.innerHTML = '';
    LicenseService.cancelRequest();
  }

  callApiLoadSoftwareData = () => {
    this.setState({
      loading: true,
      error: false
    });

    LicenseService.loadSoftwareData()
      .then(res => {
        if (this._isMounted && res.status === 200) {
          const { data } = res;
          const { docs } = data.response;

          this.setState({ docs, loading: false });
          this.drawChart(docs);
        } else {
          this.setState({
            loading: false,
            error: true
          });
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

  drawChart = docs => {
    const diameter = 860;
    const format = d3.format(',d');
    const bubble = d3
      .pack()
      .size([diameter, diameter])
      .padding(1.5);
    const svg = d3
      .select(this.d3Chart)
      .append('svg')
      .attr('width', diameter)
      .attr('height', diameter)
      .attr('class', 'proteus-bubbles-chart');
    let color = d3.scaleOrdinal(d3.schemeBrBG[11]);
    const resultingData = [];
    const mime = {};
    const nodeClasses = {};

    docs.forEach(doc => {
      for (const d in doc) {
        if (doc.hasOwnProperty(d)) {
          const key = d.split('mime_')[1];
          const value = doc[d];

          if (typeof mime[key] === 'undefined') {
            mime[key] = value;
          } else {
            mime[key] += value;
          }
        }
      }
    });

    for (const m in mime) {
      if (mime.hasOwnProperty(m)) {
        const obj = {};
        const jsonObject = {};
        const child = [];

        obj['name'] = m;
        jsonObject['name'] = m;
        jsonObject['size'] = mime[m];
        child.push(jsonObject);
        obj['children'] = child;
        resultingData.push(obj);
      }
    }

    nodeClasses['name'] = 'flare';
    nodeClasses['children'] = resultingData;

    let range = d3.schemeBrBG[11];
    range = range.concat(d3.schemePRGn[11]);

    color = d3.scaleOrdinal(range);

    const root = d3
      .hierarchy(this.chartClasses(nodeClasses))
      .sum(({ value }) => value);

    bubble(root);

    const node = svg
      .selectAll('.node')
      .data(root.children)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', ({ x, y }) => `translate(${x}, ${y})`);

    node
      .append('title')
      .text(({ data, value }) => `${data.className}: ${format(value)}`);

    node
      .append('circle')
      .attr('r', ({ r }) => r)
      .attr('style', ({ data }) => `fill:${color(data.className)}`);

    node
      .append('text')
      .attr('dy', '0.3em')
      .attr(
        'style',
        ({ data }) =>
          `fill: ${
            tinycolor(color(data.className)).isLight() ? '#000000' : '#ffffff'
          }`
      )
      .style('text-anchor', 'middle')
      .text(({ data, r }) => data.className.substring(0, r / 3));
  };

  chartClasses = nodeRoot => {
    const classes = [];

    function recurse(name, node) {
      if (node.children) {
        node.children.forEach(child => {
          recurse(node.name, child);
        });
      } else {
        classes.push({
          packageName: name,
          className: node.name,
          value: node.size
        });
      }
    }

    recurse(null, nodeRoot);

    return { children: classes };
  };

  renderError() {
    const { errorMsg } = this.state;

    return (
      <Result
        status="error"
        title={errorMsg}
        subTitle="Try again:"
        extra={
          <Button
            icon="sync"
            type="danger"
            onClick={this.callApiLoadSoftwareData}
          >
            Refresh
          </Button>
        }
      />
    );
  }

  renderChart() {
    return (
      <div
        className="proteus-all-mime-types-chart"
        ref={node => (this.d3Chart = node)}
      />
    );
  }

  render() {
    const { loading, error } = this.state;

    return (
      <Content>
        <TitleBar title="All MIME Types" />
        {!loading ? (
          !error ? (
            this.renderChart()
          ) : (
            this.renderError()
          )
        ) : (
          <Loading style={{ height: 336 }} />
        )}
      </Content>
    );
  }
}

export default AllMimeTypesChart;
