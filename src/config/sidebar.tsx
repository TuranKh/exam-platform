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

export enum UserRole {
  Admin = 1,
  Student,
}

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
    allowedRole: UserRole.Admin,
  },
  {
    title: "Yeni imtahan",
    url: "/create-exam",
    icon: Plus,
    component: <Exam />,
    allowedRole: UserRole.Admin,
  },
  {
    title: "Imtahanlar",
    url: "/exams",
    icon: BookCheck,
    component: <Exams />,
    allowedRole: UserRole.Admin,
  },
  {
    title: "İstifadəçilər",
    url: "/users",
    icon: UsersIcon,
    component: <Users />,
    allowedRole: UserRole.Admin,
  },
  {
    title: "Mövcud imtahanlarım",
    url: "/available-exams",
    icon: BookCheck,
    component: <UserExams />,
    allowedRole: UserRole.Student,
  },
];
