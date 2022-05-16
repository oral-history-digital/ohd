require('dotenv').config();

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  config.env.ohdProdUsername  = process.env.OHD_PROD_USERNAME;
  config.env.ohdProdPassword  = process.env.OHD_PROD_PASSWORD;
  config.env.ohdStageUsername = process.env.OHD_STAGE_USERNAME;
  config.env.ohdStagePassword = process.env.OHD_STAGE_PASSWORD;
  config.env.evProdUsername   = process.env.EV_PROD_USERNAME;
  config.env.evProdPassword   = process.env.EV_PROD_PASSWORD;
  config.env.egStageUsername  = process.env.EG_STAGE_USERNAME;
  config.env.egStagePassword  = process.env.EG_STAGE_PASSWORD;

  return config;
}
