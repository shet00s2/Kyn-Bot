module.exports = {

    get: (target, name) => {

        return target[name];
    },

    set: (obj, prop, value) => {

        if (prop === 'lib') {

            //If the property that is being set is 'lib' check the property and see
            //which libaries have already been added and ignore those

            if (obj.hasOwnProperty(prop)) {

                for (lib in value) {
                    
                    if (!obj[prop].hasOwnProperty(lib)) obj[prop][lib] = value[lib];
                }
                return true;  
            }
        }

        //If the property has already been defined, ignore it
        if (obj.hasOwnProperty(prop)) return true

        //Otherwise add it to the object
        obj[prop] = value;
        return true;
    }
};