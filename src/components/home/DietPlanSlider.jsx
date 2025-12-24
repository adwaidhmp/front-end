import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRight, Plus, SkipForward, Weight } from "lucide-react";

import {
  fetchCurrentDietPlan,
  generateDietPlan,
  followMealFromPlan,
  skipMeal,
  logCustomMeal,
  updateWeight,
  clearDietActionState,
} from "../../redux/user_slices/dietActionsSlice";

const DietPlanSlider = () => {
  const dispatch = useDispatch();

  const { loading, error, currentPlan } = useSelector(
    (state) => state.dietActions,
  );

  const [customMeals, setCustomMeals] = useState({});
  const [weight, setWeight] = useState("");

  /* ============================
     LOAD CURRENT PLAN
  ============================ */
  useEffect(() => {
    dispatch(fetchCurrentDietPlan());

    return () => {
      dispatch(clearDietActionState());
    };
  }, [dispatch]);

  /* ============================
     NORMALIZE PLAN
  ============================ */
  const dietPlan = useMemo(() => {
    if (!currentPlan || !currentPlan.meals) return null;

    const meals = currentPlan.meals.map((meal) => ({
      meal_type: meal.name.toLowerCase(),
      display_name: meal.name,
      items: meal.items || [],
    }));

    return {
      daily_calories: currentPlan.daily_calories,
      macros: currentPlan.macros,
      meals,
      disclaimer: currentPlan.disclaimer,
    };
  }, [currentPlan]);

  /* ============================
     SET CUSTOM MEALS INPUTS
  ============================ */
  useEffect(() => {
    if (dietPlan && dietPlan.meals) {
      const inputs = {};
      dietPlan.meals.forEach((m) => (inputs[m.meal_type] = ""));
      setCustomMeals(inputs);
    }
  }, [dietPlan]);

  /* ============================
     LOADING
  ============================ */
  if (loading && !dietPlan) {
    return <div className="text-gray-400">Loading diet plan…</div>;
  }

  /* ============================
     ERROR (REAL ERRORS ONLY)
  ============================ */
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  /* ============================
     NO PLAN YET (FIRST TIME USER)
  ============================ */
  if (!dietPlan) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-bold mb-3">No Diet Plan Yet</h3>
        <p className="text-gray-400 mb-6">
          Generate your first AI-powered diet plan to get started.
        </p>
        <button
          onClick={() => dispatch(generateDietPlan())}
          className="px-6 py-3 bg-purple-600 rounded-md"
        >
          Generate Diet Plan
        </button>
      </div>
    );
  }

  /* ============================
     ACTION HANDLERS
  ============================ */
  const handleCustomMeal = (mealType) => {
    const text = customMeals[mealType];
    if (!text?.trim()) return;

    dispatch(logCustomMeal({ meal_type: mealType, food_text: text }));
    setCustomMeals((prev) => ({ ...prev, [mealType]: "" }));
  };

  /* ============================
     UI
  ============================ */
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Your AI Diet Plan</h3>
          <p className="text-gray-400">
            Daily target: {dietPlan.daily_calories} kcal
          </p>
        </div>

        <button
          onClick={() => dispatch(generateDietPlan())}
          className="px-4 py-2 bg-purple-600 rounded-md text-sm"
        >
          Regenerate Plan
        </button>
      </div>

      {/* Meals */}
      <div className="space-y-4">
        {dietPlan.meals.map((meal) => (
          <div
            key={meal.meal_type}
            className="bg-gray-900/60 border border-gray-800 rounded-xl p-4"
          >
            <h4 className="font-semibold mb-2 capitalize">
              {meal.display_name}
            </h4>

            <ul className="text-sm text-gray-300 mb-3 list-disc pl-5">
              {meal.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <div className="flex gap-3 mb-4">
              <button
                onClick={() =>
                  dispatch(followMealFromPlan({ meal_type: meal.meal_type }))
                }
                className="flex items-center gap-1 px-3 py-1 bg-green-600 rounded-md text-sm"
              >
                <ChevronRight size={16} />
                Follow
              </button>

              <button
                onClick={() =>
                  dispatch(skipMeal({ meal_type: meal.meal_type }))
                }
                className="flex items-center gap-1 px-3 py-1 bg-gray-700 rounded-md text-sm"
              >
                <SkipForward size={16} />
                Skip
              </button>
            </div>

            <div className="flex gap-2">
              <input
                value={customMeals[meal.meal_type] || ""}
                onChange={(e) =>
                  setCustomMeals((p) => ({
                    ...p,
                    [meal.meal_type]: e.target.value,
                  }))
                }
                placeholder={`Log custom ${meal.display_name.toLowerCase()}`}
                className="flex-1 bg-gray-800 rounded-md px-3 py-2 text-sm"
              />
              <button
                onClick={() => handleCustomMeal(meal.meal_type)}
                className="px-3 py-2 bg-purple-600 rounded-md"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Weight Update */}
      <div className="mt-6 bg-gray-900/60 border border-gray-800 rounded-xl p-4">
        <h4 className="font-semibold mb-2">Weekly Weight Update</h4>
        <div className="flex gap-2">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight (kg)"
            className="flex-1 bg-gray-800 rounded-md px-3 py-2 text-sm"
          />
          <button
            onClick={() => {
              if (weight) {
                dispatch(updateWeight({ weight }));
                setWeight("");
              }
            }}
            className="px-3 py-2 bg-blue-600 rounded-md"
          >
            <Weight size={16} />
          </button>
        </div>
      </div>

      {dietPlan.disclaimer && (
        <p className="mt-4 text-xs text-gray-500">{dietPlan.disclaimer}</p>
      )}
    </div>
  );
};

export default DietPlanSlider;
