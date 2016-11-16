'use strict'

console.log()

var
    pass = false
    , CLIParams = [
        '- srcPlan'
        , '- srcCont'
        , '- distCont'
    ]
    , fs = require('fs')
    ;

var
    planFileName = process.argv[2]
    , srcFileName = process.argv[3]
    , distFileName = process.argv[4]
    ;

var
    tagPlan = JSON.parse(fs.readFileSync(planFileName))
    , container = JSON.parse(fs.readFileSync(srcFileName))
    ;

tagPlan.forEach((e, i, a) => {
    console.log(
        [
            '(name, currentState, decision)'
            , e.name
            , e.currentState
            , e.jussiDecision
        ]
            .join(' | ')
    )
});

/* 

var writeContainerFiles = (containerName, container) => {
    containerName = containerName ? containerName : '(NOT SET)'

    var
        range = ''
        , fullContainerName = []
        , newFullContainer = []
        , range = []
        , fullContainerName = []
        , fullContainerNameSplit = []
        , newFullContainer = []
        , tagsArray = []
        , logList = []
        , logSplit = []
        , arrayOfBlocksOfTags = []
        ;

    allGTMs.forEach((e, i, a) => {
        fullContainerName = []

        range = ranges[i].tags[0] + '_' + ranges[i].tags[1]

        fullContainerName.push(i + 1)
        fullContainerName.push(containerName)
        fullContainerName.push(ranges[i].level)
        fullContainerName.push(range)
        fullContainerName = fullContainerName.join(' - ')
        fullContainerName += '.json'

        newFullContainer = JSON.parse(JSON.stringify(container))
        newFullContainer.containerVersion.tag = e

        console.log('\nSaving file:', fullContainerName)
        console.log(newFullContainer.containerVersion.tag.length, 'tags')
        console.log(newFullContainer.containerVersion.variable.length, 'variables')
        console.log(newFullContainer.containerVersion.trigger.length, 'triggers')

        arrayOfBlocksOfTags.push([
            fullContainerName,
            e.map((x) => { return x.name })
        ]);

        fs.writeFile('Processed containers\\' + fullContainerName
            , JSON.stringify(newFullContainer), (err) => {
                if (err) throw err;
                console.log('\nFile saved');
            });
    });

    if (logFormat)
        if (logFormat == 'list') writeLog('tag-name-log.txt', arrayOfBlocksOfTags, false)
        else if (logFormat == 'split') writeLog('tag-name-split-log.txt', arrayOfBlocksOfTags, true)
        else if (logFormat == 'both') {
            writeLog('tag-name-log.txt', arrayOfBlocksOfTags, false)
            writeLog('tag-name-split-log.txt', arrayOfBlocksOfTags, true)
        }
}
    ;

*/