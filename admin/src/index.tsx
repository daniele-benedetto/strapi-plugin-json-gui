import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import JsonGuiIcon from './components/JsonGuiIcon';
import getTrad from './utils/getTrad';

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.customFields.register({
      name: 'strapi-plugin-json-gui',
      pluginId: 'strapi-plugin-json-gui',
      type: 'json',
      icon: JsonGuiIcon,
      intlLabel: {
        id: getTrad('strapi-plugin-json-gui.label'),
        defaultMessage: 'JsonGui',
      },
      intlDescription: {
        id: getTrad('strapi-plugin-json-gui.description'),
        defaultMessage: "Json Gui for building complex json objects",
      },
      components: {
        Input: async () =>
          import('./components/JsonGui')
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'form.attribute.item.requiredField.description',
                  defaultMessage:
                    "You won't be able to create an entry if this field is empty",
                },
              },
              {
                name: 'private',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.private',
                  defaultMessage: 'Private field',
                },
                description: {
                  id: 'form.attribute.item.private.description',
                  defaultMessage:
                    'This field will not show up in the API response',
                },
              },
            ],
          },
        ],
      },
    });
  },

  bootstrap(app: any) {},

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
