const assert = require('assert');
const expect = require("chai").expect
const should = require("chai").should()
import AbstractModel from '../src/AbstractModel';

const Fruit = class Fruit extends AbstractModel { 
    getPropertyNames() {
        return [ 'name' ];
    }
};

describe('AbstractModel instantiation tests', () => {
    it('should fail when trying to instatiate directly', () => {
        const check = () => new AbstractModel({a: 2});
        expect(check).to.throw(TypeError);
    });
    it('will not contain unspecified properties', () => {
        const fruit = new Fruit({
            name: 'orange',
            colour: 'orange'
        });
        expect(fruit).to.have.property('name');
        expect(fruit).to.not.have.property('colour');
    });
});

describe('AbstractModel property access', () => {
    it('has accessible properties', () => {
        const fruit = new Fruit({
            name: 'orange'
        });
        expect(fruit).to.have.property('name');
        expect(fruit.name).to.equal('orange');
    });
});

describe('AbstractModel updates', () => {
    it('can be updated', () => {
        const fruit = new Fruit({
            name: 'orange'
        });
        fruit.update({ name: 'banana' });
        expect(fruit.name).to.equal('banana');
    });
    it('can be updated only with specified properties', () => {
        const fruit = new Fruit({
            name: 'orange',
            colour: 'red'
        });
        fruit.update({ name: 'banana' });
        expect(fruit).to.not.have.property('colour');
    });
    it('knows what has been updated', () => {
        const fruit = new Fruit({
            name: 'orange'
        });
        fruit.update({ name: 'banana' });
        const changes = fruit.getChanges();
        expect(Object.keys(changes)).to.eql(['name']);
        expect(changes).to.eql({ name: 'banana' });
    });
});

describe('AbstractModel exports', () => {
    it('can be exported to POJO', () => {
        const fruit = new Fruit({
            name: 'orange'
        });
        const json = fruit.toData();
        expect(json).to.eql({ name: 'orange' });
    });
    it('can be exported to JSON', () => {
        const fruit = new Fruit({
            name: 'orange'
        });
        const json = fruit.toJson();
        expect(json).to.equal('{"name":"orange"}');
    });
    it('can be exported to string', () => {
        const fruit = new Fruit({
            name: 'orange'
        });
        const text = fruit + '';
        expect(text).to.equal('{"name":"orange"}');
    });
});