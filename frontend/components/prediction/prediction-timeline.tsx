"use client";

import { PredictionType, categoryColors } from "@/lib/sample-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

interface PredictionTimelineProps {
  data: PredictionType | null;
  detailed?: boolean;
}

export function PredictionTimeline({ data, detailed = false }: PredictionTimelineProps) {
  if (!data) return null;

  // Process data for radar chart (average probabilities by category)
  const categories = data.class_labels;
  const radarData = categories.map(category => {
    const sum = data.results.reduce((acc, result: any) => {
      return acc + result.probabilities[category];
    }, 0);
    const avg = sum / data.results.length;
    
    return {
      subject: category,
      A: parseFloat((avg * 100).toFixed(1)),
      fullMark: 100,
      fill: categoryColors[category as keyof typeof categoryColors],
    };
  });

  // Process data for timeline - simulate time data since we don't have real timestamps per prediction
  const timelineData = data.results.map((result: any, index) => {
    // Create a date starting from request time, adding 1 second per item
    const baseDate = new Date(data.request_time);
    const itemDate = new Date(baseDate.getTime() + index * 1000);
    
    return {
      time: itemDate.toISOString().substring(11, 19), // HH:MM:SS format
      category: result.prediction,
      confidence: parseFloat((result.probabilities[result.prediction] * 100).toFixed(1)),
      ...categories.reduce((acc, cat) => {
        acc[cat] = parseFloat((result.probabilities[cat] * 100).toFixed(1));
        return acc;
      }, {} as Record<string, number>)
    };
  });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-md border shadow-sm">
          <p className="font-medium text-sm mb-1">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-xs flex items-center gap-1" style={{ color: entry.color }}>
              <span className="w-2 h-2 inline-block rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span>{`${entry.name}: ${entry.value}%`}</span>
            </p>
          ))}
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
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {detailed ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={timelineData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
            <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {categories.map((category, index) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={categoryColors[category as keyof typeof categoryColors]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                animationDuration={1000 + index * 200}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="subject" stroke="var(--muted-foreground)" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--muted-foreground)" />
            <Radar
              name="Average Confidence"
              dataKey="A"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.5}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}