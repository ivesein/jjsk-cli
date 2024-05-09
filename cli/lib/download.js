const download = require('download-git-repo')
const path = require('path')
const ora = require('ora')

module.exports = function (type) {
    target = path.join(process.cwd(), '.download-temp')
    return new Promise(function (res, rej) {
        // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
        const tempUrlConf = {
            建工智云通用微服务:
                'direct:http://192.168.11.114/cloud_platform/public_platform/public_components/common_components/front_ends/jjsk_micro_web_template.git#develop',
            建工智云项目管理微服务:
                'direct:http://192.168.11.114/cloud_platform/public_platform/public_components/common_components/front_ends/jjsk_micro_web_template.git#micro_service_for_project',
            中台微服务: 'github:ivesein/rc-micro-app#main',
        }
        let url = tempUrlConf[type]
        const spinner = ora(`正在下载${type}模板`)
        spinner.start()

        download(url, target, { clone: true }, function (err) {
            if (err) {
                download(url, target, { clone: false }, function (err) {
                    if (err) {
                        spinner.fail()
                        rej(err)
                    } else {
                        // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
                        spinner.succeed()
                        res(target)
                    }
                })
            } else {
                // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
                spinner.succeed()
                res(target)
            }
        })
    })
}
