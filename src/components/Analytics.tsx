'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  Sparkles,
  Moon,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Crown
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

// Mock data for charts
const readingsData = [
  { name: 'Lun', tarot: 65, oracle: 28, runes: 12 },
  { name: 'Mar', tarot: 78, oracle: 35, runes: 18 },
  { name: 'Mié', tarot: 82, oracle: 40, runes: 22 },
  { name: 'Jue', tarot: 91, oracle: 42, runes: 25 },
  { name: 'Vie', tarot: 105, oracle: 48, runes: 30 },
  { name: 'Sáb', tarot: 142, oracle: 62, runes: 38 },
  { name: 'Dom', tarot: 168, oracle: 75, runes: 45 },
]

const usersData = [
  { name: 'Ene', total: 2400, active: 1800, new: 600 },
  { name: 'Feb', total: 2800, active: 2200, new: 400 },
  { name: 'Mar', total: 3200, active: 2500, new: 400 },
  { name: 'Abr', total: 3800, active: 2900, new: 600 },
  { name: 'May', total: 4500, active: 3400, new: 700 },
  { name: 'Jun', total: 5200, active: 3900, new: 700 },
]

const revenueData = [
  { name: 'Ene', value: 4500 },
  { name: 'Feb', value: 5200 },
  { name: 'Mar', value: 6100 },
  { name: 'Abr', value: 7800 },
  { name: 'May', value: 9200 },
  { name: 'Jun', value: 10500 },
]

const subscriptionData = [
  { name: 'Gratis', value: 3200, color: '#6b7280' },
  { name: 'Premium', value: 1850, color: '#fbbf24' },
  { name: 'Admin', value: 50, color: '#ef4444' },
]

const readingTypesData = [
  { name: 'Tarot', value: 45 },
  { name: 'Oráculo', value: 25 },
  { name: 'Runas', value: 15 },
  { name: 'Astrología', value: 10 },
  { name: 'Otros', value: 5 },
]

const chartConfig = {
  tarot: {
    label: 'Tarot',
    color: '#a78bfa',
  },
  oracle: {
    label: 'Oráculo',
    color: '#fbbf24',
  },
  runes: {
    label: 'Runas',
    color: '#60a5fa',
  },
  total: {
    label: 'Total',
    color: '#a78bfa',
  },
  active: {
    label: 'Activos',
    color: '#34d399',
  },
  new: {
    label: 'Nuevos',
    color: '#fbbf24',
  },
  value: {
    label: 'Valor',
    color: '#a78bfa',
  },
}

interface StatCardProps {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ElementType
  color: string
}

function StatCard({ title, value, change, changeLabel, icon: Icon, color }: StatCardProps) {
  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden"
    >
      <Card className="bg-mystica-dark-200/80 border-mystica-purple-800/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">{title}</p>
              <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <div className={cn(
              "flex items-center gap-1 text-sm",
              isPositive ? "text-green-400" : "text-red-400"
            )}>
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
            <span className="text-xs text-gray-500">{changeLabel}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Analytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Usuarios Totales"
          value="5,100"
          change={12.5}
          changeLabel="vs mes anterior"
          icon={Users}
          color="#a78bfa"
        />
        <StatCard
          title="Lecturas Hoy"
          value="356"
          change={8.2}
          changeLabel="vs ayer"
          icon={Sparkles}
          color="#fbbf24"
        />
        <StatCard
          title="Ingresos Mensuales"
          value="$10,500"
          change={15.3}
          changeLabel="vs mes anterior"
          icon={DollarSign}
          color="#34d399"
        />
        <StatCard
          title="Usuarios Premium"
          value="1,850"
          change={22.1}
          changeLabel="vs mes anterior"
          icon={Crown}
          color="#f472b6"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Readings Chart */}
        <Card className="bg-mystica-dark-200/80 border-mystica-purple-800/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-mystica-purple-400" />
              Lecturas por Día
            </CardTitle>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as typeof timeRange)}
                  className={cn(
                    "px-3 py-1 text-xs rounded-lg transition-all",
                    timeRange === range
                      ? "bg-mystica-purple-600 text-white"
                      : "bg-mystica-dark-100 text-gray-400 hover:text-white"
                  )}
                >
                  {range === 'week' ? 'Semana' : range === 'month' ? 'Mes' : 'Año'}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <AreaChart data={readingsData}>
                <defs>
                  <linearGradient id="colorTarot" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOracle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="tarot"
                  stroke="#a78bfa"
                  fillOpacity={1}
                  fill="url(#colorTarot)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="oracle"
                  stroke="#fbbf24"
                  fillOpacity={1}
                  fill="url(#colorOracle)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-mystica-purple-400" />
                <span className="text-xs text-gray-400">Tarot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-mystica-gold-400" />
                <span className="text-xs text-gray-400">Oráculo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-xs text-gray-400">Runas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Chart */}
        <Card className="bg-mystica-dark-200/80 border-mystica-purple-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              Crecimiento de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="total" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="active" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="new" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-mystica-purple-400" />
                <span className="text-xs text-gray-400">Total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-xs text-gray-400">Activos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-mystica-gold-400" />
                <span className="text-xs text-gray-400">Nuevos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="bg-mystica-dark-200/80 border-mystica-purple-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-mystica-gold-400" />
              Ingresos Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#a78bfa" 
                  strokeWidth={3}
                  dot={{ fill: '#a78bfa', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#a78bfa' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Subscription Distribution */}
        <Card className="bg-mystica-dark-200/80 border-mystica-purple-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              Distribución de Suscripciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subscriptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #4c1d95',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [value.toLocaleString(), 'Usuarios']}
                  />
                  <Legend 
                    verticalAlign="bottom"
                    formatter={(value) => (
                      <span className="text-gray-400 text-sm">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Stats below chart */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-mystica-purple-800/30">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-400">3,200</p>
                <p className="text-xs text-gray-500">Gratis</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">1,850</p>
                <p className="text-xs text-gray-500">Premium</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">50</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reading Types Distribution */}
      <Card className="bg-mystica-dark-200/80 border-mystica-purple-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Moon className="w-5 h-5 text-mystica-purple-400" />
            Tipos de Lectura Populares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {readingTypesData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-20 text-sm text-gray-400">{item.name}</div>
                <div className="flex-1 h-3 bg-mystica-dark-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, #7c3aed, #a78bfa)`
                    }}
                  />
                </div>
                <div className="w-12 text-sm text-white text-right">
                  {item.value}%
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
