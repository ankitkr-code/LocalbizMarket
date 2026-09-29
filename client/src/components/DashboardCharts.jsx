import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardCharts({ dailySales, dailyInvestments, businessPerformance, businessChart }) {
  const salesData = {
    labels: businessChart ? businessChart.dailyRevenue.labels : dailySales.labels,
    datasets: [
      {
        label: businessChart ? "Daily Revenue (₹)" : "Daily Sales (₹)",
        data: businessChart ? businessChart.dailyRevenue.data : dailySales.data,
        borderColor: businessChart ? "#9333ea" : "#16a34a",
        backgroundColor: businessChart ? "rgba(147, 51, 234, 0.15)" : "rgba(22, 163, 74, 0.15)",
        tension: 0.35,
        fill: true,
        pointRadius: 3
      }
    ]
  };

  const investmentData = {
    labels: businessChart ? businessChart.dailyInvestments.labels : dailyInvestments.labels,
    datasets: [
      {
        label: businessChart ? "Daily Investment Inflow (₹)" : "Daily Investments (₹)",
        data: businessChart ? businessChart.dailyInvestments.data : dailyInvestments.data,
        borderColor: businessChart ? "#2563eb" : "#2563eb",
        backgroundColor: businessChart ? "rgba(37, 99, 235, 0.15)" : "rgba(37, 99, 235, 0.15)",
        tension: 0.35,
        fill: true,
        pointRadius: 3
      }
    ]
  };

  const businessLabels = businessPerformance.map((item) => item.businessName);
  const businessRevenue = businessPerformance.map((item) => item.revenue);

  const performanceData = {
    labels: businessLabels,
    datasets: [
      {
        label: "Top Business Revenue (₹)",
        data: businessRevenue,
        backgroundColor: businessLabels.map((_, index) => index % 2 === 0 ? "#f97316" : "#fbbf24")
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { callback: (value) => `₹${value.toLocaleString("en-IN")}` } }
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Market Activity</h2>
            <p className="text-sm text-slate-600">Daily sales and funding flow for the platform.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Live view</span>
        </div>
        <div className="min-h-[320px]">
          <Line options={chartOptions} data={salesData} />
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Top Business Revenue</h2>
          <p className="text-sm text-slate-600">Highest revenue-generating businesses this period.</p>
        </div>
        <div className="min-h-[320px]">
          <Bar options={chartOptions} data={performanceData} />
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Investment Momentum</h2>
          <p className="text-sm text-slate-600">Fund inflow trend across platform investments.</p>
        </div>
        <div className="min-h-[320px]">
          <Line options={chartOptions} data={investmentData} />
        </div>
      </section>
    </div>
  );
}
