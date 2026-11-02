import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartRow {
  label: string;
  count: number;
  color: string;
}

interface DashboardChartProps {
  id: string;
  title: string;
  rows: ChartRow[];
  total: number;
}

export function DashboardChart({
  id,
  title,
  rows,
  total,
}: DashboardChartProps) {
  return (
    <section
      className="dashboard-chart card card--padding-lg"
      aria-labelledby={id}
    >
      <h2 id={id} className="dashboard-chart__title">
        {title}
      </h2>
      <p className="dashboard-chart__subtitle">
        {total.toLocaleString()} tickets total
      </p>

      <div className="dashboard-chart__plot">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            accessibilityLayer
            data={rows}
            margin={{ top: 24, right: 8, bottom: 0, left: -18 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--color-border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{ fill: "var(--color-text-tertiary)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "var(--color-gray-50)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload as ChartRow;
                return (
                  <div className="dashboard-chart__tooltip">
                    <strong className="dashboard-chart__tooltip-title">
                      {String(label)}
                    </strong>
                    <div className="dashboard-chart__tooltip-value">
                      <span
                        className="dashboard-chart__tooltip-dot"
                        style={{ backgroundColor: row.color }}
                      />
                      <span>Tickets</span>
                      <strong>{row.count.toLocaleString()}</strong>
                    </div>
                    <span className="dashboard-chart__tooltip-share">
                      {total === 0 ? 0 : Math.round((row.count / total) * 100)}%
                      of all tickets
                    </span>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="count"
              maxBarSize={54}
              radius={[5, 5, 0, 0]}
              isAnimationActive={false}
            >
              {rows.map((row) => (
                <Cell key={row.label} fill={row.color} />
              ))}
              <LabelList
                dataKey="count"
                position="top"
                fill="var(--color-text)"
                fontSize={12}
                fontWeight={600}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="sr-only">
        {rows.map(({ label, count }) => (
          <li key={label}>
            {label}: {count}
          </li>
        ))}
      </ul>
    </section>
  );
}
