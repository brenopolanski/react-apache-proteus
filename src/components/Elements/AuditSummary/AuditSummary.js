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

// Services
import { LicenseService } from '../../../services';

// Layout
import Content from '../../Layout/Content';

// UI
import { Loading, TitleBar } from '../../UI';

class AuditSummary extends Component {
  state = {
    docs: [],
    loading: true,
    error: false,
    errorMsg: 'Error fetching data'
  };

  componentDidMount() {
    this.callApiLoadSoftwareLicenseData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.state.docs, nextState.docs) ||
      this.state.loading !== nextState.loading ||
      this.state.error !== nextState.error
    );
  }

  callApiLoadSoftwareLicenseData = () => {
    this.setState({
      loading: true,
      error: false
    });

    LicenseService.loadSoftwareLicenseData()
      .then(res => {
        if (res.status === 200) {
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
        this.setState({
          loading: false,
          error: true
        });
      });
  };

  drawChart = docs => {
    const label_names = [];
    const Standards = [];
    const Apache = [];
    const Binaries = [];
    const Generated = [];
    const Unknown = [];
    const Archives = [];
    const Notes = [];

    for (var i = 0; i < docs.length; i++) {
      const doc = docs[i];
      const repo = doc.id.split('/');
      let reponame = repo[repo.length - 1];
      if (reponame.indexOf('part') === 0) reponame = repo[repo.length - 2];

      if (label_names[label_names.length - 1] === reponame) {
        Standards[Standards.length - 1] += doc['license_Standards'];
        Apache[Apache.length - 1] += doc['license_Apache'];
        Binaries[Binaries.length - 1] += doc['license_Binaries'];
        Generated[Generated.length - 1] += doc['license_Generated'];
        Unknown[Unknown.length - 1] += doc['license_Unknown'];
        Archives[Archives.length - 1] += doc['license_Archives'];
        Notes[Notes.length - 1] += doc['license_Notes'];
        continue;
      }

      label_names.push(reponame);
      Standards.push(doc['license_Standards']);
      Apache.push(doc['license_Apache']);
      Binaries.push(doc['license_Binaries']);
      Generated.push(doc['license_Generated']);
      Unknown.push(doc['license_Unknown']);
      Archives.push(doc['license_Archives']);
      Notes.push(doc['license_Notes']);
    }

    const data = {
      labels: label_names,
      series: [
        {
          label: 'Standards',
          values: Standards
        },
        {
          label: 'Apache',
          values: Apache
        },
        {
          label: 'Binaries',
          values: Binaries
        },
        {
          label: 'Generated',
          values: Generated
        },
        {
          label: 'Unknown',
          values: Unknown
        },
        {
          label: 'Archives',
          values: Archives
        },
        {
          label: 'Notes',
          values: Notes
        }
      ]
    };

    const chartWidth = 600;
    const barHeight = 25;
    const groupHeight = barHeight * data.series.length;
    const gapBetweenGroups = 25;
    const spaceForLabels = 150;
    const spaceForLegend = 150;

    // Zip the series data together (first values, second values, etc.)
    const zippedData = [];
    for (i = 0; i < data.labels.length; i++) {
      for (let j = 0; j < data.series.length; j++) {
        zippedData.push(data.series[j].values[i]);
      }
    }

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeAccent);
    const mylabels = [
      'Standards',
      'Apache',
      'Binaries',
      'Generated',
      'Unknown',
      'Archives',
      'Notes'
    ];
    const chartHeight =
      barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(zippedData)])
      .range([0, chartWidth]);

    const yAxis = d3
      .axisLeft(x)
      .tickFormat('')
      .tickSize(0);

    // Specify the chart area and dimensions
    const chart = d3
      .select(this.d3Chart)
      .append('svg')
      .attr('width', spaceForLabels + chartWidth + spaceForLegend)
      .attr('height', chartHeight);

    // Create bars
    const bar = chart
      .selectAll('g')
      .data(zippedData)
      .enter()
      .append('g')
      .attr(
        'transform',
        (d, i) =>
          `translate(${spaceForLabels},${i * barHeight +
            gapBetweenGroups * (0.5 + Math.floor(i / data.series.length))})`
      );

    // Create rectangles of the correct width
    bar
      .append('rect')
      .attr('style', (d, i) => `fill:${color(i % data.series.length)}`)
      .attr('class', 'bar')
      .attr('width', x => (x > 0 ? x : 0))
      .attr('height', barHeight - 1);

    bar
      .append('rect')
      .attr('x', d => {
        let xtoreturn = x(d);
        if (x(d) < 10) xtoreturn = x(d) + 10;
        else if (x(d) < 75) xtoreturn = x(d) - 77;
        else xtoreturn = x(d) - 83;
        if (xtoreturn < 0) return 0;
        else return xtoreturn;
      })
      .attr('y', 7)
      .attr('width', 80)
      .attr('height', barHeight - 15)
      .attr('fill', 'white');

    // Add text label in bar
    bar
      .append('text')
      .attr('x', d => {
        let xtoreturn = x(d);
        if (x(d) < 80) xtoreturn = 5;
        else xtoreturn = x(d) - 63;
        if (xtoreturn < 0) return 0;
        else return xtoreturn;
      })
      .attr('y', barHeight / 2 + 1.5)
      .attr('style', (d, i) => `fill:${color(i % data.series.length)}`)
      .attr('style', 'font-size:.55em')
      .text((d, i) => `${d} ${mylabels[i % data.series.length]}`);

    // Draw labels
    bar
      .append('text')
      .attr('class', 'label')
      .attr('x', (d, i) => {
        let x = -groupHeight / 2;
        if (i % data.series.length === 0)
          x -= data.labels[Math.floor(i / data.series.length)].length * 3;
        return x;
      })
      .attr('y', -20)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(-90)')
      .text((d, i) => {
        if (i % data.series.length === 0)
          return data.labels[Math.floor(i / data.series.length)];
        else return '';
      });

    chart
      .append('g')
      .attr('class', 'y axis')
      .attr(
        'transform',
        `translate(${spaceForLabels}, ${-gapBetweenGroups / 2})`
      )
      .call(yAxis);

    // Draw legend
    const legendRectSize = 18;

    const legendSpacing = 4;

    const legend = chart
      .selectAll('.legend')
      .data(data.series)
      .enter()
      .append('g')
      .attr('transform', (d, i) => {
        const height = legendRectSize + legendSpacing;
        const offset = -gapBetweenGroups / 2;
        const vert = i * height - offset;
        return `translate(${0},${vert})`;
      });

    legend
      .append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', (d, i) => color(i))
      .style('stroke', (d, i) => color(i));

    legend
      .append('text')
      .attr('class', 'legend')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(({ label }) => label);
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
        className="proteus-audit-summary"
        ref={node => (this.d3Chart = node)}
      />
    );
  }

  render() {
    const { loading, error } = this.state;

    return (
      <Content>
        <TitleBar title="Audit Summary" />
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

export default AuditSummary;
