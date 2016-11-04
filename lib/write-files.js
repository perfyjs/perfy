var fs = require('fs');
var path = require('path');
var merge = require('./merge-reporters');

const p = pp => path.join(__dirname, pp);

module.exports = (pattern) => {

    merge(pattern)
    .then( mergedContents => {
        mergedContents.map( content => fs.writeFileSync(content.file, JSON.stringify(content, null, 2)));
        return mergedContents;
    })
    .then( mergedContents => {
        const indexContent = fs.readFileSync(p('./index.template.html'), 'utf-8').toString();
        const filesList = JSON.stringify(mergedContents.map(c => c.file.replace('public/', '')), null, 2);
        fs.writeFileSync(p('../public/index.html'), indexContent.replace('###FILES###', filesList));
        return filesList;
    })
    .then( filesList => console.log( filesList === '[]' ? 'no samples found' : 'merged %d samples \n%s', filesList.split(','), filesList) )
    .catch( error => {
        console.error(error);
        process.exit(1);
    });

}