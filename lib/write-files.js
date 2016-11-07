'use strict';

const fs = require('fs');
const path = require('path');

const mkdirpSync = require('mkdirp').sync;
const cpFileSync = require('cp-file').sync;

const merge = require('./merge-reporters');

const p = pp => path.join(__dirname, pp);
const LIB_FILES = [
    'node_modules/plotly.js/dist/plotly.min.js'
];

module.exports = options => {
    const {publicDir, pattern} = options;
    const reportFiles = path.join(publicDir, 'reports', pattern);
    merge(reportFiles)
    .then( mergedContents => {
        mergedContents.map( content => fs.writeFileSync(content.file, JSON.stringify(content, null, 2)));
        return mergedContents;
    })
    .then( mergedContents => {
        const indexContent = fs.readFileSync(p('./index.template.html'), 'utf-8').toString();
        const filesList = JSON.stringify(mergedContents.map(c => c.file.replace(`${publicDir}/`, '')), null, 2);

        mkdirpSync(publicDir);
        fs.writeFileSync(path.join(publicDir, 'index.html'), indexContent.replace('/*###FILES###*/', filesList));

        copyLib(path.join(publicDir, 'lib'));

        return filesList;
    })
    .then( filesList => {
        const filesCount = Number.isNaN(filesList.split(',')) ?
            filesList === '[]' ? 0 : 1 :
            filesList.split(',').length;

        console.log(filesCount === 0 ?
            'no samples found' :
            'merged %d sample%s \n%s', filesCount, filesCount > 1 ? 's' : '', filesList);
    })
    .catch( error => {
        console.error(error);
        process.exit(1);
    });
};

function copyLib(libDir) {
    if (fs.existsSync(libDir)) {
        return;
    }

    mkdirpSync(libDir);

    LIB_FILES.forEach(copyFile.bind(null, libDir));
}

function copyFile(rootDir, source) {
    const fileName = path.basename(source);
    const dest = path.join(rootDir, fileName);

    if (fs.existsSync(dest)) {
        return;
    }

    cpFileSync(source, dest);
}
