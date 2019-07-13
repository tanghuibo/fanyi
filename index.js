#!/usr/bin/env node
require('colors');
const readline = require('readline');
var request = require('request');

/**
 * 翻译
 * @param {String} query 翻译内容
 */
function youdaoTranslation(query) {
    return new Promise((resolve, reject) => {
        let options = {
            "method":"GET",
            "url": "http://fanyi.youdao.com/translate",
            qs: {
                doctype: "json",
                "type": "AUTO",
                "i": query
            }
        }
        request(options = options, callback = (error, response, body) => {
            if(body != null) {
                let result = JSON.parse(body + "");
                resolve(result.translateResult[0][0]);
            }
        });
    });
}

/**
 * 表转化字符串
 * hello-world, hello_world, helloWorld=> hello world
 * @param {String} input 代表转化字符串 
 */
function standardized(input) {
    if(input == null || input.trim() == '') {
        return "";
    }
    input = input.replace(/([\-\_])/g, ' ').replace(/([a-z][A-Z])/g, ($1) => {return $1[0] + ' ' + $1[1]})
    return input;
}


async function fanyi(input) {
    input = standardized(input);
    if(input == null || input.trim() == '') {
        return;
    }
    let result = await youdaoTranslation(input);
    console.log('---------------------------------');
    console.log(result.src.red);
    console.log(result.tgt.green);
    console.log('---------------------------------');
}

let [ ...argument] = process.argv.splice(2);
argument = argument.join(' ');
if(argument != null && argument.trim() != '') {
    fanyi(argument);
} else {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('line', fanyi);
    console.log("power by youdao".yellow);
}

