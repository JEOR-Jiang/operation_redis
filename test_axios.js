/**
 * Created by jeor on 2018/4/26.
 */
let axios = require("axios");
// axios.get("http://ecdb.haofenshu.com/dbmgr/getShardInfo").then(res => {
//     console.log(res.data);
// })

let _ = require("lodash");
let jsonwebtoken = require("jsonwebtoken");


let timestamp = _.now();
let schoolId = 111;
let userId = 2323231311312;
let userName = "jeor";
let userRealName = "xiaojiang";
let json = {
    timestamp,schoolId,userId,userName,userRealName
}

let token = jsonwebtoken.sign(json, "18248DB51652C8CE2BCF440066E946F1");
console.log(token);
