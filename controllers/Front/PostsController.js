const crypto = require('crypto')

const User = require('../../models/User')
const Board = require('../../models/Board')
const Thread = require('../../models/Thread')
const Post = require('../../models/Post')
const Helpers = require('./../Helpers')

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
    })
}

exports.store = (request, response) => {

}