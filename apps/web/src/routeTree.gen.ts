/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthIndexImport } from './routes/auth/index'
import { Route as AuthRegisterImport } from './routes/auth/register'
import { Route as authenticatedLayoutAuthImport } from './routes/(authenticated)/_layout-auth'
import { Route as authenticatedLayoutAuthIndexImport } from './routes/(authenticated)/_layout-auth/index'
import { Route as authenticatedLayoutAuthLayoutSettingsImport } from './routes/(authenticated)/_layout-auth/_layout-settings'
import { Route as authenticatedLayoutAuthFilesIndexImport } from './routes/(authenticated)/_layout-auth/files/index'
import { Route as authenticatedLayoutAuthArticlesIndexImport } from './routes/(authenticated)/_layout-auth/articles/index'
import { Route as authenticatedLayoutAuthArticlesCreateArticleImport } from './routes/(authenticated)/_layout-auth/articles/create-article'
import { Route as authenticatedLayoutAuthArticlesArticleIdImport } from './routes/(authenticated)/_layout-auth/articles/$articleId'
import { Route as authenticatedLayoutAuthLayoutSettingsSettingsIndexImport } from './routes/(authenticated)/_layout-auth/_layout-settings/settings/index'
import { Route as authenticatedLayoutAuthLayoutSettingsSettingsSocialAccountsImport } from './routes/(authenticated)/_layout-auth/_layout-settings/settings/social-accounts'
import { Route as authenticatedLayoutAuthLayoutSettingsSettingsApperanceImport } from './routes/(authenticated)/_layout-auth/_layout-settings/settings/apperance'

// Create Virtual Routes

const authenticatedImport = createFileRoute('/(authenticated)')()

// Create/Update Routes

const authenticatedRoute = authenticatedImport.update({
  id: '/(authenticated)',
  getParentRoute: () => rootRoute,
} as any)

const AuthIndexRoute = AuthIndexImport.update({
  path: '/auth/',
  getParentRoute: () => rootRoute,
} as any)

const AuthRegisterRoute = AuthRegisterImport.update({
  path: '/auth/register',
  getParentRoute: () => rootRoute,
} as any)

const authenticatedLayoutAuthRoute = authenticatedLayoutAuthImport.update({
  id: '/_layout-auth',
  getParentRoute: () => authenticatedRoute,
} as any)

const authenticatedLayoutAuthIndexRoute =
  authenticatedLayoutAuthIndexImport.update({
    path: '/',
    getParentRoute: () => authenticatedLayoutAuthRoute,
  } as any)

const authenticatedLayoutAuthLayoutSettingsRoute =
  authenticatedLayoutAuthLayoutSettingsImport.update({
    id: '/_layout-settings',
    getParentRoute: () => authenticatedLayoutAuthRoute,
  } as any)

const authenticatedLayoutAuthFilesIndexRoute =
  authenticatedLayoutAuthFilesIndexImport.update({
    path: '/files/',
    getParentRoute: () => authenticatedLayoutAuthRoute,
  } as any)

const authenticatedLayoutAuthArticlesIndexRoute =
  authenticatedLayoutAuthArticlesIndexImport.update({
    path: '/articles/',
    getParentRoute: () => authenticatedLayoutAuthRoute,
  } as any)

const authenticatedLayoutAuthArticlesCreateArticleRoute =
  authenticatedLayoutAuthArticlesCreateArticleImport.update({
    path: '/articles/create-article',
    getParentRoute: () => authenticatedLayoutAuthRoute,
  } as any)

const authenticatedLayoutAuthArticlesArticleIdRoute =
  authenticatedLayoutAuthArticlesArticleIdImport.update({
    path: '/articles/$articleId',
    getParentRoute: () => authenticatedLayoutAuthRoute,
  } as any)

const authenticatedLayoutAuthLayoutSettingsSettingsIndexRoute =
  authenticatedLayoutAuthLayoutSettingsSettingsIndexImport.update({
    path: '/settings/',
    getParentRoute: () => authenticatedLayoutAuthLayoutSettingsRoute,
  } as any)

const authenticatedLayoutAuthLayoutSettingsSettingsSocialAccountsRoute =
  authenticatedLayoutAuthLayoutSettingsSettingsSocialAccountsImport.update({
    path: '/settings/social-accounts',
    getParentRoute: () => authenticatedLayoutAuthLayoutSettingsRoute,
  } as any)

const authenticatedLayoutAuthLayoutSettingsSettingsApperanceRoute =
  authenticatedLayoutAuthLayoutSettingsSettingsApperanceImport.update({
    path: '/settings/apperance',
    getParentRoute: () => authenticatedLayoutAuthLayoutSettingsRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/(authenticated)': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authenticatedImport
      parentRoute: typeof rootRoute
    }
    '/(authenticated)/_layout-auth': {
      id: '/_layout-auth'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authenticatedLayoutAuthImport
      parentRoute: typeof authenticatedRoute
    }
    '/auth/register': {
      id: '/auth/register'
      path: '/auth/register'
      fullPath: '/auth/register'
      preLoaderRoute: typeof AuthRegisterImport
      parentRoute: typeof rootRoute
    }
    '/auth/': {
      id: '/auth/'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthIndexImport
      parentRoute: typeof rootRoute
    }
    '/(authenticated)/_layout-auth/_layout-settings': {
      id: '/_layout-auth/_layout-settings'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof authenticatedLayoutAuthLayoutSettingsImport
      parentRoute: typeof authenticatedLayoutAuthImport
    }
    '/(authenticated)/_layout-auth/': {
      id: '/_layout-auth/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authenticatedLayoutAuthIndexImport
      parentRoute: typeof authenticatedLayoutAuthImport
    }
    '/(authenticated)/_layout-auth/articles/$articleId': {
      id: '/_layout-auth/articles/$articleId'
      path: '/articles/$articleId'
      fullPath: '/articles/$articleId'
      preLoaderRoute: typeof authenticatedLayoutAuthArticlesArticleIdImport
      parentRoute: typeof authenticatedLayoutAuthImport
    }
    '/(authenticated)/_layout-auth/articles/create-article': {
      id: '/_layout-auth/articles/create-article'
      path: '/articles/create-article'
      fullPath: '/articles/create-article'
      preLoaderRoute: typeof authenticatedLayoutAuthArticlesCreateArticleImport
      parentRoute: typeof authenticatedLayoutAuthImport
    }
    '/(authenticated)/_layout-auth/articles/': {
      id: '/_layout-auth/articles/'
      path: '/articles'
      fullPath: '/articles'
      preLoaderRoute: typeof authenticatedLayoutAuthArticlesIndexImport
      parentRoute: typeof authenticatedLayoutAuthImport
    }
    '/(authenticated)/_layout-auth/files/': {
      id: '/_layout-auth/files/'
      path: '/files'
      fullPath: '/files'
      preLoaderRoute: typeof authenticatedLayoutAuthFilesIndexImport
      parentRoute: typeof authenticatedLayoutAuthImport
    }
    '/(authenticated)/_layout-auth/_layout-settings/settings/apperance': {
      id: '/_layout-auth/_layout-settings/settings/apperance'
      path: '/settings/apperance'
      fullPath: '/settings/apperance'
      preLoaderRoute: typeof authenticatedLayoutAuthLayoutSettingsSettingsApperanceImport
      parentRoute: typeof authenticatedLayoutAuthLayoutSettingsImport
    }
    '/(authenticated)/_layout-auth/_layout-settings/settings/social-accounts': {
      id: '/_layout-auth/_layout-settings/settings/social-accounts'
      path: '/settings/social-accounts'
      fullPath: '/settings/social-accounts'
      preLoaderRoute: typeof authenticatedLayoutAuthLayoutSettingsSettingsSocialAccountsImport
      parentRoute: typeof authenticatedLayoutAuthLayoutSettingsImport
    }
    '/(authenticated)/_layout-auth/_layout-settings/settings/': {
      id: '/_layout-auth/_layout-settings/settings/'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof authenticatedLayoutAuthLayoutSettingsSettingsIndexImport
      parentRoute: typeof authenticatedLayoutAuthLayoutSettingsImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  authenticatedRoute: authenticatedRoute.addChildren({
    authenticatedLayoutAuthRoute: authenticatedLayoutAuthRoute.addChildren({
      authenticatedLayoutAuthLayoutSettingsRoute:
        authenticatedLayoutAuthLayoutSettingsRoute.addChildren({
          authenticatedLayoutAuthLayoutSettingsSettingsApperanceRoute,
          authenticatedLayoutAuthLayoutSettingsSettingsSocialAccountsRoute,
          authenticatedLayoutAuthLayoutSettingsSettingsIndexRoute,
        }),
      authenticatedLayoutAuthIndexRoute,
      authenticatedLayoutAuthArticlesArticleIdRoute,
      authenticatedLayoutAuthArticlesCreateArticleRoute,
      authenticatedLayoutAuthArticlesIndexRoute,
      authenticatedLayoutAuthFilesIndexRoute,
    }),
  }),
  AuthRegisterRoute,
  AuthIndexRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/auth/register",
        "/auth/"
      ]
    },
    "/": {
      "filePath": "(authenticated)",
      "children": [
        "/_layout-auth"
      ]
    },
    "/_layout-auth": {
      "filePath": "(authenticated)/_layout-auth.tsx",
      "parent": "/",
      "children": [
        "/_layout-auth/_layout-settings",
        "/_layout-auth/",
        "/_layout-auth/articles/$articleId",
        "/_layout-auth/articles/create-article",
        "/_layout-auth/articles/",
        "/_layout-auth/files/"
      ]
    },
    "/auth/register": {
      "filePath": "auth/register.tsx"
    },
    "/auth/": {
      "filePath": "auth/index.tsx"
    },
    "/_layout-auth/_layout-settings": {
      "filePath": "(authenticated)/_layout-auth/_layout-settings.tsx",
      "parent": "/_layout-auth",
      "children": [
        "/_layout-auth/_layout-settings/settings/apperance",
        "/_layout-auth/_layout-settings/settings/social-accounts",
        "/_layout-auth/_layout-settings/settings/"
      ]
    },
    "/_layout-auth/": {
      "filePath": "(authenticated)/_layout-auth/index.tsx",
      "parent": "/_layout-auth"
    },
    "/_layout-auth/articles/$articleId": {
      "filePath": "(authenticated)/_layout-auth/articles/$articleId.tsx",
      "parent": "/_layout-auth"
    },
    "/_layout-auth/articles/create-article": {
      "filePath": "(authenticated)/_layout-auth/articles/create-article.tsx",
      "parent": "/_layout-auth"
    },
    "/_layout-auth/articles/": {
      "filePath": "(authenticated)/_layout-auth/articles/index.tsx",
      "parent": "/_layout-auth"
    },
    "/_layout-auth/files/": {
      "filePath": "(authenticated)/_layout-auth/files/index.tsx",
      "parent": "/_layout-auth"
    },
    "/_layout-auth/_layout-settings/settings/apperance": {
      "filePath": "(authenticated)/_layout-auth/_layout-settings/settings/apperance.tsx",
      "parent": "/_layout-auth/_layout-settings"
    },
    "/_layout-auth/_layout-settings/settings/social-accounts": {
      "filePath": "(authenticated)/_layout-auth/_layout-settings/settings/social-accounts.tsx",
      "parent": "/_layout-auth/_layout-settings"
    },
    "/_layout-auth/_layout-settings/settings/": {
      "filePath": "(authenticated)/_layout-auth/_layout-settings/settings/index.tsx",
      "parent": "/_layout-auth/_layout-settings"
    }
  }
}
ROUTE_MANIFEST_END */
