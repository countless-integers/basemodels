/**
 * This class is meant to be extended.
 * 
 * Conventions:
 * > private methods are prefixed with "_" (old-school).
 *   It feels a bit silly in this day and age, but 
 *   imagine this is a backender trying to write
 *   ES6 code :)
 * 
 * Notes:
 * > contains some helper methods that were implemented 
 *   better in a million other libraries just for convinience
 */
export default class AbstractModel {

    /**
     * @param {object} data 
     */
    constructor(data) {
        if (new.target === AbstractModel) {
            throw new TypeError(`You cannot instantiate this ${AbstractModel.name} directly`);
        }
        if (this.getPropertyNames === undefined) {
            throw new TypeError(`You must declare a "getPropertyNames" method`);

        }
        if (!this._isObject(data)) {
            
            throw new TypeError(`You can only pass an object to an ${AbstractModel.name} class instance.`)
        }
        // save for future diffs
        const filteredData = this._filterData(data);
        this.originalData = { ...filteredData };
        Object.assign(this, filteredData);
    }

    /**
     * Shallow-filter input data to contain only properties
     * defined for this model.
     * 
     * @param {object} data 
     * @returns {object} 
     */
    _filterData(data) {
        const allowedProperties = this.getPropertyNames();
        const filteredData = {};
        allowedProperties.forEach(property => {
            filteredData[property] = data[property];
        });
        return filteredData;
    }

    /**
     * @param {object} data 
     * @returns {AbstractModel}
     */
    update(data) {
        if (!this._isObject(data)) {
            throw new TypeError(
                `update method expects and object with property-value pairs or a property name and its new value`
            );
        }
        const filteredData = this._filterData(data);
        Object.assign(this, filteredData);
        return this;
    }

    /**
     * Get changes made to the model since its instatiation.
     * 
     * @returns {object}
     */
    getChanges() {
        let changes = this._diff(this.originalData, this);
        delete changes.originalData;
        return changes;
    }

    /**
     * @returns {object}
     */
    toData() {
        const data = { ...this };
        delete data.originalData;
        return data;
    }

    /**
     * Alias for this.toData
     * 
     * @returns {object}
     */
    toPojo() {
        return this.toData();
    }

    /**
     * @returns {string}
     */
    toJson() {
        return JSON.stringify(this.toData());
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.toJson();
    }
    
    /**
     * Helper for checking if variable is an object.
     * 
     * @param {mixed} variable 
     */
    _isObject(variable) {
        return Object.prototype.toString.call(variable) === '[object Object]'; 
    }
    
    /**
     * Returns an object that is the difference between 
     * object2 and object1
     * 
     * @param {object} object1 
     * @param {object} object2 
     */
    _diff(object1, object2) {
        const result = {};
        const properties = new Set(Object.keys(object1).concat(Object.keys(object2)));
        properties.forEach((property) => {
            let value;
            if (object2[property] === undefined 
                || object1[property] === undefined
                || object2[property] !== object1[property] 
            ) {
                if (this._isObject(object1[property]) && this._isObject(object2[property])) {
                    value = this._diff(object1[property], object2[property]);
                } else {
                    value = object2[property]
                }
                result[property] = value;        
            }
        });
        return result;
    }
}
