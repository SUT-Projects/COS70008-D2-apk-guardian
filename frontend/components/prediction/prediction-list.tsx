"use client";

import { PREDICTION_RESULT_URL } from "@/config/api-endpoints";
import { PredictionType } from "@/lib/sample-data";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { usePathname, useRouter } from "next/navigation";
import React, { use, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { formatProbability } from "./prediction-results";
import Link from "next/link";


export default function PredictionListingPage() {
  const router = useRouter();
  const pathname = usePathname()
  const [loading, setLoading] = React.useState(true);
  const [results, setResults] = React.useState<Array<any>>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${PREDICTION_RESULT_URL}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        return router.back();
      }

      console.log(data);
      
      setResults(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Loading...</div>;
  return (
    <Card shadow="sm">
      <CardHeader>
        <h3>Detailed Prediction Results</h3>
        <p>Complete analysis for all {results?.length} samples</p>
      </CardHeader>
      <CardBody>
        <Table shadow="none">
        <TableHeader>
          <TableColumn>Timestamp</TableColumn>
          <TableColumn>Endpoint</TableColumn>
          <TableColumn>Filename</TableColumn>
          <TableColumn className="text-right">Rows</TableColumn>
        </TableHeader>

        <TableBody>
          {results.map((b) => (
            <TableRow key={b._id} href={`${pathname}/${b._id}`} as={Link} className="cursor-pointer hover:bg-gray-100">
              <TableCell>{b.creation_date}</TableCell>
              <TableCell>{b.request_info.endpoint}</TableCell>
              <TableCell>{b.file_info.filename}</TableCell>
              <TableCell className="text-right">
                {b.results.length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </CardBody>
    </Card>
  );
}