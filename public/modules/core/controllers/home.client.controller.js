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
            var rowCount = $scope.arrivals.length + $scope.tracks.length + $scope.departures.length;
            var height = rowHeight * rowCount;

            var arrivalSectionHeight = $scope.arrivals.length * rowHeight;
            var tracksSectionHeight = $scope.tracks.length * rowHeight;
            var departureSectionHeight = $scope.departures.length * rowHeight;

            // 宽度设定
            var hourColumnWidth = 120;
            var hourColumnCount = 4;
            var minuteColumnWidth = 20;
            var sideColumnWidth = 60;
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
                    .attr('class', 'minor')
                    .attr('x1', sideColumnWidth)
                    .attr('y1', function (d, i) { return rowHeight * d; })
                    .attr('x2', width)
                    .attr('y2', function (d, i) { return rowHeight * d; })

            // 纵向的分钟细线
            svg.append('g')
                .attr('class', 'yaxis-minor-grids')
                .selectAll('line')
                .data(d3.range(1, hourColumnCount * (hourColumnWidth / minuteColumnWidth)))
                .enter()
                    .append('line')
                    .attr('class', 'minor')
                    .attr('x1', function (d, i) { return majorStrokeWidth + sideColumnWidth + headerColumnWidth + minuteColumnWidth * d; } )
                    .attr('y1', majorStrokeWidth)
                    .attr('x2', function (d, i) { return majorStrokeWidth + sideColumnWidth + headerColumnWidth + minuteColumnWidth * d; } )
                    .attr('y2', height - majorStrokeWidth)

            // 横向的两条粗线
            svg.append('g')
                .attr('class', 'xaxis-major-grids')
                .selectAll('line')
                .data([arrivalSectionHeight, arrivalSectionHeight + tracksSectionHeight])
                .enter()
                    .append('line')
                    .attr('class', 'major')
                    .attr('x1', majorStrokeWidth)
                    .attr('y1', function (d, i) { return d; })
                    .attr('x2', width - majorStrokeWidth)
                    .attr('y2', function (d, i) { return d; })

            // 纵向的前两条粗线
            svg.append('g')
                .attr('class', 'yaxis-major-grids')
                .selectAll('line')
                .data([sideColumnWidth, sideColumnWidth + headerColumnWidth])
                .enter()
                    .append('line')
                    .attr('class', 'major')
                    .attr('x1', function (d, i) { return d; })
                    .attr('y1', majorStrokeWidth)
                    .attr('x2', function (d, i) { return d; })
                    .attr('y2', height - majorStrokeWidth)

            // 纵向的小时粗线
            svg.append('g')
                .attr('class', 'yaxis-major-grids')
                .selectAll('line')
                .data(d3.range(1, 24))
                .enter()
                    .append('line')
                    .attr('class', 'major')
                    .attr('x1', function (d, i) { return sideColumnWidth + headerColumnWidth + hourColumnWidth * d + majorStrokeWidth; })
                    .attr('y1', majorStrokeWidth)
                    .attr('x2', function (d, i) { return sideColumnWidth + headerColumnWidth + hourColumnWidth * d + majorStrokeWidth; })
                    .attr('y2', height - majorStrokeWidth)

            // 外边框
            svg.append('rect')
                .attr('class', 'chart')
                .attr('x', majorStrokeWidth)
                .attr('y', majorStrokeWidth)
                .attr('width', width - majorStrokeWidth * 2)
                .attr('height', height - majorStrokeWidth * 2);

        };

    }
]);
