#!/usr/bin/env node
const program = require('commander')
program.usage('<command>')
const version=require("./package.json").version

const chalk =require('chalk')
const info=chalk.green
const warning=chalk.yellow
const error=chalk.red

program.version(info(`jjsk-cli v${version}`))
program.parse(process.argv);

const questions=[
 {
   
 }
]
const download = require('download-git-repo');
const path=require("path")
const {resolve}=require("path")
const dir=path.join(process.cwd(),"/ccc")
//const { loading } = require("./lib/util");
const {getRcRepo} =require("./lib/api.js")
program
 .command("create")
 .argument('<app-name>')
 .description('create a new micro app')
 .action(async (appName)=>{
    console.log(warning(appName))
	console.log("resolve>>>",resolve("./"))
console.log("__dirname>>>",__dirname)
console.log("process>>>",process.cwd())
console.log("dir>>>",dir)
   await download("github:ivesein/rc-micro-app",dir, { clone: true}, function (err) {
    console.log(err ? 'Error' : 'Success',err)
   }
)})
program.parse(process.argv);