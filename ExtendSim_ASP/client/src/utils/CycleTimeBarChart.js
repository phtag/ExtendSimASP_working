// Cycle-TimeBarChart.js
import React from 'react';
import UserContext from './UserContext'; 
import {Bar} from 'react-chartjs-2';
// import {Bar, Line} from 'react-chartjs-2';

class CycleTimeBarChart extends React.Component {
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
    componentDidMount () {
    };
    render() {  
        const {chartType} = this.props;
        const { cycleTimeChartData } = this.context;
        var dataSeriesLabels = [];
        var dataSeriesDisplay = [];
        var dataSeriesBorderWidths = [];
        var dataSeriesBackgroundColors = [];
        if ((chartType === "avg-wait-process") && (this.state.selectedChartType !== chartType)) {
            dataSeriesLabels[0] = 'Avg. Process Time';
            dataSeriesLabels[1] = 'Avg. Wait Time';
            dataSeriesDisplay[0] = true;
            dataSeriesDisplay[1] = true;
            dataSeriesBorderWidths[0] = 2;
            dataSeriesBorderWidths[1] = 2;
            dataSeriesBackgroundColors[0] = 'rgba(255, 0, 0, .75)';
            dataSeriesBackgroundColors[1] = 'rgba(0, 0, 255, .75)';
            this.setState({ chartTitle: 'Avg. Wait-Time/Avg. Process-Time by Process Step',
                            YaxisTitle: 'Time (hrs)',
                            XaxisTitle: 'Process Steps',
                            dataSeries1: cycleTimeChartData.avgProcessTime,
                            dataSeries2: cycleTimeChartData.avgWaitTime,
                            dataSeriesLabels: dataSeriesLabels,
                            dataSeriesDisplay: dataSeriesDisplay,
                            dataSeriesBorderWidths: dataSeriesBorderWidths,
                            dataSeriesBackgroundColors: dataSeriesBackgroundColors,
                            selectedChartType: chartType });
        } else if ((chartType === "total-wait-process") && (this.state.selectedChartType !== chartType)) {
            dataSeriesLabels[0] = 'Total Process Time';
            dataSeriesLabels[1] = 'Total Wait Time';
            dataSeriesDisplay[0] = true;
            dataSeriesDisplay[1] = true;
            dataSeriesBorderWidths[0] = 2;
            dataSeriesBorderWidths[1] = 2;
            dataSeriesBackgroundColors[0] = 'rgba(255, 0, 0, .75)';
            dataSeriesBackgroundColors[1] = 'rgba(0, 0, 255, .75)';
            this.setState({ chartTitle: 'Total Wait-Time/Total Process-Time by Process Step',
                            YaxisTitle: 'Time (hrs)',
                            XaxisTitle: 'Process Steps',
                            dataSeries1: cycleTimeChartData.totalProcessTime,
                            dataSeries2: cycleTimeChartData.totalWaitTime,
                            dataSeriesLabels: dataSeriesLabels,
                            dataSeriesDisplay: dataSeriesDisplay,
                            dataSeriesBorderWidths: dataSeriesBorderWidths,
                            dataSeriesBackgroundColors: dataSeriesBackgroundColors,
                            selectedChartType: chartType });
        } else if ((chartType === "total-jobs-processed") && (this.state.selectedChartType !== chartType)) {
            dataSeriesLabels[0] = 'Total Jobs Processed';
            dataSeriesLabels[1] = '';
            dataSeriesDisplay[0] = true;
            dataSeriesDisplay[1] = false;
            dataSeriesBorderWidths[0] = 2;
            dataSeriesBorderWidths[1] = 0;
            dataSeriesBackgroundColors[0] = 'rgba(0, 255, 0, 1)';
            dataSeriesBackgroundColors[1] = 'rgba(0, 0, 0, 0)';
            this.setState({ chartTitle: 'Total Jobs Processed by Process Step',
                            YaxisTitle: 'Jobs Processed',
                            XaxisTitle: 'Process Steps',
                            dataSeries1: cycleTimeChartData.totalJobsProcessed,
                            dataSeriesLabels: dataSeriesLabels,
                            dataSeriesDisplay: dataSeriesDisplay,
                            dataSeriesBorderWidths: dataSeriesBorderWidths,
                            dataSeriesBackgroundColors: dataSeriesBackgroundColors,
                            selectedChartType: chartType });
        } else if ((chartType === "covarrivals-covdepartures") && (this.state.selectedChartType !== chartType)) {
            dataSeriesLabels[0] = 'CoV Arrivals';
            dataSeriesLabels[1] = 'CoV Departures';
            dataSeriesDisplay[0] = true;
            dataSeriesDisplay[1] = true;
            dataSeriesBorderWidths[0] = 2;
            dataSeriesBorderWidths[1] = 2;
            dataSeriesBackgroundColors[0] = 'rgba(100, 100, 255, .8)';
            dataSeriesBackgroundColors[1] = 'rgba(100, 255, 100, .8)';
            this.setState({ chartTitle: 'Coefficient of Variation Arrivals/Departures by Process Step',
                            YaxisTitle: 'CoV Arrivals/CoV Departures',
                            XaxisTitle: 'Process Steps',
                            dataSeries1: cycleTimeChartData.CoVarrivals,
                            dataSeries2: cycleTimeChartData.CoVdepartures,
                            dataSeriesLabels: dataSeriesLabels,
                            dataSeriesDisplay: dataSeriesDisplay,
                            dataSeriesBorderWidths: dataSeriesBorderWidths,
                            dataSeriesBackgroundColors: dataSeriesBackgroundColors,
                            selectedChartType: chartType });
        }

        var ChartData = {
            labels: this.state.dataSeries1.map(element => (element.label)),
            datasets: [
                {
                    label: this.state.dataSeriesLabels[0],
                    data: this.state.dataSeries1.map(element => (element.value)),
                    backgroundColor: this.state.dataSeriesBackgroundColors[0],
                    hidden:  !this.state.dataSeriesDisplay[0],
                    borderWidth: this.state.dataSeriesBorderWidths[0]
                },
                {
                    label: this.state.dataSeriesLabels[1],
                    data: this.state.dataSeries2.map(element => (element.value)),
                    backgroundColor: this.state.dataSeriesBackgroundColors[1],
                    hidden:  !this.state.dataSeriesDisplay[1],
                    borderWidth: this.state.dataSeriesBorderWidths[1]
                },               
            ] 

        }
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
export default CycleTimeBarChart;