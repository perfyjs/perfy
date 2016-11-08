exports.config = {
  allScriptsTimeout: 11000,

  directConnect: true,

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      //Important for benchpress to get timeline data from the browser
      'args': [ /*'--trace-startup',*/ '--js-flags=--expose-gc', '--enable-gpu-benchmarking', '--enable-thread-composting'],
      'perfLoggingPrefs': {
        'traceCategories': 'v8,blink.console,devtools.timeline',
        //'traceCategories': 'v8,blink.console,disabled-by-default-devtools.timeline',
        //"traceCategories": 'v8,toplevel,disabled-by-default-devtools.timeline.frame,blink.console,disabled-by-default-devtools.timeline,benchmark'
      }
    },
    loggingPrefs: {
        'browser':     'ALL',
        'driver':      'ALL',
        'performance': 'ALL'
    },
  },

  specs: [
    'specs/index.spec.js'
  ],
  framework: 'jasmine2',

  // restart browser between tests
  // so that the browser does not keep
  // optimizations
  restartBrowserBetweenTests: true,

  jasmineNodeOpts: {
    showColors: true,
    isVerbose: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  },

  beforeLaunch: () => {
      console.log('[Protractor] beforeLaunch');
  },

  onPrepare: () => {
      console.log('[Protractor] onPrepare');

      beforeEach(function () {
        browser.ignoreSynchronization = false;
      });
      
  },

  onComplete: () => {
      console.log('[Protractor] onComplete');
      try {
        // require('./lib/write-files')({
        //   pattern: 'public/reports/*_*.json' 
        // });
      }
      catch(e) {
        console.error(e);
      }
  },

  onCleanUp: () => {
      console.log('[Protractor] onCleanUp');
  },

  afterLaunch: () => {
      console.log('[Protractor] afterLaunch');
  }
};