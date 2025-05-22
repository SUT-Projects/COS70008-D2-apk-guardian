"use client";

import { Card, CardBody as CardContent, CardHeader } from "@heroui/card";
import { Check, AccessTime as Clock, Memory as Cpu, Dangerous as FileWarning } from "@mui/icons-material";
import { PredictionType, categoryColors } from "@/lib/sample-data";
import { motion } from "framer-motion";
import clsx from "clsx";

export function PredictionSummary({ data }: { data: PredictionType | null }) {
  if (!data) return null;

  // Calculate statistics
  const totalPredictions = data.results.length;
  const predictionCounts = data.results.reduce<Record<string, number>>((acc, item) => {
    acc[item.prediction] = (acc[item.prediction] || 0) + 1;
    return acc;
  }, {});

  const highestConfidence = data.results.reduce((max, item: any) => {
    const confidence = item.probabilities[item.prediction];
    return confidence > max ? confidence : max;
  }, 0);

  const avgProcessingTime = data.duration_seconds * 1000;

  const cards = [
    {
      title: "Total Predictions",
      value: totalPredictions,
      description: "Total predictions made",
      icon: Check,
      color: "text-green-500",
    },
    {
      title: "Highest Confidence",
      value: `${(highestConfidence * 100).toFixed(2)}%`,
      description: "Highest prediction confidence",
      icon: FileWarning,
      color: "text-blue-500",
    },
    {
      title: "Processing Time",
      value: `${avgProcessingTime.toFixed(2)}ms`,
      description: "Average processing time per item",
      icon: Clock,
      color: "text-amber-500",
    },
    {
      title: "Primary Prediction",
      value: Object.entries(predictionCounts).sort((a, b) => b[1] - a[1])[0][0],
      description: "Most common prediction type",
      icon: Cpu,
      color: "text-purple-500",
    },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <CardContainer key={index} delayFactor={index * 0.1}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h4 className="text-sm font-medium">{card.title}</h4>
              <card.icon className={clsx("h-4 w-4", card.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        </CardContainer>
      ))}
    </>
  );
}

function CardContainer({ children, delayFactor = 0 }: { children: React.ReactNode; delayFactor?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delayFactor }}
    >
      {children}
    </motion.div>
  );
}