<script setup lang="ts">
import type { NavGroup, NavLink, NavSectionTitle } from '~/types/nav'
import { navMenu, navMenuBottom } from '~/constants/menus'

// ถ้า logo อยู่ใน app/assets/moe.png
// import Logo from '~/assets/prompt.png'
import Logo from '~/assets/moe.png'

function resolveNavItemComponent(item: NavLink | NavGroup | NavSectionTitle): any {
  if ('children' in item)
    return resolveComponent('LayoutSidebarNavGroup')

  return resolveComponent('LayoutSidebarNavLink')
}

const appInfo = {
  name: 'Warroom',
  subtitle: 'กรมธุรกิจพลังงาน',
  logo: Logo,
}

// const appInfo = {
//   name: 'WARROOM',
//   subtitle: 'กรมธุรกิจพลังงาน',
//   logo: Logo,
// }

const user: {
  name: string
  email: string
  avatar: string
} = {
  name: 'Admin',
  email: 'admin@prompt.co.th',
  avatar: '/avatars/avatartion.png',
}

const { sidebar } = useAppSettings()
</script>

<template>
  <Sidebar :collapsible="sidebar?.collapsible" :side="sidebar?.side" :variant="sidebar?.variant">
    <SidebarHeader class="border-b pb-3">
      <!-- Static App Header: Logo + System Name -->
      <div class="flex items-center gap-3 px-2 py-2">
        <div class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-background">
          <img :src="appInfo.logo" alt="DOEB" class="size-8 object-contain">
        </div>

        <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
          <span class="truncate font-semibold">
            {{ appInfo.name }}
          </span>
          <span class="truncate text-xs text-muted-foreground">
            {{ appInfo.subtitle }}
          </span>
        </div>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup v-for="(nav, indexGroup) in navMenu" :key="indexGroup">
        <SidebarGroupLabel v-if="nav.heading">
          {{ nav.heading }}
        </SidebarGroupLabel>

        <component :is="resolveNavItemComponent(item)" v-for="(item, index) in nav.items" :key="index" :item="item" />
      </SidebarGroup>

      <!-- <SidebarGroup class="mt-auto">
        <component :is="resolveNavItemComponent(item)" v-for="(item, index) in navMenuBottom" :key="index" :item="item"
          size="sm" />
      </SidebarGroup> -->
    </SidebarContent>

    <SidebarFooter>
      <LayoutSidebarNavFooter :user="user" />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>