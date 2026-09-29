import { getDashboardData, getBusinessChartData } from "../services/chart.service.js";

export async function getDashboardCharts(_req, res, next) {
  try {
    res.json(await getDashboardData());
  } catch (error) {
    next(error);
  }
}

export async function getBusinessCharts(req, res, next) {
  try {
    res.json(await getBusinessChartData(req.params.businessId));
  } catch (error) {
    next(error);
  }
}
