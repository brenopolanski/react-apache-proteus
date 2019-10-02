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
import './TopMimeTypesChart.css';

class TopMimeTypesChart extends Component {
  _isMounted = false;

  state = {
    docs: [],
    count: 10,
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
      !isEqual(this.state.count, nextState.count) ||
      !isEqual(this.state.loading, nextState.loading) ||
      !isEqual(this.state.error, nextState.error)
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
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

          console.log(docs);

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
    let { count } = this.state;
    const diameter = 420;
    const svg = d3
      .select(this.d3Chart)
      .append('svg')
      .attr('width', diameter)
      .attr('height', diameter)
      .attr('class', 'proteus-pie-chart');
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const radius = Math.min(width, height) / 4;
    const piePosX = width / 2 - 50;
    const piePosY = height / 2 - 90;
    const resultingData = [];
    const result = [];
    const mime = {};

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
        const jsonObject = {};

        jsonObject['key'] = m;
        jsonObject['y'] = mime[m];
        resultingData.push(jsonObject);
      }
    }

    resultingData.sort((a, b) => b.y - a.y);

    if (count > resultingData.length) {
      count = resultingData.length;
    }

    for (let i = 1; i <= count; i++) {
      result[i - 1] = resultingData[i - 1];
    }

    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${piePosX}, ${piePosY})`);

    const color = d3.scaleOrdinal(d3.schemePiYG[11]);

    const pie = d3
      .pie()
      .sort(null)
      .value(({ y }) => y);

    const path = d3
      .arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const label = d3
      .arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    const arc = g
      .selectAll('.arc')
      .data(pie(result))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arc
      .append('path')
      .attr('d', path)
      .attr('style', ({ data }) => `fill:${color(data.key)}`);

    arc
      .append('text')
      .attr('transform', d => `translate(${label.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr(
        'style',
        ({ data }) =>
          `fill: ${
            tinycolor(color(data.key)).isLight() ? '#000000' : '#ffffff'
          }`
      )
      .text(({ data }) => data.key);

    const legend = d3
      .select(this.d3Chart)
      .append('svg')
      .attr('class', 'proteus-legend-chart')
      .selectAll('g')
      .data(pie(result))
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${(i + 1) * 20})`);

    legend
      .append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', ({ data }, i) => color(data.key));

    legend
      .append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .text(({ data }) => data.key);
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
        className="proteus-top-mime-types-chart"
        ref={node => (this.d3Chart = node)}
      />
    );
  }

  render() {
    const { loading, error } = this.state;

    return (
      <Content style={{ height: 682 }}>
        <TitleBar title="Top MIME Types" />
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

export default TopMimeTypesChart;
