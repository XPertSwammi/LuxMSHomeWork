import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { useServiceItself } from 'bi-internal/services';
import { FiltersService } from '../../services/FiltersService';
import './customersGraph.scss';

const CustomersGraph = (props) => {
    const {cfg, subspace, dp} = props;

    const filtersService = useServiceItself<FiltersService>(FiltersService);

    const containerRef = useRef(null);
    let chart = null;
    let options = {};

    const [filters, setFilters] = useState<Record<string, string[]>>({});

    filtersService.subscribeUpdates(({
        filters,
        loading,
        error
    }) => {
        if(loading || error) return;
        setFilters(filters);
    });
    
    const filterdXS = (filters[subspace.xAxis] || []).length ?
      subspace.xs.filter(x => filters[subspace.xAxis].includes(x.id)) :
      subspace.xs;
  
    const renderChart = (data) => {
      if (containerRef.current && data?.length) {
        console.log(data)
        if (!chart) {
          chart = echarts.default.init(containerRef.current, null, {renderer: 'svg'});
        }
        options = {
          title: {
            show: false
          },
          xAxis: {
            type: 'category',
            data: filterdXS.map(x => x.title)
          },
          yAxis: {
            type: 'value'
          },
          series: subspace.ys.map((y, yIndex) => ({
            name: y.title,
            type: 'bar',
            data: filterdXS.map((x, xIndex) => (
                {
                    name: x.title,
                    itemStyle: {
                      color: cfg.getColor(y, null, yIndex)
                    },
                    x,
                    y,
                    value: data[yIndex][xIndex]
                  }
            )),
            legend: {
              show: true,
              data: subspace.ys.map((y, yIndex) => ({
                name: y.title,
                icon: 'circle',
                itemStyle: {
                  color: cfg.getColor(y, null, yIndex)
                }
              })),
            }
          }))
        };
        chart.setOption(options);
        chart.resize();
      }
    }
  
    useEffect(() => {
      if (containerRef.current) {
        const observer = new ResizeObserver((entries) => {
          dp.getMatrixYX(subspace).then(dataArr => {
            renderChart(dataArr);
          });
        });
        observer.observe(containerRef.current);
        return () => {
          observer.disconnect();
        }
      }
    }, [cfg, subspace, filters]);
  
  
    return (
        <div 
            ref={containerRef}
            className="graphic"
         />
    );
};

export default CustomersGraph;