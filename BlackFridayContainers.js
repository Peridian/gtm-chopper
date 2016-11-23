'use strict'

console.log()

var CreateContainers = (websiteName) => {
    var
        paths = {
            plan: './csvs/' + websiteName + '.tsv'
            , src: websiteName
        }
        ;

    paths.dist = paths.src.split('-')[0].trim()
    paths.dist = './BF/' + paths.dist + '/' + paths.dist

    var
        fs = require('fs')
        , tagPlan = require('./JSONfy-spreadsheet.js').JSONfySpreadsheet(paths.plan)
        ;

    paths.src = './Original containers/';

    paths.src += fs
        .readdirSync(paths.src)
        .filter((e, i, a) => {
            return e
                .split('-')[0]
                .trim() == websiteName
        })[0]

    var
        container = JSON.parse(fs.readFileSync(paths.src))
        , noMidiaContainer = JSON.parse(JSON.stringify(container))
        , tags = container.containerVersion.tag
        ;

    if (tags.length != tagPlan.length) {


        console.log('\n\n---- ERROR -----')
        console.log('Difference in total of tags between detected.')
        console.log('Container:', tags.length)
        console.log('Spreadsheet:', tagPlan.length)

        var
            origin = ''
            , biggerContainer = []
            , smallerContainer = []

        if (tags.length > tagPlan.length) {
            origin = 'container'
            biggerContainer = JSON.parse(JSON.stringify(tags))
            smallerContainer = JSON.parse(JSON.stringify(tagPlan))
        } else {
            origin = 'spreadsheet'
            biggerContainer = JSON.parse(JSON.stringify(tagPlan))
            smallerContainer = JSON.parse(JSON.stringify(tags))
        }

        biggerContainer.forEach((e, i, a) => {
            var pass = false;

            smallerContainer.forEach((ee, ii, aa) => {
                if (e.name == ee.Tag) pass = true;
            });

            if (!pass) console.log('|', e.name, '| present on ', origin)

        })

        console.log('---- ERROR -----\n')


    }

    tags = tags.filter((e, i, a) => {
        var planItem =
            tagPlan.filter((ee, ii, aa) => {

                var pass1 = (
                    e.name == ee.Tag
                    &&
                    ee.FINAL == 'Ativar'
                )

                return pass1;
            })

        return planItem.length > 0
    });

    noMidiaContainer.containerVersion.tag =
        tags.filter((e, i, a) => {

            var planItem =
                tagPlan.filter((ee, ii, aa) => {

                    var pass1 = (
                        e.name == ee.Tag
                        &&
                        ee.FINAL == 'Ativar'
                        &&
                        e
                            .name
                            .toLowerCase()
                            .indexOf('media') == -1
                    )

                    return pass1;
                })

            return planItem.length > 0
        });

    var contTags = container.containerVersion.tag.map((e, i, a) => {
        return e.name
    })

    contTags =
        contTags.length
        + ' tags\n\n'
        + contTags.join('\n')

    fs.writeFileSync(
        paths.dist + " - COMPLETO - LOG.txt"
        , contTags
        , 'utf-8'
    );

    console.log(
        websiteName
        , 'COMPLETO - Total de tags'
        , container.containerVersion.tag.length
    );

    console.log(
        websiteName
        , 'COMPLETO - Log criado');

    console.log('---')

    /////////////// #MIDIA ///////////////

    console.log(
        websiteName
        , 'SEM MIDIA - Total de tags',
        noMidiaContainer.containerVersion.tag.length
    )

    fs.writeFileSync(
        paths.dist
        + " - SEM MIDIA - LOG.txt"
        , noMidiaContainer.containerVersion.tag.length
        + ' tags\n\n'
        + noMidiaContainer.containerVersion.tag.map((e, i, a) => {
            return e.name
        }).join('\n')
        , 'utf-8'
    );

    console.log(
        websiteName
        , 'SEM MIDIA - Log criado');

    noMidiaContainer =
        JSON.stringify(
            noMidiaContainer
        )

    fs.writeFileSync(
        paths.dist + " - SEM MIDIA.json"
        , noMidiaContainer
        , 'utf-8'
    );

    console.log(
        websiteName
        , 'SEM MIDIA - Container criado');

    tags = tags.filter((e, i, a) => {
        var planItem =
            tagPlan.filter((ee, ii, aa) => {

                var pass1 = (
                    e.name == ee.Tag
                    &&
                    ee.FINAL == 'Ativar'
                )

                return pass1;
            })

        return planItem.length > 0
    });

    container.containerVersion.tag = tags

    /////////////// #VALIDADO ///////////////

    console.log('---')

    var str = tags.map((e, i, a) => {
        return e.name
    })

    str =
        str.length
        + ' tags\n\n'
        + str.join('\n')

    fs.writeFileSync(
        paths.dist + " - VALIDADO - LOG.txt"
        , str
        , 'utf-8'
    );

    console.log(
        websiteName
        , 'VALIDADO - Log criado'
    );

    container = JSON.stringify(container)

    fs.writeFileSync(
        paths.dist + " - VALIDADO.json"
        , container
        , 'utf-8'
    );

    console.log(
        websiteName
        , 'VALIDADO - Container criado'
    );

    console.log(
        websiteName
        , 'VALIDADO - Total de tags',
        tags.filter((e, i, a) => {
            return e.FINAL != 'Ativar'
        }).length
    )
}

//////////////////////////////

['CC', 'BTP', 'CNS'].forEach((e) => {
    console.log(['\n----------', e, '----------\n'].join(' '))
    CreateContainers(e)
});