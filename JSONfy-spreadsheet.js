'use strict'

var JSONfySpreadsheet = () => {

    var
        fs = require('fs')
        , srcFileName = process.argv[2]
        , distFileName = process.argv[3]
        ;

    if (srcFileName == 'undefined' || srcFileName == undefined) throw 'Plan spreadsheet file path not detected.'

    //Used for plan json file creation
    //    if (distFileName == 'undefined' || distFileName == undefined) throw 'Distribution file name not detected.'

    var
        spreadsheet = fs
            .readFileSync(srcFileName)
            .toString()
            .split('\r\n')
        ;

    var header = spreadsheet.shift().split('\t');

    return spreadsheet = spreadsheet.map((e, i, a) => {
        var obj = {}

        e.split('\t').forEach((e, i, a) => { obj[header[i]] = e; })

        return obj;
    });

    /*
    Used for plan json file creation
    
    spreadsheet = JSON.stringify(spreadsheet);
    
    fs.writeFile('./' + distFileName + ".json", spreadsheet, 'utf-8', (err, data) => {
        if (err) throw err;
        console.log('\nFile written');
    })
    
    */
};

module.exports = { JSONfySpreadsheet: JSONfySpreadsheet };