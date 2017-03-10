(function(win) {

    win.Perfy = win.Perfy ||  {};
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
    win.Perfy.prepare = function(files) {
        const statsContainer = (group) => {
            const dom = document.createElement('div');
            dom.setAttribute('class', 'mdl-card mdl-shadow--4dp');
            dom.innerHTML = `<div class="mdl-card__supporting-text" id="stats">${group.innerHTML}</div>`;
            win.componentHandler.upgradeElement(dom);
            canvas.appendChild(dom);
        };
        const card = (id, title, content) => {
            const dom = document.createElement('div');
            dom.setAttribute('class', 'mdl-card mdl-shadow--4dp');
            dom.innerHTML = `<div class="mdl-card__supporting-text" id="card-${id}">
                <div class="mdl-card__title mdl-card--expand">
                    <h2 class="mdl-card__title-text">${title}</h2>
                </div>
                ${content}
            </div>`;
            win.componentHandler.upgradeElement(dom);
            canvas.appendChild(dom);
        };
        const groupsContainer = (group) => {
            const dom = document.createElement('div');
            dom.setAttribute('class', 'mdl-card mdl-shadow--4dp wide');
            dom.innerHTML = `<div class="mdl-card__supporting-text" id="groups">${group.innerHTML}</div>`;
            win.componentHandler.upgradeElement(dom);
            canvas.appendChild(dom);
        };
        const createSelection = (files) => {
            let item = document.createElement('div');
            Object.keys(files).map((itemName, index) => {
                const button = document.createElement('a');
                button.setAttribute('href', `#group-${itemName}`);
                button.className = 'mdl-button mdl-js-button  mdl-button--accent';
                button.innerText = itemName;
                componentHandler.upgradeElement(button);
                item.appendChild(button);
            });
            return item;
        };

        createStats = () => {
            console.log(files);
            let item = document.createElement('div');
            Object.keys(files).map((itemName, index) => {
                let html = '<ul class="mdl-list">';
                const data = files[itemName].RxNext.stats;
                for (k in data) {
                    html += `
                            <li>
                                <span class="mdl-list__item-sub-title">
                                    <i>${k}:</i> 
                                        <b>${data[k]}</b>
                                        |
                                        <b>${files[itemName].Rx2.stats[k]}</b>
                                </span>
                            </li>
                    `
                }
                html += '</ul>';
                card(`stats-${itemName}`, `${itemName}`, html);
            });
            return item;
        };

        statsContainer(createStats(files));
        groupsContainer(createSelection(files));
    };
    win.Perfy.draw = function metrics(metrics) {

        let drawGroup = true;
        let colorIndex = 0;
        const metricNames = Object.keys(metrics[0].validSample[0].values);
        const metricDescription = metrics[0].description.metrics;
        const canvas = document.getElementById('canvas');
        const colors = [
            "#F44336",
            "#E91E63",
            "#9C27B0",
            "#673AB7",
            "#3F51B5",
            "#2196F3",
            "#03A9F4",
            "#00BCD4",
            "#009688",
            "#4CAF50",
            "#8BC34A",
            "#CDDC39",
            "#FFEB3B",
            "#FFC107",
            "#FF9800",
            "#FF5722",
            "#795548",
            "#9E9E9E",
            "#607D8B",
            "#000000"
        ];

        // group items by Names
        function _mergeGroups() {
            const group = {};
            metrics.map((sample, i) => {
                const g = sample.file.replace('.json', '').split('/').pop().split(' ');
                const gName = g[0];
                const gSubName = g[1];
                group[gName] = group[gName] || {};
                group[gName][gSubName] = sample;
            });

            // const sample = metrics[0];
            // const g = sample.file.replace('.json', '').split('/').pop().split(' ');
            // const gName = g[0];
            // const gSubName = g[1]; 
            // group[ gName ] = group[ gName ] || {};
            // group[ gName ][ gSubName ] = sample;

            return group;
        }

        function _draw(groupCollection, metricNames) {

            if (drawGroup) {
                win.Perfy.prepare(groupCollection);
                drawGroup = false;
            }

            const layout = {
                title: 'N/A',
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
                    title: 'N/A',
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

            const chartContainer = (gName, metricNames) => {
                const dom = document.createElement('div');
                dom.className = 'mdl-card mdl-shadow--4dp wide';
                dom.id = `group-${gName}`;
                let chartContainers = metricNames
                    .map(metricName => `<div class="mdl-card__supporting-text" id="chart-${gName}-${metricName}"></div>`)
                    .join('');

                dom.innerHTML = `
                    <div class="mdl-card__title mdl-card--expand">
                        <h4>
                            ${gName}
                        </h4>
                    </div>
                    ${chartContainers}
                `;
                win.componentHandler.upgradeElement(dom);
                canvas.appendChild(dom);
            }

            Object.keys(groupCollection).map((gName) => {
                chartContainer(gName, metricNames);
            });


            Object.keys(groupCollection).map((gName) => {
                const groups = groupCollection[gName];
                Object.keys(groups).map(groupeName => {
                    metricNames.map(metricName => {
                        const data = [];
                        const samples = groups[groupeName];
                        data.push({
                            x: samples.validSample.map(sample => sample.runIndex),
                            y: samples.validSample.map(sample => sample.values[metricName]),
                            name: groupeName,
                            marker: {
                                color: colors[colorIndex % colors.length]
                            },
                            line: {
                                width: 2,
                                shape: 'line'
                            },
                            type: 'scatter',
                            barmode: 'group'
                        });
                        colorIndex += 3;
                        layout.title = metricName;
                        layout.yaxis.title = metricName;

                        Plotly.plot(document.getElementById(`chart-${gName}-${metricName}`), data, layout, {
                            showLink: false
                        });
                    });


                });

            });

        }

        // start drawing
        function _run() {
            const group = _mergeGroups();
            _draw(group, metricNames);
        }
        _run();


    };
}(window));