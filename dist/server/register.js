"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => {
    strapi.customFields.register({
        name: 'json-gui',
        plugin: 'json-gui',
        type: 'json',
    });
};
