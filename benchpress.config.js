exports.options = (benchpress, frameworkName) => [
    
    //use protractor as Webdriver client
    benchpress.SeleniumWebDriverAdapter.PROTRACTOR_PROVIDERS,
    
    //use RegressionSlopeValidator to validate samples
    { provide: benchpress.Validator, useExisting: benchpress.RegressionSlopeValidator },
    
    //use 10 samples to calculate slope regression
    { provide: benchpress.RegressionSlopeValidator.SAMPLE_SIZE, useValue: 10 },
    
    //use the 'timeToBootstrap' metric to calculate slope regression
    { provide: benchpress.RegressionSlopeValidator.METRIC, useValue: 'scriptTime' },
    { provide: benchpress.Options.FORCE_GC, useValue: true },

    // Add Reporters : Console + Json
    benchpress.JsonFileReporter.PROVIDERS,
    { provide: benchpress.JsonFileReporter.PATH, useValue: './public/reports' },
    benchpress.MultiReporter.provideWith([benchpress.ConsoleReporter, benchpress.JsonFileReporter]),
    
    // Override some default options
    { provide: benchpress.Options.RECEIVED_DATA, useValue: false },
    { provide: benchpress.Options.REQUEST_COUNT, useValue: false },
    { provide: benchpress.Options.CAPTURE_FRAMES, useValue: false }

];