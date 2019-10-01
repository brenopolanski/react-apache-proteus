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
import './LicenseTypesChart.css';

class LicenseTypesChart extends Component {
  _isMounted = false;

  state = {
    docs: [],
    loading: true,
    error: false,
    errorMsg: 'Error fetching data'
  };

  componentDidMount() {
    this._isMounted = true;
    this.callApiLoadLicenseTypesData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.state.docs, nextState.docs) ||
      !isEqual(this.state.loading, nextState.loading) ||
      !isEqual(this.state.error, nextState.error)
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
    LicenseService.cancelRequest();
  }

  callApiLoadLicenseTypesData = () => {
    this.setState({
      loading: true,
      error: false
    });

    LicenseService.loadLicenseTypesData()
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
    var resultingData = [];
    var result = [];
    var license = {};

    for (var i = 0; i < docs.length; i++) {
      var doc = docs[i];
      for (var x in doc) {
        var key = x.split('license_')[1];
        var value = doc[x];
        if (typeof license[key] === 'undefined') {
          license[key] = value;
        } else {
          license[key] += value;
        }
      }
    }

    for (x in license) {
      var jsonObject = {};
      jsonObject['key'] = x;
      jsonObject['y'] = license[x];
      resultingData.push(jsonObject);
    }

    resultingData.sort(function(a, b) {
      return b.y - a.y;
    });

    for (i = 0; i < resultingData.length; i++) {
      if (resultingData[i]['y'] === 0) break;
      result[i] = resultingData[i];
    }

    var svg = d3
        .select(this.d3Chart)
        .append('svg')
        .attr('width', 420)
        .attr('height', 600),
      width = +svg.attr('width'),
      height = +svg.attr('height'),
      radius = Math.min(width, height) / 2,
      g = svg
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    var color = d3.scaleOrdinal(d3.schemeSet3);

    var pie = d3
      .pie()
      .sort(null)
      .value(function(d) {
        return d.y;
      });

    var path = d3
      .arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    var label = d3
      .arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);
    var arc = g
      .selectAll('.arc')
      .data(pie(result))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arc
      .append('path')
      .attr('d', path)
      .attr('style', function(d) {
        return 'fill:' + color(d.data.key);
      });

    arc
      .append('text')
      .attr('transform', function(d) {
        return 'translate(' + label.centroid(d) + ')';
      })
      .attr('dy', '0.35em')
      .attr('style', d => {
        return `fill: ${
          tinycolor(color(d.data.key)).isLight() ? '#000000' : '#ffffff'
        }`;
      })
      .text(function(d) {
        return d.data.key;
      });

    var legend = d3
      .select(this.d3Chart)
      .append('svg')
      .attr('class', 'legend')
      .selectAll('g')
      .data(pie(result)) //setting the data as we know there are only two set of data[programmar/tester] as per the nest function you have written
      .enter()
      .append('g')
      .attr('transform', function(d, i) {
        return 'translate(0,' + (i + 1) * 20 + ')';
      });

    legend
      .append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', function(d, i) {
        return color(d.data.key);
      });

    legend
      .append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .text(function(d) {
        return d.data.key;
      });
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
            onClick={this.callApiLoadLicenseTypesData}
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
        className="proteus-license-types-chart"
        ref={node => (this.d3Chart = node)}
      />
    );
  }

  render() {
    const { loading, error } = this.state;

    return (
      <Content>
        <TitleBar title="License Types" />
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

export default LicenseTypesChart;
