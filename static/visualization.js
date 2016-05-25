$(document).ready(function () {
    d3.json('data.json', function (data) {
        var genderPieChart = dc.pieChart('#genderPie');
        var marriagePieChart = dc.pieChart('#marriagePie');
        var ageDefaultersChart = dc.barChart('#ageDefaulters');
        var limitBalDefaultersChart = dc.lineChart('#limitBalDefaulters');
        var defaultCountTicker = dc.numberDisplay('.default-count');
        var ndx = crossfilter(data);
        var defaultDim = ndx.dimension(function (d) {
            return d['default payment next month'];
        });
        var genderDim = ndx.dimension(function (d) {
            var sex = d['SEX'];
            if (sex === 1) {
                return 'Male';
            } else if (sex == 2) {
                return 'Female';
            } else {
                return 'Unknown';
            }
        });
        var marriageDim = ndx.dimension(function (d) {
            var status = d['MARRIAGE'];
            if (status === 1) {
                return 'Married';
            } else if (status == 2) {
                return 'Single';
            } else if (status === 3) {
                return 'Others';
            } else {
                return 'Unknown';
            }
        });

        genderPieChart
            .width(180)
            .height(180)
            .radius(80)
            .dimension(genderDim)
            .group(genderDim.group());
        genderPieChart.controlsUseVisibility(true);
        $('#genderPie > a').on('click', function (e) {
            genderPieChart.filterAll();
            dc.redrawAll();
            e.preventDefault();
        });

        marriagePieChart
            .width(180)
            .height(180)
            .radius(80)
            .dimension(marriageDim)
            .group(marriageDim.group());
        marriagePieChart.controlsUseVisibility(true);
        $('#marriagePie > a').on('click', function (e) {
            marriagePieChart.filterAll();
            dc.redrawAll();
            e.preventDefault();
        });
        ageMinMax = d3.extent(data, function (d) {
            return d['AGE'];
        });
        ageDefaultersDim = ndx.dimension(function (d) {
            return d['AGE'];
        });

        ageDefaultersChart
            .width(900)
            .height(250)
            .dimension(ageDefaultersDim)
            .group(ageDefaultersDim.group().reduceSum(dc.pluck('default payment next month')))
            .x(d3.scale.linear().domain(ageMinMax))
            .elasticY(true)
            .elasticX(true)
            .xAxisLabel('Age')
            .yAxisLabel('People Who Defaulted');

        limitDefaultersDim = ndx.dimension(function (d) {
            return d['LIMIT_BAL'];
        });

        limitBalMinMax = d3.extent(data, function (d) {
            return d['LIMIT_BAL'];
        });

        limitBalDefaultersChart
            .width(900)
            .height(250)
            .dimension(limitDefaultersDim)
            .group(limitDefaultersDim.group().reduceSum(dc.pluck('default payment next month')))
            .x(d3.scale.linear().domain(limitBalMinMax))
            .renderArea(true)
            .mouseZoomable(true)
            .elasticY(true)
            .xAxisLabel('Amount of Credit Given')
            .yAxisLabel('People');


        defaultCountTicker
            .group(defaultDim.group())
            .formatNumber(d3.format(''));


        dc.renderAll();

    });
});