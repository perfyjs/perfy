var fs = require('fs-extra');
var path = require('path');
var merge = require('./merge-reporters');

const p = pp => path.join(__dirname, pp);

module.exports = (options) => {

    merge(options)

    // write files
    .then( mergedContents => {

        // write file and create its parent folder if it doesn't exist
        mergedContents.map( content => fs.outputFileSync(content.file, JSON.stringify(content, null, 2)));
        return mergedContents;
    })

    // update index.html
    .then( mergedContents => {
        const indexContent = fs.readFileSync(p('./index.template.html'), 'utf-8').toString();
        const pathToremove = __dirname.replace('/lib', '');
        const buildRelativePathForHtml = (file) => file.replace(`${pathToremove}/public/`, '');
        const filesList = JSON.stringify(mergedContents.map(c => buildRelativePathForHtml(c.file) ), null, 2);
        fs.writeFileSync(p('../public/index.html'), indexContent.replace('###FILES###', filesList));
        return filesList;
    })

    // done
    .then( filesList => console.log( filesList === '[]' ? 'no samples found' : 'merged %d sample(s) \n%s', filesList.split(',').length, filesList) )
    .catch( error => {
        console.error(error);
        process.exit(1);
    });

}