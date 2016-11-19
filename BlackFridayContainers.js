'use strict'

console.log()

var
    fs = require('fs')
    , tagPlan = require('./JSONfy-spreadsheet.js').JSONfySpreadsheet()
    , CLIParams = [
        '- srcPlan'
        , '- srcCont'
        , '- distCont'
    ]
    , pass = false
    ;

if (process.argv[2] == 'undefined' || process.argv[2] == undefined) throw 'Plan file name not provided.'
if (process.argv[3] == 'undefined' || process.argv[3] == undefined) throw 'Container file name not provided.'

var
    paths = {
        plan: process.argv[2]
        , src: process.argv[3]
    }
    ;

paths.dist = paths.src.split('/')[2].split('-')[0].trim()
paths.dist = './BF/' + paths.dist + '/' + paths.dist

var
    container = JSON.parse(fs.readFileSync(paths.src))
    , noMidiaContainer = container

var tags = container.containerVersion.tag

noMidiaContainer.containerVersion.tag =
    tags.filter((e, i, a) => {
        return e.name.toLowerCase().indexOf('media') > -1
    });

console.log('SEM MIDIA - Total de tags')
console.log(noMidiaContainer.containerVersion.tag.length)

fs.writeFile(
    paths.dist + " - SEM MIDIA - LOG.txt"
    , (() => {
        return noMidiaContainer.containerVersion.tag.map((e, i, a) => {
            return e.name
        }).join('\n');
    })()
    , 'utf-8'
    , (err, data) => {
        if (err) throw err;
        console.log('\nSEM MIDIA - Log criado');
    });

noMidiaContainer =
    JSON.stringify(
        noMidiaContainer
    )

fs.writeFile(
    paths.dist + " - SEM MIDIA.json"
    , noMidiaContainer
    , 'utf-8'
    , (err, data) => {
        if (err) throw err;
        console.log('\nSEM MIDIA - Container criado');
    });

tags = tags.filter((e, i, a) => {
    var planItem =
        tagPlan.filter((ee, ii, aa) => {
            var pass = e.name == ee.Tag && ee.FINAL == 'Ativar'

            return pass
        })

    return planItem.length == 1
});

container.containerVersion.tag = tags

fs.writeFile(
    paths.dist + " - VALIDADO - LOG.txt"
    , (() => {
        return tags.map((e, i, a) => {
            return e.name
        }).join('\n');
    })()
    , 'utf-8'
    , (err, data) => {
        if (err) throw err;
        console.log('\nVALIDADO - Log criado');
    });

container = JSON.stringify(container)

fs.writeFile(
    paths.dist + " - VALIDADO.json"
    , container
    , 'utf-8'
    , (err, data) => {
        if (err) throw err;
        console.log('\nVALIDADO - Container criado');
    });

console.log()

console.log('VALIDADO - Total de tags')
console.log(
    tags.filter((e, i, a) => {
        return e.FINAL != 'Ativar'
    }).length
)