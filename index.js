'use strict';

var assign = require('object-assign');

function remoteDbOnly(pouch) {

    if (pouch.adapter.slice(0, 4) !== 'http') {
        throw new TypeError('Auth plugin available only for remote databases');
    }

}


function loggedDbOnly(pouch) {

    if (!pouch.user) {
        throw new Error('This database was never authenticated.');
    }

}

module.exports = {

    login: function(user, password) {
        remoteDbOnly(this);

        var pouch = this;
        var utils = pouch.constructor.utils;
        var Promise = utils.Promise;
        var request = utils.ajax;
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

                var opts = utils.clone(pouch.__opts);

                opts.headers = opts.headers || {};
                opts.headers.cookie = response.headers['set-cookie'][0];

                var newDb = new pouch.constructor(pouch._db_name, opts);
                var userId = 'org.couchdb.user:' + user;
                newDb.user = {
                    name: user,
                    roles: body.roles || [],
                    type: 'user',
                    _id: userId
                };
                newDb.then(resolve).catch(reject);
            });
        });

    },

    logout: function() {
        var pouch = this;

        remoteDbOnly(pouch);
        loggedDbOnly(pouch);

    }
};

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
    window.PouchDB.plugin(exports);
}
