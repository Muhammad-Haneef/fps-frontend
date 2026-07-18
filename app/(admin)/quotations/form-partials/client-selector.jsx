"use client";

import { useState, useEffect } from "react";

import { useFormContext, useWatch } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectInput } from "@/components/form";

import { useCompanyStore } from "@/stores/useCompanyStore";

export default function ClientSelector() {
  const { control, setValue } = useFormContext();
  const clientId = useWatch({ control, name: "clientId" });

  const getClients = useCompanyStore((s) => s.getForDropdown);
  const clients = useCompanyStore((s) => s.forDropdown);
  const clientsLoading = useCompanyStore((s) => s.loading);

  useEffect(() => {
    getClients(0);
  }, [getClients]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotation For</CardTitle>
        <CardDescription>Client's details</CardDescription>
      </CardHeader>
      <CardContent>
        <SelectInput
          name="client_id"
          label="Client"
          placeholder="Select a client"
          options={clients}
          is_required={true}
          loading={clientsLoading}
          onValueChange={(cid) => setValue("client", clients.find((c) => c.id === cid) || null)}
        />
        {/*
        {!clientId && (
          <div className="mt-4 rounded-lg border border-dashed p-6 text-center flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">Select a client from the list</p>
            <p className="text-xs text-muted-foreground">OR</p>
            <button
              type="button"
              onClick={() => {
                setValue("clientId", "c1");
                setValue("client", CLIENT_OPTIONS[0]);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2"
            >
              <UserPlus className="w-4 h-4" /> Add New Client
            </button>
          </div>
        )}
        */}
      </CardContent>
    </Card>
  );
}
