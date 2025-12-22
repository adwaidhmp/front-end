import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronRight,
  Plus,
  SkipForward,
  Weight,
} from "lucide-react";

import {
  generateDietPlan,
  followMealFromPlan,
  skipMeal,
  logCustomMeal,
  updateWeight,
  clearDietActionState,
} from "../../redux/user_slices/dietActionsSlice";

const DietPlanSlider = () => {
  const dispatch = useDispatch();
  const { loading, error, lastResponse } = useSelector(
    (state) => state.dietActions
  );

  const [dietPlan, setDietPlan] = useState(null);
  const [customMeals, setCustomMeals] = useState({});
  const [weight, setWeight] = useState("");

  /* ============================
     LOAD DIET PLAN
  ============================ */
  useEffect(() => {
    dispatch(generateDietPlan());

    return () => {
      dispatch(clearDietActionState());
    };
  }, [dispatch]);

  /* ============================
     NORMALIZE AI RESPONSE
  ============================ */
  useEffect(() => {
    if (!lastResponse) return;

    const plan = lastResponse.plan || lastResponse;
    if (!plan?.meals) return;

    const normalizedMeals = plan.meals.map((meal) => ({
      meal_type: meal.name.toLowerCase(),
      display_name: meal.name,
      items: meal.items || [],
    }));

    setDietPlan({
      daily_calories: plan.daily_calories,
      macros: plan.macros,
      meals: normalizedMeals,
      disclaimer: plan.disclaimer,
    });

    // initialize custom meal inputs per meal
    const inputs = {};
    normalizedMeals.forEach((m) => {
      inputs[m.meal_type] = "";
    });
    setCustomMeals(inputs);
  }, [lastResponse]);

  if (loading && !dietPlan) {
    return <div className="text-gray-400">Generating your AI diet plan…</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!dietPlan) return null;

  /* ============================
     ACTION HANDLERS
  ============================ */
  const handleFollowMeal = (mealType) => {
    dispatch(followMealFromPlan({ meal_type: mealType }));
  };

  const handleSkipMeal = (mealType) => {
    dispatch(skipMeal({ meal_type: mealType }));
  };

  const handleCustomMeal = (mealType) => {
    const foodText = customMeals[mealType];
    if (!foodText || !foodText.trim()) return;

    dispatch(
      logCustomMeal({
        meal_type: mealType,
        food_text: foodText,
      })
    );

    setCustomMeals((prev) => ({
      ...prev,
      [mealType]: "",
    }));
  };

  const handleWeightUpdate = () => {
    if (!weight) return;
    dispatch(updateWeight({ weight }));
    setWeight("");
  };

  /* ============================
     UI
  ============================ */
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold">Your AI Diet Plan</h3>
        <p className="text-gray-400">
          Daily target: {dietPlan.daily_calories} kcal
        </p>
      </div>

      {/* Meals */}
      <div className="space-y-4">
        {dietPlan.meals.map((meal) => (
          <div
            key={meal.meal_type}
            className="bg-gray-900/60 border border-gray-800 rounded-xl p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold capitalize">
                {meal.display_name}
              </h4>
            </div>

            <ul className="text-sm text-gray-300 mb-3 list-disc pl-5">
              {meal.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => handleFollowMeal(meal.meal_type)}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 rounded-md text-sm"
              >
                <ChevronRight size={16} />
                Follow
              </button>

              <button
                onClick={() => handleSkipMeal(meal.meal_type)}
                className="flex items-center gap-1 px-3 py-1 bg-gray-700 rounded-md text-sm"
              >
                <SkipForward size={16} />
                Skip
              </button>
            </div>

            {/* Custom Meal for this meal */}
            <div className="flex gap-2">
              <input
                value={customMeals[meal.meal_type] || ""}
                onChange={(e) =>
                  setCustomMeals((prev) => ({
                    ...prev,
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
        <p className="text-sm text-gray-400 mb-2">
          Updating weight may regenerate your plan
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight (kg)"
            className="flex-1 bg-gray-800 rounded-md px-3 py-2 text-sm"
          />
          <button
            onClick={handleWeightUpdate}
            className="px-3 py-2 bg-blue-600 rounded-md"
          >
            <Weight size={16} />
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      {dietPlan.disclaimer && (
        <p className="mt-4 text-xs text-gray-500">
          {dietPlan.disclaimer}
        </p>
      )}
    </div>
  );
};

export default DietPlanSlider;
