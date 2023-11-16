import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register({
    name: 'json-gui',
    plugin: 'json-gui',
    type: 'json',
  });
};