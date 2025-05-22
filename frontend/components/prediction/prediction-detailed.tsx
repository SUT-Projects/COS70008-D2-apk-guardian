"use client";

import ContentLoader from "@/components/loaders/content-loader";
import { PredictionDistribution } from "@/components/prediction/prediction-distribution";
import { PredictionResults } from "@/components/prediction/prediction-results";
import { PredictionSummary } from "@/components/prediction/prediction-summary";
import { PredictionTimeline } from "@/components/prediction/prediction-timeline";

import { Tabs, Tab } from "@heroui/tabs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

import { PREDICTION_RESULT_URL } from "@/config/api-endpoints";

export default function PredictionDetailed() {
  const router = useRouter();
  const { historyId } = useParams<{ historyId: string }>();
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${PREDICTION_RESULT_URL}/${historyId}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        return router.back();
      }
      setHistoryData(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [historyId, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <ContentLoader />;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PredictionSummary data={historyData} />
        </div>

        <Tabs
          defaultSelectedKey="overview"
          color="primary"
          radius="full"
          // variant="underlined"
          // fullWidth
          // classNames={{
          //   tabList: "flex space-x-4 bg-gray-100 p-2 rounded-xl shadow-inner",
          //   tab: "px-4 py-2 rounded-lg cursor-pointer data-[selected=true]:bg-teal-500 data-[selected=true]:text-white",
          //   panel: "mt-6"
          // }}
        >
          <Tab title="Overview" titleValue="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-2 rounded-xl bg-white p-6 shadow">
                <h3 className="text-lg font-medium">Prediction Overview</h3>
                <p className="text-sm text-gray-500">Distribution of malware classifications</p>
                <div className="mt-4">
                  <PredictionDistribution data={historyData} />
                </div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="text-lg font-medium">Classification Confidence</h3>
                <p className="text-sm text-gray-500">Average confidence by category</p>
                <div className="h-[300px] mt-4">
                  <PredictionTimeline data={historyData} />
                </div>
              </div>
            </div>
          </Tab>

          <Tab title="Distribution" titleValue="distribution">
            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="text-lg font-medium">Prediction Distribution</h3>
              <p className="text-sm text-gray-500">Detailed breakdown of prediction categories</p>
              <div className="h-[400px] mt-4">
                <PredictionDistribution data={historyData} detailed />
              </div>
            </div>
          </Tab>

          <Tab title="Timeline" titleValue="timeline">
            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="text-lg font-medium">Prediction Timeline</h3>
              <p className="text-sm text-gray-500">Analysis over time</p>
              <div className="h-[400px] mt-4">
                <PredictionTimeline data={historyData} detailed />
              </div>
            </div>
          </Tab>

          <Tab title="Details" titleValue="details">
            <PredictionResults data={historyData} />
          </Tab>
        </Tabs>
      </main>
    </div>
  );
}