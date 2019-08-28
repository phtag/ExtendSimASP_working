function refreshBarChart(avgRatings, coffeeShopName, coffeeShopAddress) {
    // alert("Updating chart");
    var chartArea = $('#bar-chart');
    // window.chart = new Chart(chartArea, {});
    var chartData = [];
    chartData.push(avgRatings.avg_wifi);
    chartData.push(avgRatings.avg_food);
    chartData.push(avgRatings.avg_powerOutlets);
    chartData.push(avgRatings.avg_alternativeBeverages);
    chartData.push(avgRatings.avg_spaceForMeetings);
    chartData.push(avgRatings.avg_parking);
    chartData.push(avgRatings.avg_overall);
    
    var chartText = "Average Category Ratings for " + coffeeShopName + " at " + coffeeShopAddress;
    var myBarChart = new Chart(chartArea, {
        type: 'bar',
        data: {
            labels: ["Wifi", "Food", "Power outlets", "Beverage alternatives", "Meeting space", "Parking", "Overall"],
            datasets: [
                {
                label: 'average across all reviews',
                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", 'rgb(100, 5, 30)', 'rgb(50, 200, 75)'],
                data: chartData
                }
            ]
        },
        options: {
            responsive: true,
            legend: { display: false },
            title: {
                display: true,
                text: chartText
            },
            scales: {
                yAxes: [{
                  barPercentage: 0.5,
                  ticks: {
                    min: 0,
                    max: 5,
                    stepSize: 1
                  }
                }]
            }
        }
    });
}
