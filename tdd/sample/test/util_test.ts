/// <reference path="../node_modules/@types/mocha/index.d.ts" />
import {expect} from 'chai';
import {Util} from '../src/util';

describe('util tests', () => {
  let util: Util;

  beforeEach(() => {
    util = new Util();
  });

  it('canary test', () => {
    expect(true).to.eql(true);
  });

  it('f2c returns 0C for 32F', () => {
    let fahrenheit: number = 32;

    let celsius: number = util.f2c(fahrenheit);

    expect(celsius).to.eql(0);
  });

  it('f2c returns 10C for 50F', () => {
    let fahrenheit: number = 50;

    let celsius: number = util.f2c(fahrenheit);

    expect(celsius).to.eql(10);
  });
});
