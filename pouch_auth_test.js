'use strict';

require('chai').should();

var pouchAuth = require('./index');
var PouchDB = require('pouchdb');


describe('pouchAuth', function() {
    it('is defined', function() {
        pouchAuth.should.be.a('object');
    });

    describe('when mounted', function() {
        var local, remote;

        before(function() {
            var remoteUrl = process.env.test_remote_url;
            if (!remoteUrl) {
                throw new Error(
                    'To run tests, you must setup test_remote_url,'+
                    ' test_remote_usr and test_remote_pwd environment variable.'
                );
            }
            remote = new PouchDB(remoteUrl);
            local = new PouchDB('test_assets');
            PouchDB.plugin(pouchAuth);
        });

        it('attach a login method to each db', function() {
            remote.login.should.be.a('function');
        });
    });
});
