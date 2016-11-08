(function(win){
    win.Perfy = win.Perfy || {};
    win.Perfy.run = function(files) {
        win.Perfy.load(files).then(win.Perfy.draw);
    };
    win.Perfy.load = function load(files) {
        return Promise.all(
            files.map(f => {
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    const handle = () => resolve(JSON.parse(xhr.response));
                    xhr.addEventListener('load', handle);
                    xhr.open('GET', f);
                    xhr.send();
                });
            })
        );
    };
    win.Perfy.draw = function metrics(metrics) {

        let dataCount = 0;
        const metricNames = Object.keys(metrics[0].validSample[0].values)
        const canvas = document.getElementById('canvas');
        const colors = [
            'E91E63',
            '3F51B5',
            '2196F3',
            '009688',
            'FF5722',
            'FF9800'
        ];

        // draw
        metricNames.map((metricName) => {
            _draw(metricName);
        });

        let timer = null;
        document.querySelector('#switch-realtime').addEventListener('click', function(event){
            let target = event.target;
            if (target.id === 'switch-realtime') {
                if ( target.checked ) {
                    timer = setInterval(update, 600);
                }
                else {
                    clearInterval(timer);
                }
            }
        });

        function _draw(metricName) {
            const data = [];
            metrics.map((f, i) => {
                data.push({
                    x: f.validSample.map(sample => sample.runIndex),
                    y: f.validSample.map(sample => sample.values[metricName]),
                    name: f.description.id,
                    marker: {
                        color: colors[i] ? colors[i] : 'black'
                    },
                    line: {
                        width: 2,
                        shape: 'line'
                    },
                    type: 'scatter',
                    barmode: 'group'
                });
                dataCount++;
            });
            const layout = {
                title: metrics[0].description.metrics[metricName],
                xaxis: {
                    title: 'Run Index',
                    showticklabels: true,
                    tickfont: {
                        size: 14,
                        color: 'rgb(107, 107, 107)'
                    },
                    rangemode: 'nonnegative',
                    fixedrange: true
                },
                yaxis: {
                    title: metricName,
                    titlefont: {
                        size: 16,
                        color: 'rgb(107, 107, 107)'
                    },
                    tickfont: {
                        size: 14,
                        color: 'rgb(107, 107, 107)'
                    },
                    rangemode: 'nonnegative'
                },
                legend: {
                    x: 0,
                    y: 1.0,
                    bgcolor: 'rgba(255, 255, 255, 0)',
                    bordercolor: 'rgba(255, 255, 255, 0)'
                },
                mode: 'markers',
                marker: {
                    size: 7,
                    line: {
                        width: 0.5
                    },
                    opacity: 0.8
                }
            };
            const dom = document.createElement('div');
            dom.setAttribute('class', 'mdl-card mdl-shadow--4dp');
            dom.innerHTML = `<div class="mdl-card__supporting-text" id="${metricName}"></div>`;
            canvas.appendChild(dom);
            Plotly.plot(document.getElementById(metricName), data, layout, {
                showLink: false
            });
        }


        let x = 0;
        function update() {
            metricNames
            .map( metricName => document.getElementById(metricName))
            .map( graphDiv => {
                let rangeEnd = graphDiv.data[0].x.length;
                let rangeStart = 0;
                graphDiv.data
                .map(d => {
                    let newIndex = d.x[d.x.length - 1] + 1;

                    d.x = d.x.slice(1);
                    d.y = d.y.slice(1);

                    d.x.push(newIndex);
                    d.y.push(Math.random() * 150);

                    //rangeStart = 10;
                    //rangeEnd = newIndex;
                });
                //rangeStart++;
                //graphDiv.layout.xaxis.range = [rangeEnd-rangeStart, rangeEnd];
                //console.log(graphDiv.id, graphDiv.layout.xaxis.range);
                Plotly.redraw(graphDiv);
            });


        }
    };
}(window));