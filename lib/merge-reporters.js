'use strict';

const path = require('path');
const glob = require('glob');

module.exports = (pattern) => {
    return new Promise( (resolve, reject) => {
        glob(pattern, (error, files) => {
			if (error) {
				return reject(error);
			}

            const filesContent = files.map(file => {
                return {file, content: require(file)};
            });

            const uniqueFilesNames = Array.from(new Set(files.map( file => file.replace(/_\d+\.json/, '.json') )));

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

                return {
                    file,
                    description: mappedContent[0].description,
                    stats: mappedContent[0].stats,
                    completeSample,
                    validSample
                };
            };
            resolve(uniqueFilesNames.map( merge ));
        });
    });
};
