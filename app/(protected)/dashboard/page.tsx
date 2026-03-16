"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { CourierState, Priority } from "@/lib/types"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCourriers: 0,
    byState: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    byPriority: {} as Record<string, number>,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Fetching dashboard data from API...")
        // We fetch enough records to calculate general stats
        const [couriersRes, types, categories] = await Promise.all([
          api.getCouriers({ limit: 100 }),
          api.getTypes(),
          api.getCategories(),
        ])
        
        const courriers = couriersRes.data || []
        console.log("Successfully fetched courriers count:", courriers.length)

        const byState: Record<string, number> = {}
        const byType: Record<string, number> = {}
        const byCategory: Record<string, number> = {}
        const byPriority: Record<string, number> = {}

        Object.values(CourierState).forEach((state) => {
          byState[state] = 0
        })
        Object.values(Priority).forEach((priority) => {
          byPriority[priority] = 0
        })

        types.forEach((t: any) => {
           byType[t.label] = 0
        })
        categories.forEach((c: any) => {
           byCategory[c.label] = 0
        })

        courriers.forEach((c: any) => {
          byState[c.state] = (byState[c.state] || 0) + 1
          if (c.priority) {
             byPriority[c.priority] = (byPriority[c.priority] || 0) + 1
          }
          // The API might return relations for type and category
          const typeLabel = c.type?.label || 'Inconnu'
          const catLabel = c.category?.label || 'Inconnu'
          byType[typeLabel] = (byType[typeLabel] || 0) + 1
          byCategory[catLabel] = (byCategory[catLabel] || 0) + 1
        })

        setStats({
          totalCourriers: courriers.length,
          byState,
          byType,
          byCategory,
          byPriority,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const stateData = Object.entries(stats.byState).map(([state, count]) => ({
    name: state,
    value: count,
  })).filter(data => data.value > 0) // only show states that have items in chart

  const categoryData = Object.entries(stats.byCategory).map(([cat, count]) => ({
    name: cat,
    value: count,
  }))

  const typeData = Object.entries(stats.byType).map(([type, count]) => ({
    name: type,
    value: count,
  }))

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  const StatCard = ({
    title,
    value,
    description,
    color,
  }: {
    title: string
    value: number | string
    description?: string
    color?: string
  }) => (
    <Card className={color ? `border-l-4 ${color}` : ""}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )

  const hasData = stats.totalCourriers > 0;
  
  const EmptyStateFallback = () => (
    <div className="flex items-center justify-center h-[300px] text-muted-foreground border-2 border-dashed rounded-md bg-muted/20">
      <p>Aucune donnée disponible pour le moment.</p>
    </div>
  )

  return (
    <div className="flex-1 space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Bienvenue dans le système de gestion du courrier</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Courriers" value={stats.totalCourriers} color="border-l-primary" />
        <StatCard title="Nouveaux" value={stats.byState[CourierState.NEW] || 0} color="border-l-blue-500" />
        <StatCard title="En Cours" value={stats.byState[CourierState.IN_PROGRESS] || 0} color="border-l-yellow-500" />
        <StatCard title="Traités" value={stats.byState[CourierState.TREATED] || 0} color="border-l-green-500" />
        <StatCard title="Rejetés" value={stats.byState[CourierState.REJECTED] || 0} color="border-l-red-500" />
      </div>

      {/* Charts */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Chargement des statistiques...
        </div>
      ) : (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* États Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution par État</CardTitle>
            </CardHeader>
            <CardContent>
              {hasData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stateData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : <EmptyStateFallback />}
            </CardContent>
          </Card>

          {/* Categories Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution par Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              {hasData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : <EmptyStateFallback />}
            </CardContent>
          </Card>
        </div>

        {/* Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution par Type de Courrier</CardTitle>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyStateFallback />}
          </CardContent>
        </Card>
      </>
      )}
    </div>
  )
}
