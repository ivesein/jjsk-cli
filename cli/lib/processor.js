const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const remove = require('../lib/remove')
// const path = require('path')
// const fs = require('fs')
module.exports = function (context) {
    const { downloadTemp: dir, metaData } = context
    const dest = process.cwd()
    if (!dir) {
        return Promise.reject(new Error(`无效的source：${src}`))
    }
    return new Promise((resolve, reject) => {
        const metalsmith = Metalsmith(dest).metadata(metaData).clean(false).source(dir).destination(dest)
        metalsmith.use((files, metalsmith, done) => {
            const meta = metalsmith.metadata()
            // 无需处理的文件
            const excludeArr = [
                'async.js',
                'assets',
                'common',
                'components',
                'utils',
                'context',
                'data-source',
                'service',
            ]
            Object.keys(files).forEach(async (file) => {
                let content = files[file].contents.toString()
                if (excludeArr.every((item) => !file.includes(item))) {
                    content = Handlebars.compile(
                        // fs.readFileSync(path.join(dir, file)).toString()
                        content
                    )(meta)
                    files[file].contents = Buffer.from(content)
                }
            })
            done()
        })
        metalsmith.build((err) => {
            remove(dir)
            err ? reject(err) : resolve(context)
        })
    })
}
