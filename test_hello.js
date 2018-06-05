console.log('_________start');

var redis = require("redis");
var redis_config = {
    'host':'172.31.16.199',
    'port':'6008',
    'auth':'yunxiao_redis_@xxx'
};
var client_source = redis.createClient(redis_config);
client_source.auth("yunxiao_redis_@xxx");
client_source.SELECT('0', function (err) {
    if(err){
        console.log(err);
        return;
    }else {
        console.log('connect success.');
        setValue(client_source);
        queryValue(client_source);
    }

});
function setValue(client) {
    client.set('jeor_test', 'message', function (err, res) {
        console.log(err, res);
    });
}
function queryValue(client) {
    client.get('jeor_test', function (err, res) {
        console.log(err, res);
        process.exit(0);
    });
}