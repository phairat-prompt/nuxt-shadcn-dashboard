<script setup lang="ts">
const route = useRoute()

// กำหนดหน้าแรกของระบบ
// ถ้าหน้าแผนที่เป็น route อื่น ให้เปลี่ยนเฉพาะค่านี้
const HOME_PATH = '/map'

const isHomePage = computed(() => {
  return route.path === HOME_PATH
})

const routeName = computed(() => {
  const lastPath = route.path
    .split('/')
    .filter(Boolean)
    .pop()

  if (!lastPath)
    return 'Home'

  return lastPath
    .replaceAll('-', ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
})
</script>

<template>
  <header
    class="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4"
  >
    <!-- Left: Sidebar toggle + breadcrumb -->
    <div class="flex min-w-0 items-center gap-3">
      <SidebarTrigger class="-ml-1" />

      <Separator
        orientation="vertical"
        class="h-4"
      />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as-child>
              <NuxtLink :to="HOME_PATH">
                Home
              </NuxtLink>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <!-- ไม่แสดง Home > Supply เมื่ออยู่หน้า Home -->
          <template v-if="!isHomePage">
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>
                {{ routeName }}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </template>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <!-- Right: System name -->
    <div
      class="hidden min-w-0 items-center gap-3 text-right md:flex"
    >
      <div class="leading-tight">
        <div
          class="truncate text-sm font-semibold text-foreground"
        >
          ศูนย์บัญชาการสถานการณ์ฉุกเฉินและวิกฤติด้านน้ำมันเชื้อเพลิง
        </div>

        <div
          class="truncate text-xs text-muted-foreground"
        >
          กรมธุรกิจพลังงาน กระทรวงพลังงาน
        </div>
      </div>
    </div>
  </header>
</template>