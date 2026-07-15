<script setup lang="ts">
const route = useRoute()

const routeName = computed(() => {
  const lastPath = route.path.split('/').filter(Boolean).pop()

  if (!lastPath)
    return 'Home'

  return lastPath
    .replaceAll('-', ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
})
</script>

<template>
  <header class="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4">
    <!-- Left: Sidebar toggle + breadcrumb -->
    <div class="flex min-w-0 items-center gap-3">
      <SidebarTrigger class="-ml-1" />

      <Separator orientation="vertical" class="h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              {{ routeName }}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <!-- Right: System name -->
    <div class="hidden min-w-0 items-center gap-3 text-right md:flex">
      <div class="leading-tight">
        <div class="truncate text-sm font-semibold text-foreground">
          ศูนย์บัญชาการสถานการณ์ฉุกเฉินและวิกฤติด้านน้ำมันเชื้อเพลิง
        </div>
        <div class="truncate text-xs text-muted-foreground">
          กรมธุรกิจพลังงาน กระทรวงพลังงาน
        </div>
      </div>
    </div>
  </header>
</template>