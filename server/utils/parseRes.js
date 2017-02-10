'use strict';

module.exports = {
    success: function(data) {
        return JSON.stringify({
            code: '000000',
            msg: '',
            data: data
        })
    },
    error: function(code, msg) {
        return JSON.stringify({
            code: code,
            msg: msg,
            data: {

            }
        });
    }
}
