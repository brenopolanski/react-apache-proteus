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
import * as d3 from 'd3';
import tinycolor from 'tinycolor2';
import { Button, Result } from 'antd';

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
      .attr('class', 'bubbles-chart');
    let color = d3.scaleOrdinal(d3.schemeBrBG[11]);
    const resultingData = [];
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

    var test = {};
    test['name'] = 'flare';
    test['children'] = resultingData;

    var range = d3.schemeBrBG[11];
    range = range.concat(d3.schemePRGn[11]);

    color = d3.scaleOrdinal(range);

    var root = d3.hierarchy(this.classes(test)).sum(function(d) {
      return d.value;
    });

    bubble(root);

    var node = svg
      .selectAll('.node')
      .data(root.children)

      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });

    node.append('title').text(function(d) {
      return d.data.className + ': ' + format(d.value);
    });

    node
      .append('circle')
      .attr('r', function(d) {
        return d.r;
      })
      .attr('style', function(d) {
        return 'fill:' + color(d.data.className);
      });

    node
      .append('text')
      .attr('dy', '.3em')
      .attr('style', d => {
        return `fill: ${
          tinycolor(color(d.data.className)).isLight() ? '#000000' : '#ffffff'
        }`;
      })
      .style('text-anchor', 'middle')
      .text(function(d) {
        return d.data.className.substring(0, d.r / 3);
      });
  };

  classes = root => {
    var classes = [];

    function recurse(name, node) {
      if (node.children)
        node.children.forEach(function(child) {
          recurse(node.name, child);
        });
      else
        classes.push({
          packageName: name,
          className: node.name,
          value: node.size
        });
    }

    recurse(null, root);
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
        className="proteus-bubbles-chart"
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
