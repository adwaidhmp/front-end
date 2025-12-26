import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Flame, TrendingUp, Calendar, Weight, AlertCircle } from "lucide-react";

import {
  fetchDailyAnalytics,
  fetchWeeklyAnalytics,
  fetchMonthlyAnalytics,
  clearDietAnalytics,
} from "../../redux/user_slices/dietAnalyticsSlice";

const DietProgress = () => {
  const dispatch = useDispatch();

  const { daily, weekly, monthly, loading, error } = useSelector(
    (state) => state.dietAnalytics
  );

  /* ============================
     LOAD ANALYTICS
  ============================ */
  useEffect(() => {
    dispatch(fetchDailyAnalytics());
    dispatch(fetchWeeklyAnalytics());

    const today = new Date();
    dispatch(
      fetchMonthlyAnalytics({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
      })
    );

    return () => {
      dispatch(clearDietAnalytics());
    };
  }, [dispatch]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  /* ============================
     DAILY
  ============================ */
  const todayCalories = daily?.consumed_calories ?? 0;
  const dailyTarget = daily?.planned_calories ?? 0;
  const dailyReason = daily?.reason;

  /* ============================
     WEEKLY
  ============================ */
  const weeklyAvg = weekly?.avg_daily_calories ?? 0;
  const weeklyTarget = weekly?.planned_daily_calories ?? 0;
  const weeklyWeightChange = weekly?.weight_change;
  const weeklyReason = weekly?.reason;

  /* ============================
     MONTHLY
  ============================ */
  const monthlyAvg = monthly?.avg_daily_calories ?? 0;
  const monthlyTarget = monthly?.planned_daily_calories ?? 0;
  const monthlyWeightChange = monthly?.weight_change;
  const monthlyReason = monthly?.reason;

  /* ============================
     UI
  ============================ */
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold">Your Progress</h3>
        <p className="text-gray-400">
          Calories, weight, and trends over time
        </p>
      </div>

      <div className="space-y-4">
        {/* Daily Calories */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="text-orange-500" size={18} />
            <h4 className="font-semibold">Today’s Calories</h4>
          </div>

          <p className="text-gray-300 text-sm">
            Consumed:{" "}
            <span className="font-semibold">{todayCalories} kcal</span>
          </p>

          <p className="text-gray-400 text-sm">
            Target: {dailyTarget} kcal
          </p>

          {dailyReason && (
            <p className="text-xs text-gray-500 mt-1">{dailyReason}</p>
          )}
        </div>

        {/* Weekly Progress */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-green-500" size={18} />
            <h4 className="font-semibold">Weekly Progress</h4>
          </div>

          <p className="text-gray-300 text-sm">
            Avg per day:{" "}
            <span className="font-semibold">{weeklyAvg} kcal</span>
          </p>

          <p className="text-gray-400 text-sm">
            Target: {weeklyTarget} kcal
          </p>

          {weeklyWeightChange !== null && (
            <p className="text-gray-400 text-sm">
              Weight change: {weeklyWeightChange} kg
            </p>
          )}

          {weeklyReason && (
            <p className="text-xs text-gray-500 mt-1">{weeklyReason}</p>
          )}
        </div>

        {/* Monthly Calories */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="text-blue-500" size={18} />
            <h4 className="font-semibold">Monthly Overview</h4>
          </div>

          <p className="text-gray-300 text-sm">
            Avg per day:{" "}
            <span className="font-semibold">{monthlyAvg} kcal</span>
          </p>

          <p className="text-gray-400 text-sm">
            Target: {monthlyTarget} kcal
          </p>

          {monthlyWeightChange !== null && (
            <p className="text-gray-400 text-sm">
              Weight change: {monthlyWeightChange} kg
            </p>
          )}

          {monthlyReason && (
            <p className="text-xs text-gray-500 mt-1">{monthlyReason}</p>
          )}
        </div>

        {loading && (
          <p className="text-gray-500 text-sm">Updating analytics…</p>
        )}
      </div>
    </div>
  );
};

export default DietProgress;
