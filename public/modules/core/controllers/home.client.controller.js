'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Trains', 'Arrivals', 'Departures', 'Tracks',
    function($scope, Authentication, Trains, Arrivals, Departures, Tracks) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.trains = Trains.query();
        $scope.tracks = Tracks.query();
        $scope.arrivals = Arrivals.query();
        $scope.departures = Departures.query();

        $scope.$watch('trains.length + tracks.length + arrivals.length + departures.length', function () {
            if ($scope.trains.length && $scope.tracks.length && $scope.arrivals.length && $scope.departures.length) {
                $scope.draw();
            }
        });

        $scope.draw = function () {
            // 基础分割线
            var majorStrokeWidth = 2;

            // 高度设定
            var rowHeight = 32;
            var rowCount = $scope.arrivals.length + $scope.tracks.length + $scope.departures.length + 2;
            var height = rowHeight * rowCount;

            var arrivalSectionHeight = $scope.arrivals.length * rowHeight;
            var tracksSectionHeight = $scope.tracks.length * rowHeight;
            var departureSectionHeight = $scope.departures.length * rowHeight;

            // 宽度设定
            var hourColumnWidth = 180;
            var hourColumnCount = 24;
            var minuteColumnWidth = 30;
            var sideColumnWidth = 32;
            var headerColumnWidth = 120;

            var width = hourColumnWidth * hourColumnCount + sideColumnWidth + headerColumnWidth;

            // 根节点
            var svg = d3.select('svg')
                .attr('width', width)
                .attr('height', height);

            // 横向的分行细线
            svg.append('g')
                .attr('class', 'xaxis-minor-grids')
                .selectAll('line')
                .data(d3.range(1, rowCount))
                .enter()
                    .append('line')
                    .attr('class', 'minor-grid-line')
                    .attr('x1', sideColumnWidth)
                    .attr('y1', function (d, i) { return rowHeight * d; })
                    .attr('x2', width)
                    .attr('y2', function (d, i) { return rowHeight * d; });

            // 纵向的分钟细线
            svg.append('g')
                .attr('class', 'yaxis-minor-grids')
                .selectAll('line')
                .data(d3.range(1, hourColumnCount * (hourColumnWidth / minuteColumnWidth)))
                .enter()
                    .append('line')
                    .attr('class', 'minor-grid-line')
                    .attr('x1', function (d, i) { return majorStrokeWidth + sideColumnWidth + headerColumnWidth + minuteColumnWidth * d; } )
                    .attr('y1', rowHeight + majorStrokeWidth)
                    .attr('x2', function (d, i) { return majorStrokeWidth + sideColumnWidth + headerColumnWidth + minuteColumnWidth * d; } )
                    .attr('y2', height - majorStrokeWidth - rowHeight);

            // 横向的4条粗线，时间轴
            svg.append('g')
                .attr('class', 'xaxis-major-grids')
                .selectAll('line')
                .data([0, arrivalSectionHeight, arrivalSectionHeight + tracksSectionHeight, arrivalSectionHeight + tracksSectionHeight + departureSectionHeight])
                .enter()
                    .append('line')
                    .attr('class', 'major-grid-line')
                    .attr('x1', majorStrokeWidth)
                    .attr('y1', function (d, i) { return d + rowHeight; })
                    .attr('x2', width - majorStrokeWidth)
                    .attr('y2', function (d, i) { return d + rowHeight; });

            // 纵向的前两条粗线
            svg.append('g')
                .attr('class', 'yaxis-major-grids')
                .selectAll('line')
                .data([sideColumnWidth, sideColumnWidth + headerColumnWidth])
                .enter()
                    .append('line')
                    .attr('class', 'major-grid-line')
                    .attr('x1', function (d, i) { return d; })
                    .attr('y1', rowHeight)
                    .attr('x2', function (d, i) { return d; })
                    .attr('y2', height - rowHeight);

            // 纵向的小时粗线
            svg.append('g')
                .attr('class', 'yaxis-major-grids')
                .selectAll('line')
                .data(d3.range(1, 24))
                .enter()
                    .append('line')
                    .attr('class', 'major-grid-line')
                    .attr('x1', function (d, i) { return sideColumnWidth + headerColumnWidth + hourColumnWidth * d + majorStrokeWidth; })
                    .attr('y1', rowHeight)
                    .attr('x2', function (d, i) { return sideColumnWidth + headerColumnWidth + hourColumnWidth * d + majorStrokeWidth; })
                    .attr('y2', height - rowHeight);

            // 外边框
            svg.append('rect')
                .attr('class', 'chart')
                .attr('x', majorStrokeWidth)
                .attr('y', majorStrokeWidth)
                .attr('width', width - majorStrokeWidth * 2)
                .attr('height', height - majorStrokeWidth * 2);

            // major text
            var majorTextWrapper = svg.append('g').attr('class', 'major-text');
            var minorTextWrapper = svg.append('g').attr('class', 'minor-text');

            // 第1列大字
            majorTextWrapper.append('text').text('到达方向').attr('x', 16).attr('y', rowHeight + 32);
            majorTextWrapper.append('text').text('向塘客场').attr('x', 16).attr('y', rowHeight + arrivalSectionHeight + tracksSectionHeight * 0.33);
            majorTextWrapper.append('text').text('出发方向').attr('x', 16).attr('y', rowHeight + arrivalSectionHeight + tracksSectionHeight + 32);

            // 第2列小字
            var minorTexts = _.map($scope.arrivals, function (item) { return item.name; }).sort()
                .concat(_.map($scope.tracks, function (item) { return item.name; }).reverse())
                .concat(_.map($scope.departures, function (item) { return item.name; }).sort());

            minorTextWrapper.selectAll('text')
                .data(minorTexts)
                .enter()
                    .append('text')
                    .text(function (d) { return d; })
                    .attr('x', sideColumnWidth + 16)
                    .attr('y', function (d, i) { return rowHeight * ( i + 1) + 21; });

            // 横向的两个时间轴
            svg.append('g').attr('class', 'minor-text minor-text-hour')
                .selectAll('text')
                .data(d3.range(0, 24))
                .enter()
                    .append('text')
                    .text(function (d) { return d > 10 ? d : '0' + d; })
                    .attr('x', function (d, i) { return sideColumnWidth + headerColumnWidth + d * hourColumnWidth - 6; })
                    .attr('y', rowHeight * 0.8);

            svg.append('g').attr('class', 'minor-text minor-text-hour')
                .selectAll('text')
                .data(d3.range(0, 24))
                .enter()
                    .append('text')
                    .text(function (d) { return d > 10 ? d : '0' + d; })
                    .attr('x', function (d, i) { return sideColumnWidth + headerColumnWidth + d * hourColumnWidth - 6; })
                    .attr('y', height - rowHeight * 0.5);

            // 列车行进图
        };

    }
]);
