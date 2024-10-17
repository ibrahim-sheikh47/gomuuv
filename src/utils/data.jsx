import icons from "../constants/icons";
import images from "../constants/images";

export const settings = [
  {
    icon: icons.personalInfo,
    text: "Personal Information",
    route: "PersonalInfoScreen",
  },
  {
    icon: icons.changePass,
    text: "Change Password",
    route: "ChangePassScreen",
  },
  {
    icon: icons.helpSupport,
    text: "Help and Support",
    route: "HelpSupportScreen",
  },
  {
    icon: icons.syncSecure,
    text: "Sync and Secure Data",
    route: "SyncSecureDataScreen",
  },
];

export const notificationsSettings = [
  {
    icon: icons.notifications,
    text: "Manage Notifications",
    route: "ManageNotifications",
  },
  {
    icon: icons.devices,
    text: "Manage Connected Devices",
    route: "SyncSecureDataScreen",
  },
];

export const shopProducts = [
  {
    id: 1,
    title: "Product 1",
    amount: 29.99,
    productImage: images.product1, // Replace with actual image path
    type: "recommended",
    description: "Product description",
    features: ["Feature A", "Feature B"], // Added features
    dimensions: "10 x 5 x 2 inches", // Added dimensions
    weight: "1 lb", // Added weight
    materials: "Plastic", // Added materials
    weightRange: "0-2 lbs", // Added weight range
    audience: "Adults", // Added audience
    warranty: "1 year", // Added warranty
    manufacturer: "Manufacturer A", // Added manufacturer
  },
  {
    id: 2,
    title: "Product 2",
    amount: 49.99,
    productImage: images.product1, // Replace with actual image path
    type: "recommended",
    description: "Product description",
    features: ["Feature C", "Feature D"],
    dimensions: "12 x 8 x 4 inches",
    weight: "2 lbs",
    materials: "Metal",
    weightRange: "1-3 lbs",
    audience: "Adults",
    warranty: "2 years",
    manufacturer: "Manufacturer B",
  },
  {
    id: 3,
    title: "Product 3",
    amount: 19.99,
    productImage: images.product1, // Replace with actual image path
    type: "recommended",
    description: "Product description",
    features: ["Feature E", "Feature F"],
    dimensions: "8 x 4 x 1 inches",
    weight: "0.5 lbs",
    materials: "Rubber",
    weightRange: "0-1 lb",
    audience: "Teens",
    warranty: "6 months",
    manufacturer: "Manufacturer C",
  },
  {
    id: 4,
    title: "Fitness Gear 1",
    amount: 59.99,
    productImage: images.product1, // Replace with actual image path
    type: "fitness",
    description: "Product description",
    features: ["Feature G", "Feature H"],
    dimensions: "15 x 10 x 5 inches",
    weight: "3 lbs",
    materials: "Fabric",
    weightRange: "2-5 lbs",
    audience: "Adults",
    warranty: "1 year",
    manufacturer: "Manufacturer D",
  },
  {
    id: 5,
    title: "Fitness Gear 2",
    amount: 89.99,
    productImage: images.product1, // Replace with actual image path
    type: "fitness",
    description: "Product description",
    features: ["Feature I", "Feature J"],
    dimensions: "14 x 6 x 3 inches",
    weight: "2.5 lbs",
    materials: "Steel",
    weightRange: "1-4 lbs",
    audience: "Adults",
    warranty: "2 years",
    manufacturer: "Manufacturer E",
  },
  {
    id: 6,
    title: "Supplement 1",
    amount: 24.99,
    productImage: images.product1, // Replace with actual image path
    type: "supplements",
    description: "Product description",
    features: ["Feature K", "Feature L"],
    dimensions: "4 x 4 x 6 inches",
    weight: "0.75 lbs",
    materials: "Glass",
    weightRange: "0-1 lb",
    audience: "Adults",
    warranty: "No warranty",
    manufacturer: "Manufacturer F",
  },
  {
    id: 7,
    title: "Supplement 2",
    amount: 34.99,
    productImage: images.product1, // Replace with actual image path
    type: "supplements",
    description: "Product description",
    features: ["Feature M", "Feature N"],
    dimensions: "5 x 5 x 7 inches",
    weight: "1 lb",
    materials: "Plastic",
    weightRange: "0-2 lbs",
    audience: "Adults",
    warranty: "1 year",
    manufacturer: "Manufacturer G",
  },
];

export const dailyPlanData = [
  {
    id: "1",
    title: "Breakfast",
    mealName: "Avocado Egg Toast",
    mealImage: images.breakfast,
    calories: 190,
    type: "breakfast",
    time: "25",
    ingredients: [
      { id: "1", name: "Avocado", quantity: "30g" },
      { id: "2", name: "Egg", quantity: "1 whole" },
      { id: "3", name: "Purple Onion", quantity: "30g" },
      { id: "4", name: "Fresh Asparagus", quantity: "70g" },
      { id: "5", name: "Pepper", quantity: "50g" },
      { id: "6", name: "Wheat Bread", quantity: "1 Slice" },
      { id: "7", name: "Coconut Oil", quantity: "1 Tbsp" },
      { id: "8", name: "Lime Juice", quantity: "To Taste" },
    ],
    steps: [
      { id: "1", step: "Wash all vegetables thoroughly." },
      { id: "2", step: "Chop the lettuce, tomatoes, and cucumber." },
      { id: "3", step: "Mix all ingredients in a large bowl." },
      { id: "4", step: "Add dressing and mix well." },
      { id: "5", step: "Serve fresh with optional toppings." },
    ],
  },
  {
    id: "2",
    title: "Lunch",
    mealName: "Grilled Chicken Salad",
    mealImage: images.lunch,
    calories: 350,
    type: "lunch",
    time: "35",
    ingredients: [
      { id: "1", name: "Chicken Breast", quantity: "200g" },
      { id: "2", name: "Lettuce", quantity: "100g" },
      { id: "3", name: "Tomato", quantity: "50g" },
      { id: "4", name: "Cucumber", quantity: "50g" },
      { id: "5", name: "Olive Oil", quantity: "2 Tbsp" },
      { id: "6", name: "Lemon Juice", quantity: "To Taste" },
    ],
    steps: [
      { id: "1", step: "Grill the chicken breast until fully cooked." },
      { id: "2", step: "Chop all vegetables and mix in a bowl." },
      { id: "3", step: "Add grilled chicken to the salad." },
      { id: "4", step: "Drizzle olive oil and lemon juice on top." },
      { id: "5", step: "Serve fresh." },
    ],
  },
];
export const popularRecipesData = [
  {
    id: "1",
    title: "Dinner",
    mealName: "Salmon with Quinoa",
    mealImage: images.dinner,
    calories: 450,
    type: "dinner",
    time: "40",
    ingredients: [
      { id: "1", name: "Salmon", quantity: "150g" },
      { id: "2", name: "Quinoa", quantity: "100g" },
      { id: "3", name: "Broccoli", quantity: "50g" },
      { id: "4", name: "Olive Oil", quantity: "1 Tbsp" },
      { id: "5", name: "Lemon Juice", quantity: "To Taste" },
      { id: "6", name: "Salt", quantity: "To Taste" },
      { id: "7", name: "Pepper", quantity: "To Taste" },
    ],
    steps: [
      { id: "1", step: "Cook quinoa as per the instructions." },
      { id: "2", step: "Season the salmon with salt and pepper." },
      { id: "3", step: "Grill or bake the salmon until cooked through." },
      { id: "4", step: "Steam the broccoli." },
      { id: "5", step: "Serve salmon with quinoa and steamed broccoli." },
    ],
  },
  {
    id: "2",
    title: "Snack",
    mealName: "Greek Yogurt with Berries",
    mealImage: images.snack,
    calories: 150,
    type: "snack",
    time: "10",
    ingredients: [
      { id: "1", name: "Greek Yogurt", quantity: "200g" },
      { id: "2", name: "Mixed Berries", quantity: "100g" },
      { id: "3", name: "Honey", quantity: "1 Tbsp" },
    ],
    steps: [
      { id: "1", step: "Place yogurt in a bowl." },
      { id: "2", step: "Top with mixed berries." },
      { id: "3", step: "Drizzle honey on top." },
    ],
  },
];

export const nutritionPlans = [
  {
    id: "1",
    title: "Weight Loss Plan",
    type: "weightloss",
    icon: icons.weightLoss,
  },
  {
    id: "2",
    title: "Muscle Gain Plan",
    type: "musclegain",
    icon: icons.muscleGain,
  },
  {
    id: "3",
    title: "Maintenance Plan",
    type: "maintenance",
    icon: icons.maintenance,
  },
  { id: "4", title: "Keto Plan", type: "keto", icon: icons.keto },
  {
    id: "5",
    title: "Vegetarian Plan",
    type: "vegetarian",
    icon: icons.vegetarian,
  },
];
export const nutritionPlansData = [
  {
    id: "1",
    title: "Breakfast",
    mealName: "Avocado Egg Toast",
    mealImage: images.breakfast,
    calories: 190,
    type: "weightloss",
    time: "25",
    ingredients: [
      { id: "1", name: "Avocado", quantity: "30g" },
      { id: "2", name: "Egg", quantity: "1 whole" },
      { id: "3", name: "Purple Onion", quantity: "30g" },
      { id: "4", name: "Fresh Asparagus", quantity: "70g" },
      { id: "5", name: "Pepper", quantity: "50g" },
      { id: "6", name: "Wheat Bread", quantity: "1 Slice" },
      { id: "7", name: "Coconut Oil", quantity: "1 Tbsp" },
      { id: "8", name: "Lime Juice", quantity: "To Taste" },
    ],
    steps: [
      { id: "1", step: "Wash all vegetables thoroughly." },
      { id: "2", step: "Chop the lettuce, tomatoes, and cucumber." },
      { id: "3", step: "Mix all ingredients in a large bowl." },
      { id: "4", step: "Add dressing and mix well." },
      { id: "5", step: "Serve fresh with optional toppings." },
    ],
  },
  {
    id: "2",
    title: "Lunch",
    mealName: "Grilled Chicken Salad",
    mealImage: images.lunch,
    calories: 350,
    type: "musclegain",
    time: "35",
    ingredients: [
      { id: "1", name: "Chicken Breast", quantity: "200g" },
      { id: "2", name: "Lettuce", quantity: "100g" },
      { id: "3", name: "Tomato", quantity: "50g" },
      { id: "4", name: "Cucumber", quantity: "50g" },
      { id: "5", name: "Olive Oil", quantity: "2 Tbsp" },
      { id: "6", name: "Lemon Juice", quantity: "To Taste" },
    ],
    steps: [
      { id: "1", step: "Grill the chicken breast until fully cooked." },
      { id: "2", step: "Chop all vegetables and mix in a bowl." },
      { id: "3", step: "Add grilled chicken to the salad." },
      { id: "4", step: "Drizzle olive oil and lemon juice on top." },
      { id: "5", step: "Serve fresh." },
    ],
  },
  {
    id: "3",
    title: "Lunch",
    mealName: "Grilled Chicken Salad",
    mealImage: images.lunch,
    calories: 350,
    type: "maintenance",
    time: "35",
    ingredients: [
      { id: "1", name: "Chicken Breast", quantity: "200g" },
      { id: "2", name: "Lettuce", quantity: "100g" },
      { id: "3", name: "Tomato", quantity: "50g" },
      { id: "4", name: "Cucumber", quantity: "50g" },
      { id: "5", name: "Olive Oil", quantity: "2 Tbsp" },
      { id: "6", name: "Lemon Juice", quantity: "To Taste" },
    ],
    steps: [
      { id: "1", step: "Grill the chicken breast until fully cooked." },
      { id: "2", step: "Chop all vegetables and mix in a bowl." },
      { id: "3", step: "Add grilled chicken to the salad." },
      { id: "4", step: "Drizzle olive oil and lemon juice on top." },
      { id: "5", step: "Serve fresh." },
    ],
  },
  {
    id: "4",
    title: "Lunch",
    mealName: "Grilled Chicken Salad",
    mealImage: images.lunch,
    calories: 350,
    type: "keto",
    time: "35",
    ingredients: [
      { id: "1", name: "Chicken Breast", quantity: "200g" },
      { id: "2", name: "Lettuce", quantity: "100g" },
      { id: "3", name: "Tomato", quantity: "50g" },
      { id: "4", name: "Cucumber", quantity: "50g" },
      { id: "5", name: "Olive Oil", quantity: "2 Tbsp" },
      { id: "6", name: "Lemon Juice", quantity: "To Taste" },
    ],
    steps: [
      { id: "1", step: "Grill the chicken breast until fully cooked." },
      { id: "2", step: "Chop all vegetables and mix in a bowl." },
      { id: "3", step: "Add grilled chicken to the salad." },
      { id: "4", step: "Drizzle olive oil and lemon juice on top." },
      { id: "5", step: "Serve fresh." },
    ],
  },
  {
    id: "5",
    title: "Lunch",
    mealName: "Grilled Chicken Salad",
    mealImage: images.lunch,
    calories: 350,
    type: "vegetarian",
    time: "35",
    ingredients: [
      { id: "1", name: "Chicken Breast", quantity: "200g" },
      { id: "2", name: "Lettuce", quantity: "100g" },
      { id: "3", name: "Tomato", quantity: "50g" },
      { id: "4", name: "Cucumber", quantity: "50g" },
      { id: "5", name: "Olive Oil", quantity: "2 Tbsp" },
      { id: "6", name: "Lemon Juice", quantity: "To Taste" },
    ],
    steps: [
      { id: "1", step: "Grill the chicken breast until fully cooked." },
      { id: "2", step: "Chop all vegetables and mix in a bowl." },
      { id: "3", step: "Add grilled chicken to the salad." },
      { id: "4", step: "Drizzle olive oil and lemon juice on top." },
      { id: "5", step: "Serve fresh." },
    ],
  },
];

export const workoutData = [
  {
    title: "Chest Workout",
    calories: "190",
    time: "25",
    category: "Quadriceps",
    image: images.chestWorkout,
    exercises: 5, // Number of exercises
    equipment: "Dumbbells", // Equipment needed
    level: "Intermediate", // Difficulty level
    description:
      "series of exercises designed to build strength and size. We’ll start with bench presses for overall mass, move on to push-ups for endurance, and finish with flyes to target the inner chest.",
  },
  {
    title: "Leg Workout",
    calories: "200",
    time: "30",
    category: "Legs",
    image: images.treadmill,
    exercises: 6,
    equipment: "Pull-up Bar",
    level: "Advanced",
    description:
      "series of exercises designed to build strength and size. We’ll start with bench presses for overall mass, move on to push-ups for endurance, and finish with flyes to target the inner chest.",
  },
  {
    title: "Back Workout",
    calories: "180",
    time: "28",
    category: "Back",
    image: images.sessionBg,
    exercises: 4,
    equipment: "Pull-up Bar",
    level: "Beginner",
    description:
      "series of exercises designed to build strength and size. We’ll start with bench presses for overall mass, move on to push-ups for endurance, and finish with flyes to target the inner chest.",
  },
  {
    title: "Arm Workout",
    calories: "160",
    time: "20",
    category: "Arms",
    image: images.chestWorkout,
    exercises: 3,
    equipment: "Dumbbells",
    level: "Intermediate",
    description:
      "series of exercises designed to build strength and size. We’ll start with bench presses for overall mass, move on to push-ups for endurance, and finish with flyes to target the inner chest.",
  },
  {
    title: "Core Workout",
    calories: "170",
    time: "22",
    category: "Core",
    image: images.chestWorkout,
    exercises: 4,
    equipment: "Treadmill",
    level: "Beginner",
    description:
      "series of exercises designed to build strength and size. We’ll start with bench presses for overall mass, move on to push-ups for endurance, and finish with flyes to target the inner chest.",
  },
];
