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
