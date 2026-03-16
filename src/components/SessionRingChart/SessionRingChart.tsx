import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { eventColor, tagColor } from '@/lib/color'
import type { SessionRollup } from '@/lib/analysis/session'
import styles from './SessionRingChart.module.css'

type RingEntry = { name: string; value: number; fill: string }

interface Props {
  rollup: SessionRollup
}

export function SessionRingChart({ rollup }: Props) {
  if (rollup.behaviors.length === 0) return null

  const hasTags = rollup.behaviors.some(b => b.tags.length > 0)

  const innerData: RingEntry[] = rollup.behaviors.map(b => ({
    name: b.name,
    value: b.count,
    fill: eventColor(b.colorHue),
  }))

  const outerData: RingEntry[] = rollup.behaviors.flatMap(b => {
    if (b.tags.length === 0) {
      // Mirror inner ring — behavior has no tags.
      return [{ name: b.name, value: b.count, fill: eventColor(b.colorHue) }]
    }
    return b.tags.map(t => ({
      name: t.tagId === null ? `${b.name} — Untagged` : `${b.name} / ${t.name}`,
      value: t.count,
      fill: tagColor(t.colorHue, t.colorIndex, t.colorTotal),
    }))
  })

  const stroke = 'var(--bg, #1a1a1a)'

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" aspect={1}>
        <PieChart>
          <Pie
            data={innerData}
            cx="50%"
            cy="50%"
            innerRadius={hasTags ? '38%' : '45%'}
            outerRadius={hasTags ? '52%' : '62%'}
            dataKey="value"
            strokeWidth={2}
            stroke={stroke}
          >
            {innerData.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>

          {hasTags && (
            <Pie
              data={outerData}
              cx="50%"
              cy="50%"
              innerRadius="57%"
              outerRadius="70%"
              dataKey="value"
              strokeWidth={2}
              stroke={stroke}
            >
              {outerData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
          )}

          <Tooltip
            formatter={(value, name) => [value, name]}
            contentStyle={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              fontSize: '0.8rem',
            }}
            itemStyle={{ color: 'var(--text)' }}
            labelStyle={{ display: 'none' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
