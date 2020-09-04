const Board = require('../../models/Board')
const Thread = require('../../models/Thread')
const fs = require('fs')
const fsPromises = fs.promises
const crypto = require('crypto')
const dd = require('dump-die')

exports.index = async (request, response) => {
    const head_title = 'threads'
    const limit = 10
    let offset = 0

    if (request.query.page) {
        const page = request.query.page;
        offset = page * limit;
    }

    let id = request.query.board_id
    id = parseInt(id)

    const board = await Board.findByPk(id)

    const { count, rows } = await Thread.findAndCountAll({
        where: {
            board_id: id
        },
        limit: 3
    })

    response.render('front/threads/index.html', {
        board,
        threads: rows
    })
}

exports.create = async (request, response) => {
    const board_id = await request.params.board_id;

    const board = await Board.findByPk(board_id)

    await response.render('front/threads/create.html', {
        board,
        auth: request.isAuthenticated(),
    });
}

exports.store = async (request, response) => {
    const limit = 1000 * 1000

    let board_id = request.params.board_id
    const board = await Board.findByPk(board_id)
    const board_folder = await board.folder
    const thread_folder = await crypto.randomBytes(12).toString('hex')

    const title = await request.body.title
    const slug = await request.body.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
    const content = await request.body.content

    const user_id = request.user?.id ?? 25

    let data = {
        board_id,
        title,
        slug,
        content,
        folder: thread_folder,
        user_id
    }

    const image = await request.files.image
    const name = await image.name

    data.image = name

    await fsPromises.mkdir(`storage/app/boards/${board_folder}/${thread_folder}`, {recursive: true});

    const image_path = `boards/${board_folder}/${thread_folder}/${name}`
    await image.mv(`storage/app/${image_path}`)

    data.image_path = image_path

    const thread = await Thread.create(data)
    const slugRedirect = await board.slug + `?board_id=${board.id}`

    return await response.redirect(`/boards/${slugRedirect}?board_id=${board_id}`)
}

