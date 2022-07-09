/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{ type: 'autogenerated', dirName: '.' }],

  // But you can create a sidebar manually

  docsSidebar: [
    'home',
    'fhir-basics',
    {
      type: 'category',
      label: 'Tutorials',
      link: { type: 'doc', id: 'tutorials/index' },
      items: [{ type: 'autogenerated', dirName: 'tutorials' }],
    },
    {
      type: 'category',
      label: 'API',
      link: { type: 'doc', id: 'api/index' },
      items: [
        {
          type: 'autogenerated',
          dirName: 'api',
        },
      ],
    },
    {
      type: 'category',
      label: 'SDK',
      link: { type: 'doc', id: 'sdk/index' },
      items: [
        { type: 'doc', id: 'sdk/classes/MedplumClient', label: 'MedplumClient' },
        { type: 'doc', id: 'sdk/modules', label: 'Utilities' },
        { 'Bot Utilities': ['sdk/classes/Hl7Message', 'sdk/interfaces/BotEvent'] },
        {
          'Media Utilities': {
            PDF: ['sdk/interfaces/CreatePdfFunction'],
            Email: ['sdk/interfaces/MailOptions', 'sdk/interfaces/MailAttachment', 'sdk/interfaces/MailAddress'],
          },
        },
      ],
    },
    {
      type: 'category',
      label: 'App',
      link: { type: 'doc', id: 'app/index' },
      items: [{ type: 'autogenerated', dirName: 'app' }],
    },
    {
      type: 'category',
      label: 'Contributing',
      link: { type: 'doc', id: 'contributing/index' },
      items: [{ type: 'autogenerated', dirName: 'contributing' }],
    },
    {
      type: 'category',
      label: 'Self-Hosting',
      link: { type: 'doc', id: 'self_hosting/index' },
      items: [{ type: 'autogenerated', dirName: 'self_hosting' }],
    },
    'security',
  ],
};

module.exports = sidebars;
