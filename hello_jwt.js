/**
 * Created by jeor on 2018/4/24.
 */
var jwt = require("jsonwebtoken");
let _ = require("lodash");
var token = jwt.sign({
    foo: 'bar',
    fo2o: 'b3ar',
    fo1o: 'b3ar',
    fo23o: 'b3ar',
    fo24o: 'b3ar',
    fo25o: 'b3ar',
    fo62o: 'b3ar',
}, 'shhhhh');
// console.log(token);

var decoded = jwt.sign({timestamp:_.now()}, '18248DB51652C8CE2BCF440066E946F1');
console.log(decoded);


// decoded = jwt.verify("1222, '18248DB51652C8CE2BCF440066E946F1');
// console.log(decoded);