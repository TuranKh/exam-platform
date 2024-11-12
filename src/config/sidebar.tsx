import {
  BookCheck,
  ChartColumn,
  Home as HomeIcon,
  Plus,
  Users as UsersIcon,
} from "lucide-react";

import CreateExam from "@/pages/create-exam";
import Exams from "@/pages/exams";
import Home from "@/pages/home";
import Permissions from "@/pages/permissions";
import Users from "@/pages/users";

export const sidebarRoutes = [
  {
    title: "Ana səhifə",
    url: "/home",
    icon: HomeIcon,
    component: <Home />,
  },
  {
    title: "İcazələr",
    url: "/permissions",
    icon: ChartColumn,
    component: <Permissions />,
  },
  {
    title: "Yeni imtahan",
    url: "/create-exam",
    icon: Plus,
    component: <CreateExam />,
  },
  {
    title: "Mövcud imtahanlarım",
    url: "/exams",
    icon: BookCheck,
    component: <Exams />,
  },
  {
    title: "İstifadəçilər",
    url: "/users",
    icon: UsersIcon,
    component: <Users />,
  },
];
