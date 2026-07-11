"use client";

interface BarChartProps {
  data: { label: string; value: number; amount: number }[];
  height?: number;
  accentColor?: string;
}

export function BarChart({ data, height = 260, accentColor = "#7c3aed" }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 40;
  const gap = 12;
  const chartWidth = data.length * (barWidth + gap) - gap;
  const paddingTop = 40;
  const paddingBottom = 60;
  const paddingLeft = 10;
  const paddingRight = 10;
  const svgWidth = chartWidth + paddingLeft + paddingRight;
  const svgHeight = height + paddingTop + paddingBottom;
  const chartHeight = height;

  // Grid lines
  const gridLines = 5;
  const gridStep = maxValue / gridLines;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full min-w-[400px]"
        style={{ maxHeight: svgHeight }}
      >
        {/* Grid lines */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = paddingTop + chartHeight - (chartHeight / gridLines) * i;
          return (
            <g key={i}>
              <line
                x1={paddingLeft}
                x2={svgWidth - paddingRight}
                y1={y}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth={1}
                strokeDasharray={i === 0 ? "0" : "4 4"}
              />
              <text
                x={paddingLeft - 2}
                y={y - 6}
                fontSize="10"
                fill="#9ca3af"
                textAnchor="start"
              >
                {Math.round(gridStep * i)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * chartHeight;
          const x = paddingLeft + i * (barWidth + gap);
          const y = paddingTop + chartHeight - barHeight;
          const radius = 6;

          return (
            <g key={i}>
              {/* Bar with rounded top */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={radius}
                ry={radius}
                fill={accentColor}
                opacity={0.9}
                className="transition-all duration-500"
              />
              {/* Fix rounded bottom */}
              {barHeight > radius && (
                <rect
                  x={x}
                  y={y + barHeight - radius}
                  width={barWidth}
                  height={radius}
                  fill={accentColor}
                  opacity={0.9}
                />
              )}
              {/* Value label on top */}
              {d.value > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  fontSize="10"
                  fontWeight="600"
                  fill={accentColor}
                  textAnchor="middle"
                >
                  {d.amount.toLocaleString()} د.ت
                </text>
              )}
              {/* Date label */}
              <text
                x={x + barWidth / 2}
                y={paddingTop + chartHeight + 20}
                fontSize="10"
                fill="#6b7280"
                textAnchor="middle"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* X axis label */}
        <text
          x={svgWidth / 2}
          y={svgHeight - 6}
          fontSize="11"
          fill="#9ca3af"
          textAnchor="middle"
        >
          الطلبات في آخر 10 أيام
        </text>
      </svg>
    </div>
  );
}

interface DonutChartProps {
  confirmed: number;
  abandoned: number;
  accentColor?: string;
  secondaryColor?: string;
}

export function DonutChart({
  confirmed,
  abandoned,
  accentColor = "#7c3aed",
  secondaryColor = "#facc15",
}: DonutChartProps) {
  const total = confirmed + abandoned;
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        لا توجد بيانات
      </div>
    );
  }

  const confirmedPct = Math.round((confirmed / total) * 100);
  const abandonedPct = 100 - confirmedPct;

  // SVG donut
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 72;
  const innerR = 48;

  // Calculate arc paths
  const confirmedAngle = (confirmed / total) * 360;

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  }

  function describeArc(cx: number, cy: number, outerR: number, innerR: number, startAngle: number, endAngle: number) {
    const outerStart = polarToCartesian(cx, cy, outerR, endAngle);
    const outerEnd = polarToCartesian(cx, cy, outerR, startAngle);
    const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
    const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return [
      "M", outerStart.x, outerStart.y,
      "A", outerR, outerR, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
      "L", innerStart.x, innerStart.y,
      "A", innerR, innerR, 0, largeArcFlag, 1, innerEnd.x, innerEnd.y,
      "Z",
    ].join(" ");
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Confirmed arc */}
        {confirmedAngle > 0 && confirmedAngle < 360 && (
          <path
            d={describeArc(cx, cy, outerR, innerR, 0, confirmedAngle)}
            fill={accentColor}
          />
        )}
        {confirmedAngle >= 360 && (
          <>
            <circle cx={cx} cy={cy} r={outerR} fill={accentColor} />
            <circle cx={cx} cy={cy} r={innerR} fill="white" />
          </>
        )}
        {/* Abandoned arc */}
        {abandonedPct > 0 && confirmedAngle < 360 && (
          <path
            d={describeArc(cx, cy, outerR, innerR, confirmedAngle, 360)}
            fill={secondaryColor}
          />
        )}

        {/* Inner circle (white) */}
        {confirmedAngle < 360 && (
          <circle cx={cx} cy={cy} r={innerR} fill="white" />
        )}

        {/* Center text */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#9ca3af">
          المجموع
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1f2937">
          {total}
        </text>

        {/* Percentage badges */}
        {confirmedPct > 0 && (
          <g>
            <rect
              x={cx - outerR - 16}
              y={cy + outerR / 2 - 10}
              width={36}
              height={20}
              rx={10}
              fill={accentColor}
              opacity={0.15}
            />
            <text
              x={cx - outerR + 2}
              y={cy + outerR / 2 + 4}
              fontSize="10"
              fontWeight="600"
              fill={accentColor}
              textAnchor="middle"
            >
              {confirmedPct}%
            </text>
          </g>
        )}
        {abandonedPct > 0 && (
          <g>
            <rect
              x={cx + outerR - 20}
              y={cy - outerR / 2 - 10}
              width={36}
              height={20}
              rx={10}
              fill={secondaryColor}
              opacity={0.3}
            />
            <text
              x={cx + outerR - 2}
              y={cy - outerR / 2 + 4}
              fontSize="10"
              fontWeight="600"
              fill="#a16207"
              textAnchor="middle"
            >
              {abandonedPct}%
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="text-gray-600">مؤكد</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: secondaryColor }} />
          <span className="text-gray-600">غير مكتمل</span>
        </div>
      </div>
    </div>
  );
}
