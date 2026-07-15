"use client";

import { useState } from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useChartOfAccountStore } from "@/stores/useChartOfAccountStore";

import DropDownByStore from "@/components/lookups/dropdown-by-store";

export default function Account() {
  const [selectedOpt, setSelectedOpt] = useState("yes");

  return (
    <div className="p-4">
      <RadioGroup
        value={selectedOpt}
        onValueChange={setSelectedOpt}
        className="flex flex-col md:flex-row gap-4"
      >
        <FieldLabel htmlFor="opt1" className="flex-1">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Don't create</FieldTitle>
              <FieldDescription>
                For individuals and small teams.
              </FieldDescription>
            </FieldContent>

            <RadioGroupItem
              value="no"
              id="opt1"
              name="create_ledger"
            />
          </Field>
        </FieldLabel>

        <FieldLabel htmlFor="opt2" className="flex-1">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Create new ledger</FieldTitle>
              <FieldDescription>
                For growing businesses.
              </FieldDescription>
            </FieldContent>

            <RadioGroupItem
              value="yes"
              id="opt2"
              name="create_ledger"
            />
          </Field>
        </FieldLabel>

        <FieldLabel htmlFor="opt3" className="flex-1">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Link an existing ledger</FieldTitle>
              <FieldDescription>
                For large teams and enterprises.
              </FieldDescription>
            </FieldContent>

            <RadioGroupItem
              value="link"
              id="opt3"
              name="create_ledger"
            />
          </Field>
        </FieldLabel>
      </RadioGroup>

      {selectedOpt === "link" && (
        <div className="mt-4">
          <DropDownByStore
                name="chart_of_account_id"
                label="Ledger"
                useStore={useChartOfAccountStore}
              />
        </div>
      )}
    </div>
  );
}