"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AppBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex flex-wrap items-center gap-1.5 border bg-muted/40 px-3 py-1 text-[11px] text-muted-foreground">
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink
            render={
              <Link
                href="/"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
            }
          />
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          // Convert "warehouse-management" => "Warehouse Management"
          const label = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={
                      <Link href={href} className="hover:text-foreground">
                        {label}
                      </Link>
                    }
                  />
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}