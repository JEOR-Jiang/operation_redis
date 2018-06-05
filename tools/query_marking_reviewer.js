/**
 * Created by jeor on 2018/5/1.
 */

let redis = require('redis');
let setting_ecdb = require('../setting/setting_ecdb');


let paperid = 1304218;
let blockid = 1203973;
let setting = setting_ecdb.getSetting(paperid);
console.log(JSON.stringify(setting));
var client = redis.createClient({
    host:setting.ip,
    port:setting.port,
    db:2,
    password:"yunxiao_redis_@xxx",
    //return_buffers: true
});
function scanKeys(scan_next, scan_params, arrays) {
    return new Promise(function (resolve, reject) {
        client.scan(scan_next, scan_params, function (err, data) {
            if(err){
                reject(err);
            }else{
                var scanNext = parseInt(data[0]);
                arrays = arrays.concat(data[1]);
                if(scanNext == 0){
                    resolve(arrays);
                }else{
                    scanKeys(scanNext, scan_params, arrays).then(function (keys) {
                        resolve(keys);
                    })
                }
            }
        })
    });
}
let param_patter = `${paperid}:pool:${blockid}:doing\:*\:normal`;
let scan_params = ["count","10000","match",param_patter]
scanKeys(0, scan_params, []).then(function (keys) {
    console.log(keys);
}).catch(e => {
    console.log(e);
})