var fs = require('fs-extra');
var path = require('path');
var merge = require('./merge-reporters');

const p = pp => path.join(__dirname, pp);

module.exports = (options) => {

    const perfyConfig = options.perfyConfig;

    // copy assets to the host project
    fs.copySync(p('./public/assets/'), path.resolve(perfyConfig.reportsFolder, 'assets'));
    if (path.isAbsolute(perfyConfig.reportsFiles) === false) {
        perfyConfig.reportsFiles = path.resolve(process.cwd(), perfyConfig.reportsFiles);
    }

    merge(perfyConfig)

    // write files
    .then(mergedContents => {

        // write file and create its parent folder if it doesn't exist
        mergedContents.map(content => fs.outputFileSync(content.file, JSON.stringify(content, null, 2)));
        return mergedContents;
    })

    // update index.html
    .then(mergedContents => {
        const indexContent = fs.readFileSync(p('./index.template.html'), 'utf-8').toString();
        const buildRelativePathForHtml = (file) => {
            return `.${file.replace(path.resolve(perfyConfig.reportsFolder), '')}`;
        };
        const filesList = JSON.stringify(mergedContents.map(c => buildRelativePathForHtml(c.file)), null, 2);

        const outputFileName = path.resolve(process.cwd(), perfyConfig.reportsFolder, 'index.html'); //`../public/index.html`;
        const outputContent = indexContent.replace(/Perfy\.run\(\[[\n\r\s"\w\/.,-]*\]\)/, `Perfy.run(${filesList})`);

        fs.outputFileSync(outputFileName, outputContent);
        console.log('>> Perfy: copied index.html to %s', outputFileName);
        return filesList;
    })

    // done
    .then(filesList => {
            if (filesList === '[]') {
                console.log('>> Perfy: No samples found in %s', perfyConfig.reportsFiles);
            } else {
                console.log('>> Perfy: %d sample(s) built \n%s', filesList.split(',').length, filesList);
            }
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });

}