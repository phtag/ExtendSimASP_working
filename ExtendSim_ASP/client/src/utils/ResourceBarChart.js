// Cycle-TimeBarChart.js
import React from 'react';
import UserContext from './UserContext'; 
import {Bar} from 'react-chartjs-2';
// import {Bar, Line} from 'react-chartjs-2';

class ResourceBarChart extends React.Component {
    static contextType = UserContext;
    state = {
        selectedChartType: "",
        chartTitle: "",
        XaxisTitle: "",
        YaxisTitle: "",
        dataSeries1: [],
        dataSeries2: [],
        dataSeriesDisplay: [],
        dataSeriesLabels: [],
        dataSeriesBorderWidths: [],
        dataSeriesBackgroundColors: []
    }
    handlePopupChange = (event) => {
    }
    componentDidMount () {
        const { resourceChartData } = this.context;
        this.setState({ dataSeries1: resourceChartData.TotalBusyTime,
                        dataSeries2: resourceChartData.TotalIdleTime });
    };
    render() {
        const {chartType} = this.props;
        const { resourceChartData } = this.context;
        var dataSeriesLabels = [];
        var dataSeriesDisplay = [];
        var dataSeriesBorderWidths = [];
        var dataSeriesBackgroundColors = [];

        if ((chartType === "idle-busy") && (this.state.selectedChartType !== chartType)) {
            dataSeriesLabels[0] = 'Total Busy Time';
            dataSeriesLabels[1] = 'Total Idle Time';
            dataSeriesDisplay[0] = true;
            dataSeriesDisplay[1] = true;
            dataSeriesBorderWidths[0] = 2;
            dataSeriesBorderWidths[1] = 2;
            dataSeriesBackgroundColors[0] = 'rgba(255, 0, 0, .75)';
            dataSeriesBackgroundColors[1] = 'rgba(0, 0, 255, .75)';
            this.setState({ chartTitle: 'Total Idle-Time/Total Busy-Time by Resource',
                            YaxisTitle: 'Time (hrs)',
                            XaxisTitle: 'Resources',
                            dataSeries1: resourceChartData.TotalBusyTime,
                            dataSeries2: resourceChartData.TotalIdleTime,
                            dataSeriesLabels: dataSeriesLabels,
                            dataSeriesDisplay: dataSeriesDisplay,
                            dataSeriesBorderWidths: dataSeriesBorderWidths,
                            dataSeriesBackgroundColors: dataSeriesBackgroundColors,
                            selectedChartType: chartType });
        } else  if ((chartType === "utilization") && (this.state.selectedChartType !== chartType)) {
            dataSeriesLabels[0] = 'Utilization';
            dataSeriesLabels[1] = '';
            dataSeriesDisplay[0] = true;
            dataSeriesDisplay[1] = false;
            dataSeriesBorderWidths[0] = 2;
            dataSeriesBorderWidths[1] = 0;
            dataSeriesBackgroundColors[0] = 'rgba(255, 100, 100, 1)';
            dataSeriesBackgroundColors[1] = 'rgba(0, 0, 0, 0)';
            this.setState({ chartTitle: 'Utilization by Resource',
                            YaxisTitle: 'Utilization',
                            XaxisTitle: 'Resources',
                            dataSeries1: resourceChartData.Utilization,
                            dataSeriesLabels: dataSeriesLabels,
                            dataSeriesDisplay: dataSeriesDisplay,
                            dataSeriesBorderWidths: dataSeriesBorderWidths,
                            dataSeriesBackgroundColors: dataSeriesBackgroundColors,
                            selectedChartType: chartType });
        } else  if ((chartType === "total-orders-serviced") && (this.state.selectedChartType !== chartType)) {
            dataSeriesLabels[0] = 'Total Orders Serviced';
            dataSeriesLabels[1] = '';
            dataSeriesDisplay[0] = true;
            dataSeriesDisplay[1] = false;
            dataSeriesBorderWidths[0] = 2;
            dataSeriesBorderWidths[1] = 0;
            dataSeriesBackgroundColors[0] = 'rgba(0, 255, 0, 1)';
            dataSeriesBackgroundColors[1] = 'rgba(0, 0, 0, 0)';
            this.setState({ chartTitle: 'Total Orders Serviced by Resource',
                            YaxisTitle: 'Orders Serviced',
                            XaxisTitle: 'Resources',
                            dataSeries1: resourceChartData.TotalOrdersServiced,
                            dataSeriesLabels: dataSeriesLabels,
                            dataSeriesDisplay: dataSeriesDisplay,
                            dataSeriesBorderWidths: dataSeriesBorderWidths,
                            dataSeriesBackgroundColors: dataSeriesBackgroundColors,
                            selectedChartType: chartType });
        }
        var ChartData = {
            // labels: resourceChartData.TotalIdleTime.map(element => (element.label)),
            labels: this.state.dataSeries1.map(element => (element.label)),
            datasets: [
                {
                    label: this.state.dataSeriesLabels[0],
                    // data: resourceChartData.TotalBusyTime.map(element => (element.value)),
                    data: this.state.dataSeries1.map(element => (element.value)),
                    backgroundColor: this.state.dataSeriesBackgroundColors[0],
                    hidden:  !this.state.dataSeriesDisplay[0],
                    borderWidth: this.state.dataSeriesBorderWidths[0]
                },
                {
                    label: this.state.dataSeriesLabels[1],
                    // data: resourceChartData.TotalIdleTime.map(element => (element.value)),
                    data: this.state.dataSeries2.map(element => (element.value)),
                    backgroundColor: this.state.dataSeriesBackgroundColors[1],
                    hidden:  !this.state.dataSeriesDisplay[1],
                    borderWidth: this.state.dataSeriesBorderWidths[1]
                },               
            ] 

        }
        // const legendItems = [
        //     { title: 'Total Idle Time', color: 'red', stroke: '#fff', strokeWidth: '10' },
        //     { title: 'Total Busy Time', color: 'blue', stroke: '#fff', strokeWidth: '2' }
        // ];
        return (
            <UserContext.Consumer>
            {({chartProperties}) => (
            <div id="cycle-time-chart">
                <Bar
                    data={ChartData}
                    options={{
                        title:{
                            display: true,
                            fontSize: chartProperties.titleFontSize,
                            text: this.state.chartTitle
                        },
                        scales: {
                            xAxes: [
                                { 
                                    display:true,
                                    stacked: true ,
                                    scaleLabel: {
                                        display: true,
                                        labelString: this.state.XaxisTitle,
                                        fontSize: chartProperties.axesLabelFontSize
                                    }
                                }],
                            yAxes: [
                                { 
                                    display:true,
                                    stacked: true ,
                                    scaleLabel: {
                                        display: true,
                                        labelString: this.state.YaxisTitle,
                                        fontSize: chartProperties.axesLabelFontSize
                                    }
                                }
                            ]
                          },
                        legend: {
                            display: true,
                            position: 'right',
                            labels: {
                                filter: () => function(legendItem, ChartData) {
                                 if (this.state.dataSeriesDisplay[legendItem.datasetIndex]) {
                                   return false;
                                 }
                                return true;
                                }
                             }
                        },
                        layout: {}
                    }}
                />
            </div>
        )}
        </UserContext.Consumer>  
        );
    }
}
export default ResourceBarChart;