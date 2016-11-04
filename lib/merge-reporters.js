var path = require('path');
var glob = require('glob');
module.exports = (options) => {
    return new Promise( (resolve, reject) => {
        glob(options.pattern, (error, files) => {

            let filesContent = files.map( file => { return { file, content: require( path.resolve(__dirname, '..', file)) } });
            let uniqueFilesNames = Array.from(new Set(files.map( file => file.replace(/_\d+\.json/, '.json') )));
            const merge = (file, index) => {
                const completeSample = [];
                const validSample = [];
                let completeSampleCounts = 0;
                let validSampleCounts = 0;
                let filterByFileName = filesContent.filter( o => file.indexOf(o.content.description.id) !== -1);
                let mappedContent = filterByFileName.map( o => o.content );

                mappedContent.forEach( c => {
                    c.completeSample.map( s => {
                        s.runIndex = completeSampleCounts++;
                        completeSample.push(s);
                    });
                    c.validSample.map( s => {
                        s.runIndex = validSampleCounts++;
                        validSample.push(s);
                    });
                });

                const fileName =  file.split( path.sep ).pop();
                const today = new Date();
                const folderName = `${ today.getFullYear() }-${ today.getUTCMonth() }-${ today.getUTCDay() }`;
                const filePath = path.resolve( path.dirname(file), `${ fileName.replace('.json', '') }_${ folderName }`, fileName );
                
                return {
                    file: filePath,
                    description: mappedContent[0].description,
                    stats: mappedContent[0].stats,
                    completeSample,
                    validSample
                };
            };
            resolve(uniqueFilesNames.map( merge ));
        });
    });
}