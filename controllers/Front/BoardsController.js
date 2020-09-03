const Board = require('../../models/Board')
const fs = require('fs')
const fsPromises = fs.promises
const crypto = require('crypto')

exports.index = async (request, response) => {
    const boards = Board.findAll()

    response.json(boards)
}

exports.create = async (request, response) => {
    const head_title = 'Create board';

    return response.render('front/boards/create.html', {
        head_title,
        auth: request.isAuthenticated(),
    })
}

exports.store = async (request, response) => {
    const limit = 1000 * 1000
    const folder = await crypto.randomBytes(12).toString('hex')
    const image = await request.files.image
    const name = await image.name
    const image_path = await `boards/${folder}/${name}`

    const title = await request.body.title
    const slug = await request.body.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
    const description = await request.body.description
    const user_id = await request.user.id

    const data = {
        title,
        slug,
        description,
        folder,
        image_path,
        user_id
    }

    await fsPromises.mkdir(`storage/app/boards/${folder}`, {recursive: true});

    await image.mv(`storage/app/boards/${folder}/${name}`);
    const board = await Board.create(data);

    await request.flash('success', 'board created')

    return await response.redirect(`/boards/${board.slug}?board_id=${board.id}`);
}

exports.show = async (request, response) => {

}