'use strict'

var JSONfySpreadsheet = (planFileName) => {

    var
        fs = require('fs')
        ;

    var
        spreadsheet = fs
            .readFileSync(planFileName)
            .toString()
            .split('\r\n')
        ;

    var header = spreadsheet.shift().split('\t');

    return spreadsheet = spreadsheet.map((e, i, a) => {
        var obj = {}

        e.split('\t').forEach((e, i, a) => { obj[header[i]] = e; })

        return obj;
    });
};

module.exports = { JSONfySpreadsheet: JSONfySpreadsheet };