#!/usr/bin/env node
// require("./lib/init.js");
const program = require('commander')
const path = require('path')
// console.log('LooK-Here->: path', path)
const fs = require('fs')
const glob = require('glob') // npm i glob -D
const download = require('./lib/download.js')
const inquirer = require('inquirer')
const chalk = require('chalk')
const processor = require('./lib/processor.js')
// const generator = require("./generator");
const logSymbols = require('log-symbols')
const utils = require('./lib/util.js')
program.usage('<command>')
const version = require('./package.json').version

const info = chalk.green
const warning = chalk.yellow
const error = chalk.red

program.version(info(`jjsk-cli v${version}`))
program.parse(process.argv)
const currentFolderName = path.basename(process.cwd())
const defaultBaseUrl = currentFolderName.replace('jiangong_cloud_', '').replace('_web', '')

const defaultRootDomID = utils.underscoreToCamelCase(defaultBaseUrl) + 'App'
const defaultOutPutPort = currentFolderName.replace('web', 'micro')
const questions = [
    {
        type: 'list',
        name: 'tempType',
        message: '请选择要初始化的项目类型？',
        choices: ['建工智云通用微服务', '建工智云项目管理微服务', '中台微服务'],
    },
    {
        name: 'appName',
        message: '微应用名称',
        default: currentFolderName,
        validate(val) {
            const reg = /^[a-z _]+$/
            if (val && !reg.test(val)) {
                return '微应用名称必须为全小写英文字母，可用下滑线拼接!'
            } else {
                return true
            }
        },
    },
    {
        name: 'version',
        message: 'version',
        default: '1.0.0',
    },
    {
        name: 'outputPort',
        message: '微前端路由端口映射',
        default: defaultOutPutPort,
    },
    {
        name: 'baseUrl',
        message: '微服务主路由',
        default: defaultBaseUrl,
    },
    {
        name: 'rootDomID',
        message: '根节点DomID',
        default: defaultRootDomID,
    },
    {
        name: 'apiPort',
        message: '微服务网关',
        default: defaultBaseUrl,
    },
]

program
    .command('init')
    .description('init micro app')
    .action(async () => {
        try {
            const answer = await inquirer.prompt(questions)
            const list = glob.sync('*') // 遍历当前目录
            if (list.length > 1 || (list.length === 1 && list[0] !== 'README.md')) {
                // 如果当前目录不为空
                console.log(error('请在项目根目录下执行初始化命令'))
                return
            }
            download(answer.tempType)
                .then((target) => {
                    console.log(info('创建成功'))
                    return {
                        downloadTemp: target,
                        metaData: {
                            ...answer,
                        },
                    }
                })
                .then((context) => {
                    // processor(context).then((packageContent) => {
                    // 	const target = path.join(process.cwd(), "package.json");
                    // 	fs.writeFileSync(target, packageContent);
                    // });
                    return processor(context)
                })
                .then((context) => {
                    console.log(logSymbols.success, chalk.green('创建成功:)'))
                    console.log(info('To get started:\n\nyarn\nyarn start'))
                })
                .catch((err) => {
                    console.error(logSymbols.error, error(`创建失败：${err.message}`))
                })
        } catch (error) {
            console.log(error('输入错误...'))
        }
    })
program.parse(process.argv)
