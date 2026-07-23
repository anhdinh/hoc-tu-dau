import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
]

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 25 },
  { name: 'Food', value: 20 },
  { name: 'Others', value: 20 },
]

const COLORS = ['#4f46e5', '#06b6d4', '#22c55e', '#f59e0b']

const userTrend = [
  { day: 'Mon', users: 120 },
  { day: 'Tue', users: 200 },
  { day: 'Wed', users: 150 },
  { day: 'Thu', users: 280 },
  { day: 'Fri', users: 190 },
  { day: 'Sat', users: 320 },
  { day: 'Sun', users: 250 },
]

const stats = [
  { label: 'Total Users', value: '2,450', color: '#4f46e5' },
  { label: 'Orders', value: '845', color: '#06b6d4' },
  { label: 'Revenue', value: '$12.4k', color: '#22c55e' },
  { label: 'Growth', value: '+18%', color: '#f59e0b' },
]

export default function Dashboard() {
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              background: '#fff',
              borderRadius: 8,
              padding: '16px 20px',
              border: '1px solid #e5e4e7',
            }}
          >
            <div style={{ fontSize: 13, color: '#6b6375' }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color, marginTop: 4 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 300, background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #e5e4e7' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, minWidth: 250, background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #e5e4e7' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 2, minWidth: 300, background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #e5e4e7' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>User Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userTrend}>
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
