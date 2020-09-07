const crypto = require('crypto')

const User = require('../../models/User')
const Board = require('../../models/Board')
const Thread = require('../../models/Thread')
const Post = require('../../models/Post')
const Helpers = require('./../Helpers')
const dd = require('dump-die')

exports.index = async (request, response) => {
    const thread_id = request.params.thread_id;
    const board_slug = request.params.board_slug

    const thread = await Thread.findOne({
        where: {
            id: thread_id
        },
        include: [
            {
                model: Post,
                as: 'posts',
                required: false,
                //offset,
                //limit
            }
        ]
    })
    const head_title = thread.title

    response.render('front/posts/index.html', {
        head_title,
        thread,
        auth: request.isAuthenticated(),
        success: request.flash('success'),
    })
}

exports.store = async (request, response) => {

    let board_id = request.query.board_id
    board_id = parseInt(board_id)

    let thread_id = request.query.thread_id
    thread_id = parseInt(thread_id)

    const content = request.body.content

    const board = await Board.findByPk(board_id)
    const thread = await Thread.findByPk(thread_id)

    const user_id = await request.user.id


    let data = {
        user_id,
        board_id,
        thread_id,
        content,
    }

    if (request.files?.image) {
        const limit = 1000 * 1000
        if (request.files.image.size > limit) {
            return response.status(400).send('File too large. Not more 1 Mo')
        }

        const image = await request.files.image
        const name = await image.name
        let path = `storage/app/boards/${board.folder}/${thread.folder}/${name}`
        image.mv(path)

        data.image_path = `boards/${board.folder}/${thread.folder}/${name}`
    }

    const post = await Post.create(data)

    request.flash('success', 'Post created')
    response.redirect(`/boards/${board.slug}/${thread.id}?board_id=${board_id}&thread_id=${thread_id}`)
}