const dev = process.env.NODE_ENV === "development"
const test = process.env.NODE_ENV === "test"

module.exports = {
    css: {
        extract: !dev && !test
    },
}
