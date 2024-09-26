var bcrypt = require("bcrypt");
var config = require("config");
function hash_password(password) {
    var saltRounds = config.get("salt");

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);

    return hash;
}

function compare_passwords(password, hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    hash_password: hash_password,
    compare_passwords: compare_passwords
}