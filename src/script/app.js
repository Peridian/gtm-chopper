(function () {
    var app = (function () {
        var app = {
            execute: (indexPath, splitLevel, searchKey, notWrite, logFormat, excludeTags, distFileName) => {
                'use strict'

                var
                    fs = require('fs')
                    , forceIncludeTags = [
                        'Script - Checkout Custom'
                    ]
                    , writeLog = (name, arr, split) => {
                        fs.writeFile(
                            name
                            , arr.map((e, i, a) => {
                                return (
                                    split
                                        ? e[0] + ',' + e[1].join(',')
                                        : '------ #' + e[0] + '\n\n' + e[1].join('\n')
                                )
                            }).join(
                                split ? ';' : '\n\n'
                                )
                            , 'utf-8'
                            , (err) => {
                                if (err) throw err
                                console.log('\nLog saved')
                            }
                        )
                    }
                    , writeContainerFiles = (containerName, allGTMs, ranges, container) => {
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
                    , newTagsArrays = (ranges) => {
                        var containers = [];
                        ranges.forEach((e, i, a) => {
                            var croppedGTM = container.containerVersion.tag.filter((ee, ii, aa) => {
                                var pass = []

                                pass.push(
                                    (
                                        ii >= e.tags[0]
                                        &&
                                        ii <= e.tags[1]
                                    ) ? true : false
                                )

                                pass.push(
                                    (
                                        forceIncludeTags.indexOf(ee.name) == -1
                                    ) ? true : false
                                )

                                pass.push(
                                    excludeTags.length == 0 ? true : !(
                                        ii >= excludeTags.split(',')[0]
                                        &&
                                        ii <= excludeTags.split(',')[1]
                                    ) ? true : false
                                )

                                pass = pass.indexOf(false) == -1 ?
                                    true
                                    :
                                    false

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
                        writeContainerFiles(fileBaseName, newTagsArrays(ranges), ranges, container)

                        finalize('----- That\'s all, folks! -----')
                    }
                    ;

                execute(distFileName);

            }
        }

        return app;
    })();

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = app;
    else
        window.app = app;
})();