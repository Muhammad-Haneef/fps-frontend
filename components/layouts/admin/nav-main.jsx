"use client";

import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRightIcon, Gauge } from "lucide-react";

import { ADMIN } from "@/constants/paths";

import {
  Contact,
  BadgeDollarSign,
  ShoppingBag,
  BookOpen,
  ScanBarcode,
  PrinterCheck,
  Landmark,
  Users,
  Megaphone,
  UserPen,
  Settings,
} from "lucide-react";

export function NavMain() {
  const menu = [
    {
      title: "Manage Contacts",
      url: "#",
      icon: <Contact />,
      isActive: true,
      items: [
        {
          title: "Contacts",
          url: ADMIN.CONTACTS.LIST,
        },
        {
          title: "Companies",
          url: ADMIN.COMPANIES.LIST,
        },
      ],
    },
    {
      title: "Sales & Invoices",
      url: "#",
      icon: <BadgeDollarSign />,
      items: [
        {
          title: "Clients & Prospects",
          url: ADMIN.COMPANIES.LIST+"?type=2",
        },
        {
          title: "Quotation & Estimates",
          url: ADMIN.QUOTATIONS.LIST,
        },
        {
          title: "Proforma Invoices",
          url: ADMIN.PROFORMA_INVOICES.LIST,
        },
        {
          title: "Invoices",
          url:  ADMIN.INVOICES.LIST,
        },
        {
          title: "Payment Receipts",
          url: ADMIN.PAYMENT_RECEIPTS.LIST,
        },
        {
          title: "Sales Orders",
          url: ADMIN.SALES_ORDERS.LIST,
        },
        {
          title: "Delivery Challans",
          url: ADMIN.DELIVERY_CHALLANS.LIST,
        },
        {
          title: "Credit Notes",
          url: ADMIN.CREDIT_NOTES.LIST,
        },
      ],
    },
    {
      title: "Purchases & Expenses",
      url: "#",
      icon: <ShoppingBag />,
      items: [
        {
          title: "Vendors & Suppliers",
          url: ADMIN.COMPANIES.LIST+"?type=1",
        },
        {
          title: "Purchases & Expenses",
          url: ADMIN.EXPENDITURES.LIST,
        },
        {
          title: "Payout Receipts",
          url: ADMIN.PAYOUT_RECEIPTS.LIST,
        },
        {
          title: "Purchase Orders",
          url: ADMIN.PURCHASE_ORDERS.LIST,
        },
        {
          title: "Debit Notes",
          url: ADMIN.DEBIT_NOTES.LIST,
        },
        {
          title: "Hire The Best Vendors",
          url: "#",
        },
      ],
    },
    {
      title: "Accounting",
      url: "#",
      icon: <BookOpen />,
      items: [
        {
          title: "Account Groups",
          url: ADMIN.ACCOUNT_GROUPS.LIST,
        },
        {
          title: "Chart of Accounts",
          url: ADMIN.CHART_OF_ACCOUNTS.LIST,
        },
        {
          title: "Voucher Books",
          url: ADMIN.VOUCHER_BOOKS.LIST,
        },
        {
          title: "Balance Sheet",
          url: "#",
        },
        {
          title: "Trial Balance",
          url: "#",
        },
        {
          title: "Profit & Loss",
          url: "#",
        },
        {
          title: "Income Statement",
          url: "#",
        },
        {
          title: "All Ledgers Master Report",
          url: "#",
        },
        {
          title: "Day Book",
          url: "#",
        },
        {
          title: "Cash Flow Statement",
          url: "#",
        },
      ],
    },
    {
      title: "Products & Inventory",
      url: "#",
      icon: <ScanBarcode />,
      items: [
        {
          title: "All Items",
          url: ADMIN.ITEMS.LIST,
        },
        {
          title: "Warehouses",
          url: ADMIN.WAREHOUSES.LIST,
        },
        {
          title: "Product-wise P&L",
          url: "#",
        },
        {
          title: "Stock Value Report",
          url: "#",
        },
        {
          title: "Batch Expiry Report",
          url: "#",
        },
        {
          title: "Party Transactions Report",
          url: "#",
        },
        {
          title: "All Transactions Report",
          url: "#",
        },
        {
          title: "Stock Status Report",
          url: "#",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: <PrinterCheck />,
      items: [
        {
          title: "Custom Reports",
          url: ADMIN.CUSTOM_REPORTS.LIST,
        },
        {
          title: "Reports",
          url: ADMIN.REPORTS.LIST,
        },
      ],
    },
    {
      title: "Banking & Payments",
      url: "#",
      icon: <Landmark />,
      items: [
        {
          title: "Payment Accounts",
          url: ADMIN.PAYMENT_ACCOUNTS.LIST,
        },
        {
          title: "Bank Accounts",
          url: ADMIN.BANK_ACCOUNTS.LIST,
        },
        {
          title: "Employee Accounts",
          url: ADMIN.EMPLOYEE_ACCOUNTS.LIST,
        },
        {
          title: "Bank Reconciliation",
          url: ADMIN.BANK_RECONCILIATION.LIST,
        },
      ],
    },
    {
      title: "Team Management",
      url: "#",
      icon: <Users />,
      items: [
        {
          title: "Manage Users",
          url: ADMIN.USERS.LIST,
        },
        {
          title: "Manage Team Roles",
          url: ADMIN.ROLES.LIST,
        },
      ],
    },
    {
      title: "Greetings",
      url: "#",
      icon: <Megaphone />,
      items: [
        {
          title: "Create New",
          url: ADMIN.GREETINGS.ADD,
        },
        {
          title: "View All",
          url: ADMIN.GREETINGS.LIST,
        },
      ],
    },
    {
      title: "Profile",
      url: "#",
      icon: <UserPen />,
      items: [
        {
          title: "View Profile",
          url: ADMIN.PROFILE.VIEW,
        },
        {
          title: "Edit Profile",
          url: ADMIN.PROFILE.EDIT,
        },
        {
          title: "Manage Testimonials",
          url: ADMIN.TESTIMONIALS.LIST,
        },
      ],
    },
    {
      title: "System Settings",
      url: "#",
      icon: <Settings />,
      items: [
        {
          title: "Business Settings",
          url: ADMIN.BUSINESS_SETTINGS.LIST,
        },
        {
          title: "Integrations",
          url: ADMIN.INTEGRATIONS.LIST,
        },
      ],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuButton render={<Link href={ADMIN.DASHBOARD} />}>
          <Gauge />
          <span>Dashboard</span>
        </SidebarMenuButton>
        {menu?.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen={item.isActive}
            className="group/collapsible"
            render={<SidebarMenuItem />}
          >
            <CollapsibleTrigger
              render={<SidebarMenuButton tooltip={item.title} />}
            >
              {item.icon}
              <span>{item.title}</span>
              <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton render={<a href={subItem.url} />}>
                      <span>{subItem.title}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
