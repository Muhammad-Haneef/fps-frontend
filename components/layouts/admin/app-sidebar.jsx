"use client";

import { NavMain } from "@/components/layouts/admin/nav-main";
import { NavUser } from "@/components/layouts/admin/nav-user";
import { CompanySwitcher } from "@/components/layouts/admin/company-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  FrameIcon,
  PieChartIcon,
  MapIcon,
} from "lucide-react";

// Sample data
const data = {
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapIcon />,
    },
  ],
};

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanySwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}