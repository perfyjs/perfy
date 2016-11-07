(function longExecutionTimeFixture() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function launchLongExecution() {
        const route = new URL(location);
        const searchParams = route.searchParams;

        const duration = parseInt(searchParams.get('duration'), 10) || 1000;
        const interval = parseInt(searchParams.get('interval'), 10) || 1000;

        const waitFn = wait.bind(null, document.querySelector('#root'), duration);

        longExecutionTime(waitFn, interval);
    });

    //

    function longExecutionTime(execFn, interval) {
        const loopingFn = () => longExecutionTime(execFn, interval);
        execFn();
        setTimeout(loopingFn, interval);
    }

    function wait(rootEl, duration) {
        const start = performance.now();

        while ((performance.now() - start) <= duration) {
            // just wait...
        }

        rootEl.innerText += '.';
    }
})();
