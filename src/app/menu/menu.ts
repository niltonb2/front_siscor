import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    translate: 'MENU.DASHBOARD',
    type: 'item',
    icon: 'activity',
    url: 'dashboard'
  },
  {
    id: 'estabelecimentos',
    title: 'estabelecimentos',
    translate: 'MENU.ESTABELECIMENTOS',
    type: 'item',
    icon: 'trello',
    url: 'estabelecimento'
  },
  {
    id: 'clientes',
    title: 'clientes',
    translate: 'MENU.CLIENTES',
    type: 'item',
    icon: 'users',
    url: 'cliente'
  },
  {
    id: 'cobranca',
    title: 'cobranca',
    translate: 'MENU.COBRANCA',
    type: 'item',
    icon: 'dollar-sign',
    url: 'cobranca'
  },
  {
    id: 'assinatura',
    title: 'assinatura',
    translate: 'MENU.ASSINATURA.SECTION',
    type: 'collapsible',
    icon: 'clipboard',
    children: [
      {
        id: 'produto',
        title: 'produto',
        translate: 'MENU.ASSINATURA.PRODUTO',
        type: 'item',
        icon: 'circle',
        url: 'produto'
      },
      {
        id: 'plano',
        title: 'plano',
        translate: 'MENU.ASSINATURA.PLANO',
        type: 'item',
        icon: 'circle',
        url: 'plano'
      },
      {
        id: 'nova_assinatura',
        title: 'nova_assinatura',
        translate: 'MENU.ASSINATURA.NOVA_ASSINATURA',
        type: 'item',
        icon: 'circle',
        url: 'assinatura'
      }
    ]
  },
  {
    id: 'config',
    title: 'config',
    translate: 'MENU.CONFIG.SECTION',
    type: 'collapsible',
    icon: 'settings',
    children: [
      {
        id: 'templates',
        title: 'tamplates',
        translate: 'MENU.CONFIG.TEMPLATES',
        type: 'item',
        icon: 'circle',
        url: 'templates'
      }
    ]
  }
]
