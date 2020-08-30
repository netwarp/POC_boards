import scss from 'rollup-plugin-scss'

export default [
    {
        input: 'resources/sass/app.scss',

        output: {
            file: 'public/css/app',
            format: 'es'
        },

        plugins: [
            scss({
                outputStyle: "compressed",
            })
        ]
    }
]