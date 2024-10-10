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

export const mealData = [
  {
    id: "1",
    title: "Breakfast",
    mealName: "Avocado Egg Toast",
    mealImage: images.breakfast,
    calories: 190,
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
    mealName: "Oatmeal with Fruits",
    mealImage: images.lunch,
    calories: 210,
    time: "30",
    ingredients: [
      { id: "1", name: "Oats", quantity: "1 cup" },
      { id: "2", name: "Milk", quantity: "1 cup" },
      { id: "3", name: "Banana", quantity: "1" },
      { id: "4", name: "Honey", quantity: "1 tablespoon" },
      { id: "5", name: "Berries", quantity: "1/2 cup" },
    ],
    steps: [
      { id: "1", step: "Wash all vegetables thoroughly." },
      { id: "2", step: "Chop the lettuce, tomatoes, and cucumber." },
      { id: "3", step: "Mix all ingredients in a large bowl." },
      { id: "4", step: "Add dressing and mix well." },
      { id: "5", step: "Serve fresh with optional toppings." },
    ],
  },
];

export const popularRecipes = [
  {
    id: "1",
    title: "Lunch",
    mealName: "Oatmeal with Fruits",
    mealImage: images.lunch,
    calories: 210,
    time: "30",
    ingredients: [
      { id: "1", name: "Oats", quantity: "1 cup" },
      { id: "2", name: "Milk", quantity: "1 cup" },
      { id: "3", name: "Banana", quantity: "1" },
      { id: "4", name: "Honey", quantity: "1 tablespoon" },
      { id: "5", name: "Berries", quantity: "1/2 cup" },
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
    title: "Breakfast",
    mealName: "Avocado Egg Toast",
    mealImage: images.breakfast,
    calories: 190,
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
];
export const nutritionPlans = [
  { id: "1", title: "Weight Loss Plan", icon: icons.weightLoss },
  { id: "2", title: "Muscle Gain Plan", icon: icons.muscleGain },
  { id: "3", title: "Maintenance Plan", icon: icons.maintenance },
  { id: "4", title: "Keto Plan", icon: icons.keto },
  { id: "5", title: "Vegetarian Plan", icon: icons.vegetarian },
];
