'use strict';

function remoteDbOnly(pouch) {

    if (pouch.adapter.slice(0, 4) !== 'http') {
        throw new TypeError('Auth plugin available only for remote databases');
    }

}

module.exports = {

    login: function() {
        var pouch = this;

        remoteDbOnly(pouch);

        var PouchDB = pouch.constructor;


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
