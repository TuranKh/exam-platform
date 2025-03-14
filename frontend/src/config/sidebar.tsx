import {
  BookCheck,
  ChartColumn,
  Group,
  Home as HomeIcon,
  Plus,
  Users as UsersIcon,
} from "lucide-react";

import Exam from "@/pages/exams/exam";
import Exams from "@/pages/exams";
import Permissions from "@/pages/permissions";
import Users from "@/pages/users";
import UserExams from "@/pages/user-exams";
import Groups from "@/pages/groups";
import AdminStatistics from "@/pages/statistics/admin";
import { allowedNodeEnvironmentFlags } from "process";
import UserStatistics from "@/pages/statistics/user";

export enum UserRole {
  Admin = 1,
  Student,
}
export enum SidebarPage {
  AdminStatistics,
  UserStatistics,
  Permissions,
  CreateExam,
  Exams,
  Users,
  Groups,
  AvailableExams,
}

export const sidebarRoutes = [
  {
    id: SidebarPage.AdminStatistics,
    title: "Ana səhifə",
    url: "/home",
    icon: HomeIcon,
    component: <AdminStatistics />,
    allowedRole: UserRole.Admin,
  },
  {
    id: SidebarPage.UserStatistics,
    title: "Ana səhifə",
    url: "/home",
    icon: HomeIcon,
    component: <UserStatistics />,
    allowedRole: UserRole.Student,
  },
  {
    id: SidebarPage.Permissions,
    title: "İcazələr",
    url: "/permissions",
    icon: ChartColumn,
    component: <Permissions />,
    allowedRole: UserRole.Admin,
  },
  {
    id: SidebarPage.CreateExam,
    title: "Yeni imtahan",
    url: "/create-exam",
    icon: Plus,
    component: <Exam />,
    allowedRole: UserRole.Student,
  },
  {
    id: SidebarPage.Exams,
    title: "Imtahanlar",
    url: "/exams",
    icon: BookCheck,
    component: <Exams />,
    allowedRole: UserRole.Admin,
  },
  {
    id: SidebarPage.Users,
    title: "İstifadəçilər",
    url: "/users",
    icon: UsersIcon,
    component: <Users />,
    allowedRole: UserRole.Admin,
  },
  {
    id: SidebarPage.Groups,
    title: "Qruplar",
    url: "/groups",
    icon: Group,
    component: <Groups />,
    allowedRole: UserRole.Admin,
  },
  {
    id: SidebarPage.AvailableExams,
    title: "Mövcud imtahanlarım",
    url: "/available-exams",
    icon: BookCheck,
    component: <UserExams />,
    allowedRole: UserRole.Student,
  },
];
