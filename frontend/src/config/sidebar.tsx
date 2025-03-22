import {
  BookCheck,
  ChartColumn,
  Group,
  Home as HomeIcon,
  Plus,
  Users as UsersIcon,
} from "lucide-react";

import Exams from "@/pages/exams";
import Exam from "@/pages/exams/exam";
import Groups from "@/pages/groups";
import Permissions from "@/pages/permissions";
import UserExams from "@/pages/user-exams";
import Users from "@/pages/users";
import Home from "@/pages/home";

export enum UserRole {
  Admin = 1,
  Student,
  All,
}
export enum SidebarPage {
  Statistics,
  Permissions,
  CreateExam,
  Exams,
  Users,
  Groups,
  AvailableExams,
}

export const sidebarRoutes = [
  {
    id: SidebarPage.Statistics,
    title: "Ana səhifə",
    url: "/home",
    icon: HomeIcon,
    component: <Home />,
    allowedRole: UserRole.All,
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
    allowedRole: UserRole.Admin,
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
