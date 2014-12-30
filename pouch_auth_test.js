'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.should();


var pouchAuth = require('./index');
var PouchDB = require('pouchdb');
//PouchDB.debug.enable('*');

describe('pouchAuth', function() {
    this.timeout(10000);

    it('is defined', function() {
        pouchAuth.should.be.a('object');
    });

    describe('when mounted', function() {
        var local, remote, remoteUrl, remoteUser, remotePassword;

        before(function() {
            remoteUrl = process.env.test_remote_url;
            remoteUser = process.env.test_remote_usr;
            remotePassword = process.env.test_remote_pwd;
            if (!remoteUrl || !remotePassword || !remoteUser) {
                throw new Error(
                    'To run tests, you must setup test_remote_url,' +
                    ' test_remote_usr and test_remote_pwd environment variable.'
                );
            }
            remote = new PouchDB(remoteUrl, {
                ajax: {
                    strictSSL: false
                }
            });
            local = new PouchDB('test_assets');
            PouchDB.plugin(pouchAuth);
        });

        it('attach a login method to each db', function() {
            remote.login.should.be.a('function');
            local.login.should.be.a('function');
        });

        it('attach a logout method to each db', function() {
            remote.logout.should.be.a('function');
            local.logout.should.be.a('function');
        });

        it('login method is not available on local dbs', function() {
            expect(function() {
                local.login();

            }).to.throws(TypeError);
        });

        it('logout method is not available on local dbs', function() {
            expect(function() {
                local.logout();
            }).to.throws(TypeError);
        });

        it('allow to login to remote instances', function(done) {
            remote.login(remoteUser, remotePassword)
                .then(function(loggedRemote) {
                    

                    loggedRemote.allDocs({
                            limit: 1
                        })
                        .then(function(doc) {
                            doc.rows.should.be.an('array');
                            done();
                        })
                        .catch(function(err) {
                            done(new Error(err.message));
                        });

                })
                .catch(done);

        });
    });
});
