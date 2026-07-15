import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  TrendingUp,
  Clock3,
  AlertTriangle,
} from "lucide-react";

const stats = [
  {
    title: "Today's Sales",
    value: "$12,450",
    change: "+18%",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "1,284",
    change: "+9%",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "5,432",
    change: "+2%",
    icon: Package,
  },
  {
    title: "Customers",
    value: "8,129",
    change: "+15%",
    icon: Users,
  },
  {
    title: "Pending Payments",
    value: "$18,240",
    change: "-6%",
    icon: CreditCard,
  },
  {
    title: "Revenue",
    value: "$248,350",
    change: "+24%",
    icon: TrendingUp,
  },
  {
    title: "Pending Orders",
    value: "324",
    change: "+4%",
    icon: Clock3,
  },
  {
    title: "Low Stock",
    value: "29",
    change: "Needs Attention",
    icon: AlertTriangle,
  },
];

export default function Page() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{item.title}</CardDescription>

              <item.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <CardTitle className="text-3xl">{item.value}</CardTitle>

              <p className="mt-2 text-sm text-green-600">{item.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Sales Analytics</CardTitle>

            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>

          <CardContent className="flex h-80 items-center justify-center rounded-lg border border-dashed">
            Sales Chart Here
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>

            <CardDescription>Current Month</CardDescription>
          </CardHeader>

          <CardContent className="flex h-80 items-center justify-center rounded-lg border border-dashed">
            Revenue Chart
          </CardContent>
        </Card>
      </div>

      {/* Bottom */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>

          <CardContent className="h-72 rounded-lg border border-dashed flex items-center justify-center">
            Orders Table
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>

          <CardContent className="h-72 rounded-lg border border-dashed flex items-center justify-center">
            Products List
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
