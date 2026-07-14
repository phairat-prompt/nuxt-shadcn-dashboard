<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import { TrendingDown, TrendingUp, TrendingUpIcon } from 'lucide-vue-next'

const dataCard = ref({
  totalRevenue: 0,
  newCustomers: 0,
  activeAccount: 0,
  growthRate: 0,
})

onMounted(() => {
  dataCard.value = {
    totalRevenue: 1250.44,
    newCustomers: 1234,
    activeAccount: 45678,
    growthRate: 4.5,
  }
})

const timeRange = ref('30d')

const isDesktop = useMediaQuery('(min-width: 768px)')

watch(isDesktop, () => {
  if (isDesktop.value) {
    timeRange.value = '30d'
  }
  else {
    timeRange.value = '7d'
  }
}, { immediate: true })
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          Overview
        </h2>
        <!-- <p class="text-sm text-muted-foreground">
          Overview analytics and performance summary
        </p> -->
      </div>

      <div class="flex items-center space-x-2">
        <BaseDateRangePicker />

        <!-- <Button class="bg-primary text-primary-foreground hover:bg-primary/90">
          Download
        </Button> -->
      </div>
    </div>

    <main class="@container/main flex flex-1 flex-col gap-4 md:gap-8">
      <!-- KPI Cards -->
      <div
        class="grid grid-cols-1 gap-4
        *:data-[slot=card]:bg-gradient-to-t
        *:data-[slot=card]:from-primary/10
        *:data-[slot=card]:to-card
        *:data-[slot=card]:shadow-xs
        @xl/main:grid-cols-2
        @5xl/main:grid-cols-4"
      >
        <!-- Total Revenue -->
        <Card class="@container/card border-primary/10">
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>

            <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <NumberFlow
                :value="dataCard.totalRevenue"
                :format="{
                  style: 'currency',
                  currency: 'USD',
                  trailingZeroDisplay: 'stripIfInteger',
                }"
              />
            </CardTitle>

            <CardAction>
              <Badge
                variant="outline"
                class="border-primary/20 bg-primary/10 text-primary"
              >
                <TrendingUpIcon class="size-3.5" />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>

          <CardFooter class="flex-col items-start gap-1.5 text-sm">
            <div class="line-clamp-1 flex gap-2 font-medium">
              Trending up this month
              <TrendingUp class="size-4 text-primary" />
            </div>
            <div class="text-muted-foreground">
              Visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>

        <!-- New Customers -->
        <Card class="@container/card border-primary/10">
          <CardHeader>
            <CardDescription>New Customers</CardDescription>

            <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <NumberFlow :value="dataCard.newCustomers" />
            </CardTitle>

            <CardAction>
              <Badge
                variant="outline"
                class="border-primary/20 bg-primary/10 text-primary"
              >
                <TrendingDown class="size-3.5" />
                -20%
              </Badge>
            </CardAction>
          </CardHeader>

          <CardFooter class="flex-col items-start gap-1.5 text-sm">
            <div class="line-clamp-1 flex gap-2 font-medium">
              Down 20% this period
              <TrendingDown class="size-4 text-primary" />
            </div>
            <div class="text-muted-foreground">
              Acquisition needs attention
            </div>
          </CardFooter>
        </Card>

        <!-- Active Accounts -->
        <Card class="@container/card border-primary/10">
          <CardHeader>
            <CardDescription>Active Accounts</CardDescription>

            <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <NumberFlow :value="dataCard.activeAccount" />
            </CardTitle>

            <CardAction>
              <Badge
                variant="outline"
                class="border-primary/20 bg-primary/10 text-primary"
              >
                <TrendingUp class="size-3.5" />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>

          <CardFooter class="flex-col items-start gap-1.5 text-sm">
            <div class="line-clamp-1 flex gap-2 font-medium">
              Strong user retention
              <TrendingUp class="size-4 text-primary" />
            </div>
            <div class="text-muted-foreground">
              Engagement exceed targets
            </div>
          </CardFooter>
        </Card>

        <!-- Growth Rate -->
        <Card class="@container/card border-primary/10">
          <CardHeader>
            <CardDescription>Growth Rate</CardDescription>

            <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <NumberFlow
                :value="dataCard.growthRate"
                suffix="%"
              />
            </CardTitle>

            <CardAction>
              <Badge
                variant="outline"
                class="border-primary/20 bg-primary/10 text-primary"
              >
                <TrendingUp class="size-3.5" />
                +4.5%
              </Badge>
            </CardAction>
          </CardHeader>

          <CardFooter class="flex-col items-start gap-1.5 text-sm">
            <div class="line-clamp-1 flex gap-2 font-medium">
              Steady performance increase
              <TrendingUp class="size-4 text-primary" />
            </div>
            <div class="text-muted-foreground">
              Meets growth projections
            </div>
          </CardFooter>
        </Card>
      </div>

      <!-- Chart Card -->
      <Card class="@container/card border-primary/10">
        <CardHeader>
          <CardTitle>Total Visitors</CardTitle>

          <CardDescription>
            <span class="hidden @[540px]/card:block">
              Total for the last 3 months
            </span>
            <span class="@[540px]/card:hidden">
              Last 3 months
            </span>
          </CardDescription>

          <CardAction>
            <ToggleGroup
              v-model="timeRange"
              type="single"
              variant="outline"
              class="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem
                value="90d"
                class="data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
              >
                Last 3 months
              </ToggleGroupItem>

              <ToggleGroupItem
                value="30d"
                class="data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
              >
                Last 30 days
              </ToggleGroupItem>

              <ToggleGroupItem
                value="7d"
                class="data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
              >
                Last 7 days
              </ToggleGroupItem>
            </ToggleGroup>

            <Select v-model="timeRange">
              <SelectTrigger
                class="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>

              <SelectContent class="rounded-xl">
                <SelectItem value="90d" class="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" class="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" class="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>

        <CardContent>
          <DashboardTotalVisitors :time-range="timeRange" />
        </CardContent>
      </Card>
    </main>
  </div>
</template>