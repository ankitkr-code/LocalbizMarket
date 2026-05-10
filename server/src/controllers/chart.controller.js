import { getDashboardData } from "../services/chart.service.js";

export async function getDashboardCharts(_req, res, next) {
  try {
    res.json(await getDashboardData());
  } catch (error) {
    next(error);
  }
}
