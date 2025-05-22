"use client";

import { PredictionType, categoryColors } from "@/lib/sample-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, Sector } from "recharts";
import { useState } from "react";
import { motion } from "framer-motion";

interface PredictionDistributionProps {
  data: PredictionType | null;
  detailed?: boolean;
}

export function PredictionDistribution({ data, detailed = false }: PredictionDistributionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (!data) return null;

  // Count predictions by category
  const predictionCounts = data.results.reduce<Record<string, number>>((acc, item) => {
    acc[item.prediction] = (acc[item.prediction] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(predictionCounts).map(([name, value]) => ({
    name,
    value,
    color: categoryColors[name as keyof typeof categoryColors]
  }));

  // Calculate average confidence by category
  const confidenceData = data.class_labels.map(category => {
    const matchingPredictions = data.results.filter(r => r.prediction === category);
    
    if (matchingPredictions.length === 0) return { name: category, value: 0 };
    
    const avgConfidence = matchingPredictions.reduce((sum, item: any) => {
      return sum + item.probabilities[category];
    }, 0) / matchingPredictions.length;
    
    return {
      name: category,
      value: parseFloat((avgConfidence * 100).toFixed(1)),
      color: categoryColors[category as keyof typeof categoryColors]
    };
  });

  const renderActiveShape = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-midAngle * Math.PI / 180);
    const cos = Math.cos(-midAngle * Math.PI / 180);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="var(--foreground)" className="text-xs">
          {`${payload.name} (${value})`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="var(--muted-foreground)" className="text-xs">
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-2 rounded-md border shadow-sm">
          <p className="font-medium text-sm">{`${label}`}</p>
          <p className="text-xs text-card-foreground/80">
            {`Value: ${payload[0].value}`}
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {detailed ? (
        <div className="grid md:grid-cols-2 gap-6 h-full">
          <div className="h-full flex flex-col">
            <h3 className="text-sm font-medium mb-2">Prediction Distribution</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="h-full flex flex-col">
            <h3 className="text-sm font-medium mb-2">Confidence Levels (%)</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={confidenceData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {confidenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}