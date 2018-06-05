/**
 * Created by jeor on 2018/3/31.
 */

var param_name = process.argv[2];
var param_patter = process.argv[3];
/*if(param_name != 'jeor'){
    console.log('you not the maker.');
    process.exit(-1);
}else if(param_patter == null || param_patter == ""){
    console.log('input patter please.');
    process.exit(-2);
}*/
/////////////////////////////
//  搜索   分类     查询  保存
/////////////////////////////
var redis = require('redis');
var msgpack = require('msgpack5')();
var client_source = redis.createClient({
    host:"10.10.131.101",
    port:"6005",
    db:2,
    password:"yunxiao_redis_@xxx"
});
var client_source_buffer = redis.createClient({
    host:"10.10.131.101",
    port:"6005",
    db:2,
    password:"yunxiao_redis_@xxx",
    return_buffers: true
});

var client_target = redis.createClient({
    host:"172.31.16.199",
    port:"6008",
    db:1,
    password:"yunxiao_redis_@xxx",
    return_buffers: true
});

function scanKeys(scan_next, scan_params, arrays) {
    return new Promise(function (resolve, reject) {
        client_source.scan(scan_next, scan_params, function (err, data) {
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
function typeOf(key) {
    return new Promise(function (resolve, reject) {
        client_source.type(key, function (err, type) {
           resolve({key, type});
       });
    });
}
function del(key) {
    return new Promise(function (resolve, reject) {
        client_target.del(key, function (err, result) {
            resolve(result);
        });
    });
}
function get_string(key) {
    return new Promise(function (resolve, reject) {
        client_source_buffer.get(key, function (err, value) {
            resolve(value);
        })
    });
}
function set_string(key, value) {
    return new Promise(function (resolve, reject) {
        client_target.set(key, value, function (err, result) {
            resolve(result);
        })
    });
}
function get_list(key) {
    return new Promise(function(resolve, reject){
        client_source_buffer.lrange(key, ['0', '-1'], function (err, values) {
           resolve(values);
       })
    });
}
function set_list(key, values) {
    return new Promise(function (resolve, reject) {
        client_target.rpush(key, values, function (err, result) {
            resolve(result);
        });
    })
}
function get_set(key) {
    return new Promise(function(resolve, reject){
        client_source_buffer.sunion(key, function (err, values) {
            resolve(values);
        })
    });
}
function set_set(key, values) {
    return new Promise(function (resolve, reject) {
        client_target.sadd(key, values, function (err, result) {
            resolve(result);
        });
    })
}
function get_hash(key) {
    return new Promise(function (resolve, reject) {
        client_source_buffer.hgetall(key, function (err, values,a,b,c) {
            resolve(values);
        });
    })
}
function set_hash(key, values) {
    return new Promise(function (resolve, reject) {
        client_target.hmset(key, values, function (err, result) {
            resolve(result);
        });
    })
}
// todo 还没有处理zset类型
function get_zset(key) {
    return Promise(function (resolve, reject) {

    })
}
function set_zset(key, values) {

}

var scan_params = ["count","10000","match",param_patter];
scanKeys(0, scan_params, []).then(function (keys) {
    var arr_promise = [];
    keys.forEach(function (key) {
        arr_promise.push(typeOf(key).then(function (obj) {
            switch (obj.type){
                case "string":
                    return get_string(obj.key).then(function (value) {
                        return set_string(obj.key, value);
                    });
                    break;
                case "list":
                    return del(obj.key).then(function () {
                        return get_list(obj.key).then(function (values) {
                            return set_list(obj.key, values);
                        })
                    });
                    break;
                case "set":
                    return del(obj.key).then(function () {
                        return get_set(obj.key).then(function (values) {
                            return set_set(obj.key, values);
                        })
                    })
                    break;
                case "hash":
                    return del(obj.key).then(function (values) {
                        return get_hash(obj.key).then(function (values) {
                            set_hash(obj.key, values);
                        })
                    });
                    break;
                case "zset":
                    console.log("find type zset:"+ obj.key);
                    break;
                default:
                    console.log('unmatch type:' + type);
                    break;
            }
        }));
    });
    return Promise.all(arr_promise);
}).then(function (re_data) {
    console.log('done:'+re_data);
}).catch(function (err_scan) {
    console.log(err_scan);
});

/*var key = param_patter;
typeOf(key).then(function (type) {
    switch (type){
        case "string":
            get_string(key).then(function (value) {
                set_string(key, value+"-");
            });
            break;
        case "list":
            break;
        case "set":
            break;
        case "zset":
            break;
        case "hash":
            break;
        default:
            console.log('unmatch type:' + type);
            break;
    }
})*/
// var scan_params = ["count","10000","match",param_patter];
// scanKeys(0, scan_params, []).then(function (keys) {
//     console.log(keys);
// }).catch(function (err) {
//     console.log(err);
// });

// msgpack解密
function msgpack_decode() {
    var key = "1000008:reviews:13113";
    get_hash(key).then(function (values) {
        var msg = values['30-20000-1-1'];
        var decode = msgpack.decode(msg);
        console.log(decode);
    })
}

