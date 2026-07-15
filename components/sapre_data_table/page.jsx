import { columns } from "./columns";
import { DataTable } from "@/components/data-tables/simple/data-table";
//import { DataTable } from "./data-table";

async function getData() {
  // Fetch data from your API here.
  const statuses = ["pending", "processing", "completed", "cancelled"];

  const data = Array.from({ length: 100 }, (_, index) => ({
    id: String(index + 1),
    amount: Math.floor(Math.random() * 900) + 100, // 100 - 999
    status: statuses[index % statuses.length],
    email: `user${index + 1}@example.com`,
  }));

  return data;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}