// import { AddToPhotos, Approval, Campaign, Category, Checklist, CollectionsBookmark, Person, Person4Outlined, PersonSearch } from "@mui/icons-material";

import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import ListAltIcon from "@mui/icons-material/ListAlt";

import { RouteInterface } from "@/types/IRoute";
import { Android, Assessment, Cloud, CloudUpload, Dashboard, LibraryBooks, ManageHistory, ModelTraining } from "@mui/icons-material";

export const ADMIN_ROUTES: Array<RouteInterface> = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: Dashboard,
  },
  {
    path: "/admin/manage/admin-users",
    label: "Admins",
    icon: PeopleIcon,
  },
  {
    path: "/admin/manage/users",
    label: "End Users",
    icon: PeopleIcon,
  },
  {
    path: "/admin/model-stats",
    label: "Model Stats",
    icon: ListAltIcon,
  },
  {
    path: "/admin/model-training",
    label: "Model Training",
    icon: ModelTraining,
  },
  {
    path: "/admin/activity-report",
    label: "Activity and Report",
    icon: Android,
  },
];

export const USERS_ROUTES: Array<RouteInterface> = [
  {
    path: "/user/dashboard",
    label: "Dashboard",
    icon: Dashboard,
  },
  {
    path: "/user/upload-file",
    label: "Upload File",
    icon: CloudUpload,
  },
  {
    path: "/user/scan-history",
    label: "Scan History",
    icon: ManageHistory,
  },
  {
    path: "/user/analysis-logs",
    label: "Analysis Logs",
    icon: Assessment,
  },
];