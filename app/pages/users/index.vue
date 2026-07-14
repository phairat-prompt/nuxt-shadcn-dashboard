<script setup lang="ts">
type UserStatus = 'Active' | 'Pending' | 'Suspended' | 'Inactive'

type User = {
  id: number
  name: string
  email: string
  role: string
  status: UserStatus
  lastLogin: string
}

const search = ref('')
const rowsPerPage = ref('15')
const currentPage = ref(1)
const selectedIds = ref<number[]>([])

const users = ref<User[]>([
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Nov 13, 2025, 04:45 PM',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.s@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: 'Nov 12, 2025, 10:20 PM',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    role: 'Viewer',
    status: 'Pending',
    lastLogin: 'Oct 01, 2025, 07:00 AM',
  },
  {
    id: 4,
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    role: 'Editor',
    status: 'Suspended',
    lastLogin: 'Sep 25, 2025, 05:00 PM',
  },
  {
    id: 5,
    name: 'Eve Adams',
    email: 'eve.a@example.com',
    role: 'Guest',
    status: 'Inactive',
    lastLogin: 'Aug 15, 2025, 03:30 PM',
  },
  {
    id: 6,
    name: 'Frank Miller',
    email: 'frank.m@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Nov 13, 2025, 03:05 PM',
  },
  {
    id: 7,
    name: 'Grace Hopper',
    email: 'grace.h@example.com',
    role: 'Viewer',
    status: 'Active',
    lastLogin: 'Nov 10, 2025, 06:40 PM',
  },
  {
    id: 8,
    name: 'Henry Ford',
    email: 'henry.f@example.com',
    role: 'Editor',
    status: 'Inactive',
    lastLogin: 'Jul 22, 2025, 09:10 PM',
  },
  {
    id: 9,
    name: 'Ivy Lee',
    email: 'ivy.l@example.com',
    role: 'Guest',
    status: 'Pending',
    lastLogin: 'Jun 30, 2025, 04:00 PM',
  },
  {
    id: 10,
    name: 'Jack Black',
    email: 'jack.b@example.com',
    role: 'Viewer',
    status: 'Suspended',
    lastLogin: 'May 18, 2025, 11:45 PM',
  },
  {
    id: 11,
    name: 'Karen White',
    email: 'karen.w@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Nov 13, 2025, 07:30 PM',
  },
  {
    id: 12,
    name: 'Leo King',
    email: 'leo.k@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: 'Nov 11, 2025, 08:15 PM',
  },
  {
    id: 13,
    name: 'Mona Lisa',
    email: 'mona.l@example.com',
    role: 'Viewer',
    status: 'Inactive',
    lastLogin: 'Apr 01, 2025, 02:20 PM',
  },
  {
    id: 14,
    name: 'Nina Simone',
    email: 'nina.s@example.com',
    role: 'Guest',
    status: 'Active',
    lastLogin: 'Mar 13, 2025, 01:00 AM',
  },
  {
    id: 15,
    name: 'Oscar Wilde',
    email: 'oscar.w@example.com',
    role: 'Editor',
    status: 'Pending',
    lastLogin: 'Mar 01, 2025, 04:10 AM',
  },
  {
    id: 16,
    name: 'Peter Parker',
    email: 'peter.p@example.com',
    role: 'Viewer',
    status: 'Active',
    lastLogin: 'Feb 15, 2025, 08:00 PM',
  },
  {
    id: 17,
    name: 'Queen Carter',
    email: 'queen.c@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Feb 02, 2025, 09:45 AM',
  },
  {
    id: 18,
    name: 'Rick Sanchez',
    email: 'rick.s@example.com',
    role: 'Editor',
    status: 'Inactive',
    lastLogin: 'Jan 21, 2025, 11:25 AM',
  },
  {
    id: 19,
    name: 'Sarah Connor',
    email: 'sarah.c@example.com',
    role: 'Viewer',
    status: 'Suspended',
    lastLogin: 'Jan 12, 2025, 06:30 PM',
  },
  {
    id: 20,
    name: 'Tony Stark',
    email: 'tony.s@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Jan 01, 2025, 12:00 PM',
  },
  {
    id: 21,
    name: 'Uma Thurman',
    email: 'uma.t@example.com',
    role: 'Guest',
    status: 'Pending',
    lastLogin: 'Dec 25, 2024, 10:00 AM',
  },
  {
    id: 22,
    name: 'Victor Stone',
    email: 'victor.s@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: 'Dec 18, 2024, 02:35 PM',
  },
  {
    id: 23,
    name: 'Wanda Maximoff',
    email: 'wanda.m@example.com',
    role: 'Viewer',
    status: 'Active',
    lastLogin: 'Dec 11, 2024, 05:45 PM',
  },
  {
    id: 24,
    name: 'Xavier Woods',
    email: 'xavier.w@example.com',
    role: 'Guest',
    status: 'Inactive',
    lastLogin: 'Dec 01, 2024, 01:10 PM',
  },
  {
    id: 25,
    name: 'Yara Greyjoy',
    email: 'yara.g@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: 'Nov 20, 2024, 03:30 PM',
  },
])

const perPage = computed(() => Number(rowsPerPage.value))

const filteredUsers = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword)
    return users.value

  return users.value.filter((user) => {
    return (
      user.name.toLowerCase().includes(keyword)
      || user.email.toLowerCase().includes(keyword)
      || user.role.toLowerCase().includes(keyword)
      || user.status.toLowerCase().includes(keyword)
    )
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredUsers.value.length / perPage.value))
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value

  return filteredUsers.value.slice(start, end)
})

const allCurrentPageSelected = computed(() => {
  if (!paginatedUsers.value.length)
    return false

  return paginatedUsers.value.every(user => selectedIds.value.includes(user.id))
})

watch(search, () => {
  currentPage.value = 1
})

watch(rowsPerPage, () => {
  currentPage.value = 1
})

function toggleSelectAll() {
  const pageIds = paginatedUsers.value.map(user => user.id)

  if (allCurrentPageSelected.value) {
    selectedIds.value = selectedIds.value.filter(id => !pageIds.includes(id))
    return
  }

  selectedIds.value = Array.from(new Set([...selectedIds.value, ...pageIds]))
}

function toggleSelectUser(id: number) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(selectedId => selectedId !== id)
    return
  }

  selectedIds.value = [...selectedIds.value, id]
}

function statusClass(status: UserStatus) {
  switch (status) {
    case 'Active':
      return 'status-active'
    case 'Pending':
      return 'status-pending'
    case 'Suspended':
      return 'status-suspended'
    case 'Inactive':
      return 'status-inactive'
    default:
      return 'status-inactive'
  }
}

function previousPage() {
  currentPage.value = Math.max(1, currentPage.value - 1)
}

function nextPage() {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1)
}

function firstPage() {
  currentPage.value = 1
}

function lastPage() {
  currentPage.value = totalPages.value
}
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          User Management
        </h2>
      </div>

      <div class="flex items-center space-x-2">
        <Input
          v-model="search"
          placeholder="Filter names..."
          class="filter-input"
        />

        <Button variant="outline" class="columns-button">
          Columns
          <Icon name="i-lucide-chevron-down" class="size-4" />
        </Button>
      </div>
    </div>

    <Card class="user-card border-0 shadow-none">
      <CardContent class="p-0">
        <div class="table-wrapper">
          <table class="user-table">
            <thead>
              <tr>
                <th class="checkbox-column">
                  <input
                    type="checkbox"
                    class="table-checkbox"
                    :checked="allCurrentPageSelected"
                    @change="toggleSelectAll"
                  />
                </th>

                <th>User Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>

                <th class="actions-column">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="user in paginatedUsers"
                :key="user.id"
              >
                <td class="checkbox-column">
                  <input
                    type="checkbox"
                    class="table-checkbox"
                    :checked="selectedIds.includes(user.id)"
                    @change="toggleSelectUser(user.id)"
                  />
                </td>

                <td class="font-medium">
                  {{ user.name }}
                </td>

                <td>
                  {{ user.email }}
                </td>

                <td>
                  {{ user.role }}
                </td>

                <td>
                  <Badge
                    variant="outline"
                    class="status-badge"
                    :class="statusClass(user.status)"
                  >
                    {{ user.status }}
                  </Badge>
                </td>

                <td>
                  {{ user.lastLogin }}
                </td>

                <td>
                  <div class="table-actions">
                    <Button variant="ghost" size="icon" class="action-icon">
                      <Icon name="i-lucide-pencil" class="size-4" />
                    </Button>

                    <Button variant="ghost" size="icon" class="action-icon">
                      <Icon name="i-lucide-trash-2" class="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>

              <tr v-if="!paginatedUsers.length">
                <td colspan="7" class="empty-row">
                  No users found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer">
          <div class="footer-left">
            <div class="rows-per-page">
              <span>Rows per page</span>

              <Select v-model="rowsPerPage">
                <SelectTrigger class="rows-select">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="10">
                    10
                  </SelectItem>
                  <SelectItem value="15">
                    15
                  </SelectItem>
                  <SelectItem value="25">
                    25
                  </SelectItem>
                  <SelectItem value="50">
                    50
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              {{ selectedIds.length }} of {{ users.length }} row(s) selected.
            </div>
          </div>

          <div class="footer-right">
            <div class="page-info">
              Page {{ currentPage }} of {{ totalPages }}
            </div>

            <div class="pagination-buttons">
              <Button
                variant="outline"
                size="icon"
                class="pagination-button"
                :disabled="currentPage === 1"
                @click="firstPage"
              >
                <Icon name="i-lucide-chevrons-left" class="size-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                class="pagination-button"
                :disabled="currentPage === 1"
                @click="previousPage"
              >
                <Icon name="i-lucide-chevron-left" class="size-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                class="pagination-button"
                :disabled="currentPage === totalPages"
                @click="nextPage"
              >
                <Icon name="i-lucide-chevron-right" class="size-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                class="pagination-button"
                :disabled="currentPage === totalPages"
                @click="lastPage"
              >
                <Icon name="i-lucide-chevrons-right" class="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
.user-card {
  border: 0 !important;
  border-radius: 0;
  box-shadow: none !important;
  background: transparent;
}

.filter-input {
  width: 360px;
  height: 40px;
  border-radius: 10px;
}

.columns-button {
  height: 40px;
  gap: 8px;
  border-radius: 10px;
}

.table-wrapper {
  overflow-x: auto;
  padding: 0;
}

.user-table {
  width: 100%;
  min-width: 980px;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.user-table thead th {
  height: 42px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  color: var(--muted-foreground);
  font-weight: 500;
  text-align: left;
  padding: 0 16px;
  white-space: nowrap;
}

.user-table thead th:first-child {
  border-left: 1px solid var(--border);
  border-top-left-radius: 8px;
}

.user-table thead th:last-child {
  border-right: 1px solid var(--border);
  border-top-right-radius: 8px;
}

.user-table tbody td {
  height: 52px;
  border-bottom: 1px solid var(--border);
  padding: 0 16px;
  white-space: nowrap;
  color: var(--foreground);
}

.user-table tbody tr:hover td {
  background: color-mix(in oklab, var(--muted) 40%, transparent);
}

.user-table tbody td:first-child {
  border-left: 1px solid var(--border);
}

.user-table tbody td:last-child {
  border-right: 1px solid var(--border);
}

.user-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}

.user-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}

.checkbox-column {
  width: 44px;
  padding-left: 12px !important;
  padding-right: 8px !important;
}

.actions-column {
  text-align: center !important;
}

.table-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--primary);
}

.status-badge {
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  border-color: #bbf7d0;
  background: #dcfce7;
  color: #16a34a;
}

.status-pending {
  border-color: #fde68a;
  background: #fef3c7;
  color: #d97706;
}

.status-suspended {
  border-color: #fecdd3;
  background: #ffe4e6;
  color: #e11d48;
}

.status-inactive {
  border-color: #e2e8f0;
  background: #f1f5f9;
  color: #64748b;
}

.table-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.action-icon {
  width: 32px;
  height: 32px;
}

.empty-row {
  height: 160px !important;
  text-align: center;
  color: var(--muted-foreground) !important;
}

.table-footer {
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0 0;
  color: var(--muted-foreground);
  font-size: 14px;
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
  gap: 32px;
}

.rows-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rows-select {
  width: 70px;
  height: 36px;
  border-radius: 10px;
}

.page-info {
  color: var(--foreground);
  font-weight: 500;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-button {
  width: 36px;
  height: 36px;
  border-radius: 10px;
}

@media (max-width: 1024px) {
  .filter-input {
    width: 100%;
  }

  .table-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .footer-left,
  .footer-right {
    justify-content: space-between;
  }
}

@media (max-width: 640px) {
  .table-footer {
    gap: 12px;
  }

  .footer-left,
  .footer-right {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .pagination-buttons {
    justify-content: flex-end;
  }
}
</style>