#!/usr/bin/env node
require('colors');
const readline = require('readline');
const request = require('request');
const crypto = require('crypto');

/**
 * 是否包含中文字符
 * @param {String} str 
 * @returns 
 */
function containsChinese(str) {
    // 正则表达式匹配中文字符的范围
    const chineseRegex = /[\u4e00-\u9fa5]/;
    return chineseRegex.test(str);
}

/**
 * 翻译
 * @param {String} query 翻译内容
 */
function baiduTranslation(query) {
    return new Promise((resolve, reject) => {
        const appId = "you api ID";
        const appKey = "you api key";
        const salt = "thb";
        const options = {
            method: 'GET',
            url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
            qs: {
                q: query,
                appid: appId,
                salt,
                from: 'auto',
                to: containsChinese(query) ? 'en' : 'zh',
                sign: crypto.createHash('md5').update(appId + query + salt + appKey).digest('hex')
            }
        };
        request(options, (error, response, body) => {
            if (body != null) {
                let result = JSON.parse(body + "");
                resolve(result.trans_result[0]);
            }
        });
    });
}

/**
 * 标准化字符串
 * hello-world, hello_world, helloWorld=> hello world
 * @param {String} input 待标准化字符串 
 */
function standardized(input) {
    if (input == null || input.trim() == '') {
        return "";
    }
    input = input.replace(/([\-\_])/g, ' ').replace(/([a-z][A-Z])/g, ($1) => { return $1[0] + ' ' + $1[1] })
    return input;
}


async function fanyi(input) {
    input = standardized(input);
    if (input == null || input.trim() == '') {
        return;
    }
    let result = await baiduTranslation(input);
    console.log('---------------------------------');
    console.log(result.src.red);
    console.log(result.dst.green);
    console.log('---------------------------------');
}

let [...argument] = process.argv.splice(2);
argument = argument.join(' ');
if (argument != null && argument.trim() != '') {
    fanyi(argument);
} else {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('line', fanyi);
    console.log("power by baidu".yellow);
}

