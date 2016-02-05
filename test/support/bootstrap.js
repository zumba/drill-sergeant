"use strict";

var chai = require('chai');
var sinon = require('sinon');
var chaiAsPromised = require('chai-as-promised');
var chaiSinon = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(chaiSinon);

global.chaiAsPromised = chaiAsPromised;
global.chaiSinon = chaiSinon;
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
global.sinon = sinon;
