'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Trains', 'Arrivals', 'Departures', 'Tracks',
    function($scope, Authentication, Trains, Arrivals, Departures, Tracks) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.today = new Date();

        $scope.trains = Trains.query();
        $scope.tracks = Tracks.query();
        $scope.arrivals = Arrivals.query();
        $scope.departures = Departures.query();

        $scope.$watch('trains.length + tracks.length + arrivals.length + departures.length', function () {
            if ($scope.trains.length && $scope.tracks.length && $scope.arrivals.length && $scope.departures.length) {
                $scope.canDraw = true;
                $scope.draw();
            } else {
                $scope.canDraw = false;
            }
        });

        $scope.draw = function () {
            // 基础分割线
            var majorStrokeWidth = 2;
            var minorStrokeWidth = 1;

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
            var sideColumnWidth = 50;
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
                    .style('fill', 'none')
                    .style('stroke', '#CCCCCC')
                    .style('stroke-width', minorStrokeWidth)
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
                    .style('fill', 'none')
                    .style('stroke', '#CCCCCC')
                    .style('stroke-width', minorStrokeWidth)
                    .attr('x1', function (d, i) { return majorStrokeWidth + sideColumnWidth + headerColumnWidth + minuteColumnWidth * d; } )
                    .attr('y1', rowHeight)
                    .attr('x2', function (d, i) { return majorStrokeWidth + sideColumnWidth + headerColumnWidth + minuteColumnWidth * d; } )
                    .attr('y2', height - rowHeight);

            // 横向的4条粗线，时间轴
            svg.append('g')
                .attr('class', 'xaxis-major-grids')
                .selectAll('line')
                .data([0, arrivalSectionHeight, arrivalSectionHeight + tracksSectionHeight, arrivalSectionHeight + tracksSectionHeight + departureSectionHeight])
                .enter()
                    .append('line')
                    .attr('class', 'major-grid-line')
                    .style('fill', 'none')
                    .style('stroke', 'green')
                    .style('stroke-width', majorStrokeWidth)
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
                    .style('fill', 'none')
                    .style('stroke', 'green')
                    .style('stroke-width', majorStrokeWidth)
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
                    .style('fill', 'none')
                    .style('stroke', 'green')
                    .style('stroke-width', majorStrokeWidth)
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
                .style('fill', 'none')
                .style('stroke', 'green')
                .style('stroke-width', majorStrokeWidth)
                .attr('width', width - majorStrokeWidth * 2)
                .attr('height', height - majorStrokeWidth * 2);

            // major text
            var majorTextWrapper = svg.append('g').attr('class', 'major-text');
            var minorTextWrapper = svg.append('g').attr('class', 'minor-text');

            // 每行对应的位置：包括出发、到达、股道
            var locations = { };

            // 第1列大字
            majorTextWrapper.append('text').text('到达方向').style('writing-mode', 'tb').attr('x', sideColumnWidth / 2).attr('y', rowHeight * 2);
            majorTextWrapper.append('text').text('向塘客场').style('writing-mode', 'tb').attr('x', sideColumnWidth / 2).attr('y', rowHeight * 2 + arrivalSectionHeight + tracksSectionHeight * 0.33);
            majorTextWrapper.append('text').text('出发方向').style('writing-mode', 'tb').attr('x', sideColumnWidth / 2).attr('y', rowHeight * 2 + arrivalSectionHeight + tracksSectionHeight);

            // 第2列小字
            var minorTexts = _.map($scope.arrivals, function (item) { return item.name; }).sort()
                .concat(_.map($scope.tracks, function (item) { return item.name; }).sort(function (a, b) { return Number(a) - Number(b); }))
                .concat(_.map($scope.departures, function (item) { return item.name; }).sort());

            minorTextWrapper.selectAll('text')
                .data(minorTexts)
                .enter()
                    .append('text')
                    .text(function (d) { return d; })
                    .attr('x', sideColumnWidth + rowHeight / 2)
                    .attr('y', function (d, i) {
                        locations[d] = rowHeight * ( i + 1.6);
                        return rowHeight * ( i + 1.6);
                    });

            // 横向的两个时间轴
            svg.append('g').attr('class', 'minor-text minor-text-hour')
                .selectAll('text')
                .data(d3.range(18, 24).concat(d3.range(0, 18)))
                .enter()
                    .append('text')
                    .text(function (d) { return d > 10 ? d : '0' + d; })
                    .attr('x', function (d, i) { return sideColumnWidth + headerColumnWidth + i * hourColumnWidth - 6; })
                    .attr('y', rowHeight * 0.8);

            svg.append('g').attr('class', 'minor-text minor-text-hour')
                .selectAll('text')
                .data(d3.range(18, 24).concat(d3.range(0, 18)))
                .enter()
                    .append('text')
                    .text(function (d) { return d > 10 ? d : '0' + d; })
                    .attr('x', function (d, i) { return sideColumnWidth + headerColumnWidth + i * hourColumnWidth - 6; })
                    .attr('y', height - rowHeight * 0.5);

            // 列车行进图
            var pathWrapper = svg.append('g').attr('class', 'paths');
            var textWrapper = svg.append('g').attr('class', 'train-text');
            var circleWrapper = svg.append('g').attr('class', 'train-circle');
            var circles = [];
            var generator = d3.svg.line()
                .x(function (d){ return d.x; })
                .y(function (d){ return d.y; })
                .interpolate("linear");

            // 创建
            _.forEach($scope.trains, function (train) {
                var points = [];
                points.push({ x: getXPositionFromTime(train.arrivalTime || train.departureTime), y: locations[train.arrival.name] });
                points.push({ x: getXPositionFromTime(train.arrivalTime || train.departureTime), y: locations[train.track.name] });
                points.push({ x: getXPositionFromTime(train.departureTime), y: locations[train.track.name] });
                points.push({ x: getXPositionFromTime(train.departureTime), y: locations[train.departure.name] });

                var magicNumber = 5;
                var start = points[0];
                var end = points[points.length - 1];
                var length = (train.name.indexOf('/') > 0 ? train.name.split('/').shift().length : train.name.length) * Math.sqrt(magicNumber * magicNumber * 2);

                // 已知起点，和斜率，找左边的1各点
                points.unshift({
                    x: start.x - Math.sqrt(Math.pow(length, 2) / 2),
                    y: start.y - Math.sqrt(Math.pow(length, 2) / 2)
                });
                points.push({
                    x: end.x + Math.sqrt(Math.pow(length, 2) / 2),
                    y: end.y + Math.sqrt(Math.pow(length, 2) / 2)
                });

                // path
                pathWrapper.append('path')
                    .attr('class', 'train-path')
                    .attr('d', generator(points))
                    .style('stroke-width', 1)
                    .style('stroke', isPassengerTrain(train.name) ? 'red' : 'black')
                    .style('fill', 'none');

                // top label
                textWrapper.append('text')
                    .attr('class', 'train-name')
                    .text(train.name)
                    .attr('x', (points[0].x + points[1].x) / 2 - magicNumber)
                    .attr('y', (points[0].y + points[1].y) / 2 - magicNumber)
                    .attr('transform', 'rotate(45,' + (points[0].x + points[1].x) / 2 + ',' + (points[0].y + points[1].y) / 2 + ')');

                // bottom label
                textWrapper.append('text')
                    .attr('class', 'train-name')
                    .text(train.name)
                    .attr('x', (points[points.length - 1].x + points[points.length - 2].x) / 2 - magicNumber)
                    .attr('y', (points[points.length - 1].y + points[points.length - 2].y) / 2 - magicNumber)
                    .attr('transform', 'rotate(45,' + (points[points.length - 1].x + points[points.length - 2].x) / 2 + ',' + (points[points.length - 1].y + points[points.length - 2].y) / 2 + ')');

                circles.push({ x: points[2].x, y: points[2].y, stroke: isPassengerTrain(train.name) ? 'red' : 'black' });
                circles.push({ x: points[3].x, y: points[3].y, stroke: isPassengerTrain(train.name) ? 'red' : 'black' });
            });

            // intersect circles
            circleWrapper.selectAll('circle')
                .data(circles)
                .enter()
                    .append('circle')
                    .attr('cx', function (d, i) { return d.x; })
                    .attr('cy', function (d, i) { return d.y; })
                    .attr('r', 2)
                    .style('stroke-width', 1)
                    .style('stroke', function (d, i) { return d.stroke; })
                    .style('fill', function (d, i) { return d.stroke; });

            // 四个阿拉伯数字以内（包括1个阿拉伯数字 两个阿拉伯数字 三个阿拉伯数字和四个阿拉伯数字
            // 比如K1236 含有1 2 3 6 四个阿拉伯数字  Z11含有1 1 两个阿拉伯数字）
            // 如果首字母不是X则一定是客车，其他的是货车；
            function isPassengerTrain(name) {
                if (name.length > 5) {
                    return false;
                }

                var firstChar = name[0].toLowerCase();
                var parts = name.slice(1);
                if (isNaN(Number(firstChar))) {
                    if (parts.length > 4) {     // 超过4个的
                        return false;
                    }
                    if (firstChar === 'x') {    // X开头的
                        return false;
                    }
                } else {
                }

                return true;
            }

            function getXPositionFromTime(time) {
                var date = moment(new Date(time)).tz('Asia/Shanghai');
                var minutes = date.hours() * 60 + date.minutes();
                var minuteWidth = hourColumnWidth / 60 * minutes;

                return sideColumnWidth + headerColumnWidth + minuteWidth;
            }

        };

        $scope.download = function (format) {
            // Get the d3js SVG element
            var svg = document.getElementById('chart');
            // Extract the data as SVG text string
            var xml = (new XMLSerializer).serializeToString(svg);
            console.log(xml);

            // Submit the <FORM> to the server.
            // The result will be an attachment file to download.
            var form = document.getElementById('svgform');
            form['format'].value = format;
            form['data'].value = xml;
            form.submit();
        };

    }
]);
