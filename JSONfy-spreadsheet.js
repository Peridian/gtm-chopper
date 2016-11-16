'use strict'

var
    fs = require('fs')
    , srcFileName = process.argv[2]
    , distFileName = process.argv[3]
    ;

if (srcFileName.length == 0) throw 'Source file name not detected.'

if (distFileName.length == 0) throw 'Distribution file name not detected.'

var spreadsheet = fs
    .readFileSync(srcFileName)
    .toString()
    .split('\r\n')
    ;

spreadsheet.shift();

spreadsheet = spreadsheet
    .map((e, i, a) => {
        var item = e.split('\t');

        return {
            type: item[0]
            , name: item[1]
            , description: item[2]
            , currentState: item[3]
            , BFRecomendation: item[4]
            , risk: item[5]
            , jussiDecision: item[6]
            , observation: item[7]
            , resposible: item[8]
        }
    })
    ;

spreadsheet = JSON.stringify(spreadsheet);

fs.writeFile('./' + distFileName, spreadsheet, 'utf-8', (err, data) => {
    if (err) throw err;
    console.log('File written');
})