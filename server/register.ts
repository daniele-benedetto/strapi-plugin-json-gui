import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register({
    name: 'strapi-plugin-json-gui',
    plugin: 'strapi-plugin-json-gui',
    type: 'json',
  });
};