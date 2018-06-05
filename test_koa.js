console.log('start')

var redis = require('redis');
var koa = require('koa');
var koa_store = require('koa-redis');

var client = redis.createClient({
    host:"172.31.16.199",
    port:"6008"
});
client.auth("yunxiao_redis_@xxx");
var store = koa_store({
    client:client,
    db: 0
});
store.client.get("jeor_test",function (cal) {
    console.log(cal);
}).then(function (data) {
    console.log(data);
}).catch(function (err) {
    console.log(err);
})