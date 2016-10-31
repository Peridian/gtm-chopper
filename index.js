'use strict'

console.log()

var
  indexPath = ''
  , splitLevel = ''
  , searchKey = ''
  , rootPath = ''
  , notWrite = ''
  , logFormat = ''
  , excludeTags = ''
  , distFileName = ''
  ;

notWrite = process.argv.indexOf('notWrite') != -1 ? false : true

process.argv.forEach(function (val, index, array) {

  indexPath = array[1].split('\\')
  indexPath.pop()
  indexPath.join('\\')

  if (val.indexOf('folder') != -1) indexPath = val.split('folder=').pop()
  else if (val.indexOf('key') != -1) searchKey = val.split('key=').pop()
  else if (val.indexOf('split') != -1) splitLevel = val.split('split=').pop()
  else if (val.indexOf('name') != -1) distFileName = val.split('name=').pop()
  else if (val.indexOf('exclude') != -1)
    if (val.indexOf('exclude=') != -1) {
      excludeTags = val.split('exclude=').pop()

      if (excludeTags.length == 0) throw 'The exclude parameter was provided without value. Ain\'t nobody got time for that. Put something there, boy!'
      else if (excludeTags.indexOf(',') == -1) throw 'The parameter provided doesn\'t seem to be a tag range. Do you even lift? Please, check the content provided.'
      else if (

        (() => {
          return (
            excludeTags
              .split(',')
              .map((e) => { return !isNaN(e) })
              .indexOf(false) > -1
          )
        })()

      )
        throw 'You have not provided numbers inbetween commas. Fuck you, you know. Like, what the fuck? Aren\' you the fucking developer of this shit? I don\'t even know what to tell you, dude. Like, put on some fucking reasonable parameter values and THEN we\'ll talk, ok? JEEZ...'
    }

});

var pass =
  (
    indexPath.length != 0
    &&
    splitLevel.length != 0
    &&
    searchKey.length != 0
    &&
    distFileName.length != 0
  )

if (!pass) throw 'Please, provide a parameter for "folder", "name", "key" and "split"'

require('./src/app.js').execute(indexPath, splitLevel, searchKey, notWrite, logFormat, excludeTags, distFileName)