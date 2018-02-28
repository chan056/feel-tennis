var ctx = document.getElementById("myChart").getContext('2d');

var chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["1", "2", "3", "4", "5", "6"],
        datasets: [
            {
                label: '技术',
                data: [19, 12, 5, 4, 2, 3],
                backgroundColor: chartColors.green,
                borderColor: chartColors.green,
                borderWidth: 1,
                fill: false
            },
            {
                label: '运动员',
                data: [22, 12, 9, 6, 2, 1],
                backgroundColor: chartColors.blue,
                borderColor: chartColors.blue,
                borderWidth: 1,
                fill: false
            }
        ],
    },
    options: {
        responsive: true,
        title:{
            display:true,
            text:'投票结果'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '排名'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '票数'
                }
            }]
        }
    }
});

// window.myChart.update();// 更新
