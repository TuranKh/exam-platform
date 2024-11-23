import {
  BookCheck,
  ChartColumn,
  Home as HomeIcon,
  Plus,
  Users as UsersIcon,
} from "lucide-react";

import Exam from "@/pages/exams/exam";
import Exams from "@/pages/exams";
import Home from "@/pages/home";
import Permissions from "@/pages/permissions";
import Users from "@/pages/users";
import UserExams from "@/pages/user-exams";

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
    component: <Exam />,
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
  {
    title: "İmtahanlar",
    url: "/available-exams",
    icon: BookCheck,
    component: <UserExams />,
  },
];
