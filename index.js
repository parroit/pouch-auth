'use strict';

module.exports = {
    login: function(){
         var pouch = this;
         var PouchDB = pouch.constructor;
    }
};

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(exports);
}