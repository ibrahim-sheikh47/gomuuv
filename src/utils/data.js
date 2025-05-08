import images from "../constants/images";
import StrengthIcon from "../assets/svgs/StrengthIcon";
import WeightLossIcon from "../assets/svgs/WeightLossIcon";
import MaintenanceIcon from "../assets/svgs/MaintenanceIcon";
import KetoIcon from "../assets/svgs/KetoIcon";
import VegetarianIcon from "../assets/svgs/VegetarianIcon";
import PersonalInfoIcon from "../assets/svgs/PersonalInfoIcon";
import SyncSecureIcon from "../assets/svgs/SyncSecureIcon";
import ChangePassIcon from "../assets/svgs/ChangePassIcon";

export const settings = [
  {
    icon: <PersonalInfoIcon />,
    text: "Personal Information",
    route: "PersonalInfoScreen",
  },
  {
    icon: <ChangePassIcon />,
    text: "Change Password",
    route: "ChangePassScreen",
  },
  {
    icon: <SyncSecureIcon />,
    text: "Sync and Secure Data",
    route: "Profile",
  },
];

export const nutritionPlans = [
  {
    id: "1",
    title: "Weight Loss Plan",
    type: "weight_loss_plan",
    icon: <WeightLossIcon />,
  },
  {
    id: "2",
    title: "Muscle Gain Plan",
    type: "muscle_gain_plan",
    icon: <StrengthIcon width={24} height={24} />,
  },
  {
    id: "3",
    title: "Maintenance Plan",
    type: "maintenance_plan",
    icon: <MaintenanceIcon />,
  },
  { id: "4", title: "Keto Plan", type: "keto_plan", icon: <KetoIcon /> },
  {
    id: "5",
    title: "Vegetarian Plan",
    type: "vegetarian_plan",
    icon: <VegetarianIcon />,
  },
];

export const extractNumberBeforeColon = (timeString) => {
  const parts = timeString.split(":");
  return parseInt(parts[0], 10);
};
