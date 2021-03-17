import camelCase from 'lodash/camelCase';

const requireModule = require.context('.',false, /\.js$/);
const modules = {};

// 자동으로 로드하지 않을것
const ignore = ['./index.js', './vuetify.js'];

requireModule.keys().forEach(filename => {
    if(ignore.indexOf(filename) < 0) {
		const moduleName = camelCase(filename.replace(/(\.\/|\.js)/g,''));
		modules[moduleName] = requireModule(filename);
    }
}); 

export default modules;