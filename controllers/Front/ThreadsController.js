const Board = require('../../models/Board')

exports.index = async (request, response) => {
    const page = request.query.page ? parseInt(request.query.page) : 1
    response.json(page)
}

