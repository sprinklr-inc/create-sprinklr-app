export const manifestObjects = [
  {
    name: 'testApp',
    version: '0.1.0',
    integrationType: 'CONTAINERIZED',
    pages: [
      {
        id: 'to-do',
        title: 'To Do',
        url: '/todo',
      },
    ],
  },
  {
    name: 'testApp',
    version: '0.1.0',
    pages: [
      {
        id: 'to-do',
        title: 'To Do',
        url: '/todo',
      },
    ],
  },
  {
    name: 'testApp',
    version: '0.1.0',
    integrationType: 'VIRTUALIZED',
    pages: [
      {
        id: 'to-do',
        title: 'To Do',
        url: '/todo',
      },
    ],
  },
  {
    name: 'testApp',
    version: '0.1.0',
    integrationType: 'VIRTUALIZED',
    widgets: [
      {
        id: 'to-do',
        title: 'To Do',
        url: '/todo',
      },
    ],
  },
  {
    name: '',
    version: '0.1.0',
    basePath: 'http://localhost:3000',
    integrationType: 'VIRTUALIZED',
    widgets: [
      {
        id: 'todo',
        title: 'Todo List',
        url: '/todo',
        scopes: ['RECORD_PAGE'],
      },
    ],
  },
];
