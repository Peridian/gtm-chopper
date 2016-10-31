module.exports = {
    execute: (indexPath, splitLevel, searchKey, notWrite, logFormat, excludeTags, distFileName) => {
        'use strict'

        var
            fs = require('fs')
            , writeContainerFiles = (containerName, allGTMs, ranges, container) => {
                containerName = containerName ? containerName : '(NOT SET)'

                var
                    range = ''
                    , fullContainerName = []
                    , newFullContainer = []
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

                    fs.writeFile('Processed containers\\' + fullContainerName
                        , JSON.stringify(newFullContainer), (err) => {
                            if (err) throw err;

                            console.log('\nFile saved')
                        });
                });
            }
            , writeLogs = (containerName, allGTMs, ranges, container) => {
                containerName = containerName ? containerName : '(NOT SET)'

                var
                    range = ''
                    , fullContainerName = []
                    , fullContainerNameSplit = []
                    , newFullContainer = []
                    , logList = []
                    , logSplit = []
                    ;

                allGTMs.forEach((e, i, a) => {
                    fullContainerName = []
                    fullContainerNameSplit = []

                    range = ranges[i].tags[0] + '_' + ranges[i].tags[1]

                    fullContainerName.push(i + 1)
                    fullContainerName.push(containerName)
                    fullContainerName.push(ranges[i].level)
                    fullContainerName.push(range)
                    fullContainerName = fullContainerName.join(' - ')
                    fullContainerName += '.json'

                    fullContainerNameSplit.push(i + 1)
                    fullContainerNameSplit.push(ranges[i].level)
                    fullContainerNameSplit.push(range)
                    fullContainerNameSplit = fullContainerNameSplit.join(' - ')

                    newFullContainer = JSON.parse(JSON.stringify(container))
                    newFullContainer.containerVersion.tag = e

                    console.log('\nSaving file:', fullContainerName)
                    console.log(newFullContainer.containerVersion.tag.length, 'tags')
                    console.log(newFullContainer.containerVersion.variable.length, 'variables')
                    console.log(newFullContainer.containerVersion.trigger.length, 'triggers')

                    logList.push(
                        /*
                        console.log(
                          */
                        '----- '
                        + fullContainerName
                        + '\n\n'
                        + e.map((x) => { return x.name }).join('\n')
                    )

                    logSplit.push(
                        fullContainerNameSplit
                        + ','
                        + e.map((x) => { return x.name }).join(',')
                    )
                }
                );

                fs.writeFileSync(
                    'tag-name-log.txt'
                    , logList.join('\n\n'
                    )
                    , 'utf-8'
                )

                fs.writeFileSync(
                    'tag-name-log-splitable.txt'
                    , logSplit.join(';'
                    )
                    , 'utf-8'
                )
            }
            ;

        var
            paths =
                (() => {
                    return {
                        root: indexPath.join('\\')
                        , processed: indexPath.join('\\') + '\\\Processed container'
                        , original: indexPath.join('\\') + '\\\Original containers'
                    }
                })()
            , folderFileArray = fs.readdirSync(paths.original)
            , folderFile = folderFileArray.filter((e, i, a) => {

                var
                    arr = searchKey.split(',')
                    , passCount = 0
                    ;

                arr.forEach((ee) => {

                    if (e.indexOf(ee) != -1) {
                        passCount++
                    }
                })

                return passCount == arr.length
            })
            ;

        if (folderFile.length != 1)
            throw 'Couldn\'t get an unique match with the search key provided. Could you check them and try again, please?\nHere are the folder files to help you up!\n' + folderFileArray.map((e, i, a) => {
                return '\n' + i + '| ' + e
            })
        else folderFile = folderFile[0]

        console.log('- File chosen:', folderFile)

        var container = JSON.parse(fs.readFileSync([paths.original, folderFile].join('\\')));

        console.log('-', container.containerVersion.tag.length + ' tags')
        console.log('-', container.containerVersion.variable.length + ' variable')
        console.log('-', container.containerVersion.trigger.length + ' trigger')

        // Separando a tag de webdev
        var customCheckout = container.containerVersion.tag.filter((e, i, a) => {
            return (e.name == 'Script - Checkout Custom')
        })[0];

        var
            allGTMs = []
            , formatArrToObj = (ranges) => {
                var
                    result = []
                    , levelHash = {
                        '1': 'Full'
                        , '2': 'Half'
                        , '4': 'Quarter'
                        , '8': 'Eigth'
                        , '16': 'Sixteenth'
                        , '32': '32th'
                    }

                ranges.forEach((e, i, a) => {
                    e.forEach((ee, ii, aa) => {

                        result.push(
                            {
                                level: levelHash[e.length + '']
                                , tags: ee
                            }
                        )

                    });

                });

                return result;
            }
            , listTagsByName = (fileName) => {

                console.log('-- listTagsByName called')

                console.log(
                    JSON.parse(
                        fs.readFileSync(
                            paths.processed + '\\' + fileName
                            , 'utf-8')
                    )
                        .containerVersion
                        .tag
                        .map((e) => { return e.name })
                )

            }
            , newTagsArrays = (ranges) => {
                var containers = [];

                ranges.forEach((e, i, a) => {

                    var croppedGTM = container.containerVersion.tag.filter((ee, ii, aa) => {

                        var pass =
                            (
                                ii >= e.tags[0]
                                &&
                                ii <= e.tags[1]
                                &&
                                ee.name != 'Script - Checkout Custom'
                                /*
                                                                    
                                                                    &&
                                                                    excludeTags.length == 0 ? true : !(
                                                                        ii >= excludeTags.split(',')[0]
                                                                        &&
                                                                        ii <= excludeTags.split(',')[1]
                                                                    )
                                */
                            )

                        return pass
                    });

                    containers.push(croppedGTM)

                    containers[i].push(customCheckout);

                });

                return containers;
            }
            , createRanges = (max, levels) => {

                let allRangesByLevel = []

                for (let i = 0; i <= levels; i++) {
                    let
                        levelRanges = []
                        , pot = Math.pow(2, i)
                        , step = Math.ceil(max / pot)

                    for (let j = 1; j <= pot; j++) {
                        let
                            range = []
                            , top = Math.ceil(j * step) > max ? max : Math.ceil(j * step)

                        levelRanges.push(
                            levelRanges.length == 0 ? [0, top] : [previousTop + 1, top]
                        )

                        var previousTop = Math.ceil(j * step) > max ? max : Math.ceil(j * step)

                    }


                    allRangesByLevel.push(levelRanges)
                }
                return allRangesByLevel
            }
            , ranges = formatArrToObj(createRanges(container.containerVersion.tag.length, splitLevel))
            , finalize = (text) => {
                console.log();
                console.log(text);
                console.log();
            }
            , execute = (fileBaseName) => {
                if (notWrite)
                    writeContainerFiles(fileBaseName, newTagsArrays(ranges), ranges, container)

                writeLogs(fileBaseName, newTagsArrays(ranges), ranges, container, logFormat)

                finalize('----- That\'s all, folks! -----')
            }
            ;

        execute(distFileName);

    }
}