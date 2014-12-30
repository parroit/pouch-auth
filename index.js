'use strict';

var assign = require('object-assign');

function remoteDbOnly(pouch) {

    if (pouch.adapter.slice(0, 4) !== 'http') {
        throw new TypeError('Auth plugin available only for remote databases');
    }

}

module.exports = {

    login: function(user, password) {
        remoteDbOnly(this);

        var pouch = this;
        var Promise = pouch.constructor.utils.Promise;
        var request = pouch.constructor.utils.ajax;
        var pos = pouch._db_name.lastIndexOf('/');
        var url = pouch._db_name.slice(0, pos) + '/_session';

        var options = assign({
            method: 'POST',
            url: url,
            form: {
                name: user,
                password: password
            }
        }, pouch.__opts.ajax);


       

        return new Promise(function(resolve, reject) {
            request(options, function(error, body, response) {
                
                if (error) {
                    return reject(new Error(error.status + ': ' + error.message));
                }

                if (response.statusCode !== 200) {
                    return new Error('response status:' + response.statusCode);
                }

                var opts = pouch.constructor.utils.clone(pouch.__opts);

                //opts.ajax = opts.ajax || {};
                opts.headers = opts.headers || {};
                opts.headers.cookie = response.headers['set-cookie'][0];

                var newDb = new pouch.constructor(pouch._db_name,opts);
                newDb.then(resolve).catch(reject);
            });
        });

    },

    logout: function() {
        var pouch = this;

        remoteDbOnly(pouch);

    }
};

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
    window.PouchDB.plugin(exports);
}
