"use client";

import { PredictionType } from "@/lib/sample-data";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Table, TableHeader, TableRow, TableBody, TableCell, TableColumn } from "@heroui/table";
import { Progress } from "@heroui/progress";
import { Badge } from "@heroui/badge";
import { motion } from "framer-motion";
import { Alert } from "@heroui/alert";
import InfoIcon from "@mui/icons-material/Info";
import { Chip } from "@heroui/chip";

const getBadgeVariant = (prediction: string) => {
  const map: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
    "Adware": "secondary",
    "Banking": "destructive",
    "Benigan": "outline",
    "Riskware": "default",
    "SMS Malware": "destructive"
  };
  return map[prediction] || "default";
};

export const formatProbability = (value: number) => {
  if (value < 0.0001) {
    return value.toExponential(2);
  }
  return (value * 100).toFixed(2) + "%";
};

export function PredictionResults({ data }: { data: PredictionType | null }) {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card shadow="sm">
        <CardHeader>
          <h3>Detailed Prediction Results</h3>
          <p>
            Complete analysis results for all {data.results.length} predictions
          </p>
        </CardHeader>
        <CardBody>
          {/* <Alert className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <p>
              The following results show the predicted malware classification for each sample with probability scores.
            </p>
          </Alert> */}
          
          <Table shadow="none">
            <TableHeader>
                <TableColumn className="w-[80px]">#</TableColumn>
                <TableColumn>Prediction</TableColumn>
                <TableColumn>Confidence</TableColumn>
                <TableColumn className="hidden md:table-cell">Probability Distribution</TableColumn>
            </TableHeader>
            <TableBody>
              {data.results.map((result: any, index) => {
                const confidence = result.probabilities[result.prediction];
                
                return (
                  <TableRow key={index} className="group">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <Chip color="primary">
                        {result.prediction}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={confidence * 100} className="h-2 w-[60px] md:w-[100px]" />
                        <span className="text-xs">{formatProbability(confidence)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        {Object.entries(result.probabilities)
                          .sort(([, a]: any, [, b]: any) => b - a)
                          .map(([category, probability]: any) => (
                            <div key={category} className="flex justify-between">
                              <span className="text-muted-foreground">{category}:</span>
                              <span>{formatProbability(probability)}</span>
                            </div>
                          ))
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </motion.div>
  );
}