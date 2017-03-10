(function(win) {

    win.Perfy = win.Perfy ||  {};
    win.Perfy.run = function(files) {
        if (Array.isArray(files)) {
            if (files.length === 0) {
                console.warn('No files found. Abort');
            } else {
                win.Perfy.load(files).then(win.Perfy.draw);
            }
        }
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

        createStats = (files) => {
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
                    `;
                }
                html += '</ul>';
                card(`stats-${itemName}`, `${itemName}`, html);
            });
            return item;
        };

        statsContainer(createStats(files));
        groupsContainer(createSelection(files));
    };
    win.Perfy.draw = function draw(metrics) {

        const groups = {};
        let drawGroup = false;
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
            metrics.map((sample, i) => {
                const g = sample.file.replace('.json', '').split('/').pop().split(' ');
                const gName = g[0];
                const gSubName = g[1];

                // groups is global inside win.Perfy.draw()
                groups[gName] = groups[gName] || {};
                groups[gName][gSubName] = sample;
            });

            // const sample = metrics[0];
            // const g = sample.file.replace('.json', '').split('/').pop().split(' ');
            // const gName = g[0];
            // const gSubName = g[1]; 
            // group[ gName ] = group[ gName ] || {};
            // group[ gName ][ gSubName ] = sample;
        }

        function _draw(metricNames) {

            if (drawGroup) {
                win.Perfy.prepare(groups);
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

            const buildSwitch = (gName) => {
                // <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-${gName}">
                //     <input type="checkbox" id="switch-${gName}" class="mdl-switch__input">
                //     <span class="mdl-switch__label"></span>
                // </label>
                const label = document.createElement('label');
                label.className = 'mdl-switch mdl-js-switch mdl-js-ripple-effect';
                label.setAttribute('for', `switch-${gName}`);

                const input = document.createElement('input');
                input.className = 'mdl-switch__input';
                input.setAttribute('id', `switch-${gName}`);
                input.setAttribute('type', `checkbox`);
                window.componentHandler.upgradeElement(input);
                label.appendChild(input);

                const span = document.createElement('span');
                span.className = 'mdl-switch__label';
                window.componentHandler.upgradeElement(span);
                label.appendChild(span);

                return label;
            }

            const chartContainer = (gName, metricNames) => {
                const dom = document.createElement('div');
                dom.className = 'mdl-card mdl-shadow--4dp wide';
                dom.id = `group-${gName}`;
                let chartContainers = metricNames
                    .map(metricName => `<div class="mdl-card__supporting-text" id="chart-${gName}-${metricName}"></div>`)
                    .join('');

                dom.innerHTML = `
                    <div class="mdl-card__title mdl-card--expand mdl-color--primary mdl-color-text--primary-contrast">
                        <h4>${gName}</h4>
                        <div class="mdl-layout-spacer"></div>
                        ${ buildSwitch(gName).outerHTML }
                    </div>
                    <div id="container-${gName}" style="display:none">
                        ${chartContainers}
                    </div>
                `;
                win.componentHandler.upgradeElement(dom);
                canvas.appendChild(dom);
            }

            const _drawChartPerGroup = (gName) => {
                const subGroup = groups[gName];
                const groupSwitchButton = document.querySelector(`#switch-${gName}`);
                Object.keys(subGroup).map(groupName => {
                    metricNames.map(metricName => {
                        const data = [];
                        const samples = subGroup[groupName];
                        data.push({
                            x: samples.validSample.map(sample => sample.runIndex),
                            y: samples.validSample.map(sample => sample.values[metricName]),
                            name: groupName,
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
                        layout.title = `${gName} — ${metricName}`;
                        layout.yaxis.title = metricName;

                        if (groupSwitchButton.checked) {
                            Plotly.plot(document.querySelector(`#chart-${gName}-${metricName}`), data, layout, {
                                showLink: false
                            });
                        }

                    });


                });
            }

            Object.keys(groups).map((gName) => {
                chartContainer(gName, metricNames);
            });

            document.querySelector('#canvas').addEventListener('click', (e) => {
                const target = e.target;
                const isCheckbox = target.nodeName === 'INPUT';

                if (isCheckbox) {
                    const gName = target.id.replace('switch-', '');
                    const container = document.querySelector(`#container-${gName}`);
                    if (target.checked) {
                        container.style.display = 'block';
                        setTimeout(() => {
                            if (!container.__hydrated) {
                                _drawChartPerGroup(gName);
                                container.__hydrated = true;
                            }
                        }, 600);
                    } else {
                        container.style.display = 'none';
                    }
                }


            });


            Object.keys(groups).map((gName) => {
                _drawChartPerGroup(gName);
            });

        }

        // start drawing
        function _run() {
            _mergeGroups();
            _draw(metricNames);
        }
        _run();

    };
}(window));