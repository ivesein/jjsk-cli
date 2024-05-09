const ora = require('ora')

function sleep(n) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, n)
    })
}

async function loading(message, fn, ...args) {
    const spinner = ora(message)
    spinner.start() //
    try {
        let executeRes = await fn(...args)
        spinner.succeed()
        return executeRes
    } catch (error) {
        spinner.fail('request fail, reTrying')
        await sleep(1000)
        return loading(message, fn, ...args)
    }
}
function underscoreToCamelCase(str) {
    return str
        .replace(/_+(\w)/g, function (_, match) {
            return match.toUpperCase()
        })
        .replace(/^./, function (match) {
            return match.toLowerCase()
        })
}
module.exports = {
    loading,
    underscoreToCamelCase,
}
