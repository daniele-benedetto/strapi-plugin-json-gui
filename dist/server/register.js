"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => {
    strapi.customFields.register({
        name: 'strapi-plugin-json-gui',
        plugin: 'strapi-plugin-json-gui',
        type: 'json',
    });
};
