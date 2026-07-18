"use client";

import { use, useEffect } from "react";

import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2, Copy, ChevronUp, ChevronDown, ChevronsUpDown, ImagePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TextInput,
  TextareaInput,
  NumberInput,
  SelectInput,
  MultiImageUpload,
} from "@/components/form";
import {
  STORE_OPTIONS,
  UNIT_OPTIONS,
  CURRENCY_SYMBOLS,
  lineTotals,
  money,
  makeLineItem,
  makeGroup,
  makeGroupItem,
} from "./calculations";

import { useUnitsStore } from "@/stores/meta-data/useUnitsStore";
import { useWarehouseStore } from "@/stores/useWarehouseStore";
import { useItemStore } from "@/stores/useItemStore";

function IconBtn({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="size-7 inline-flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

export default function ItemsTable() {
  const { control } = useFormContext();
  const currency = useWatch({ control, name: "currency" }) || "PKR";
  const symbol = CURRENCY_SYMBOLS[currency] || "";

  const itemsArray = useFieldArray({ control, name: "items" });
  const groupsArray = useFieldArray({ control, name: "groups" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Items</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="hidden md:grid grid-cols-12 gap-2 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-md">
          <div className="col-span-4">Item Description</div>
          <div className="col-span-2">Rate</div>
          <div className="col-span-1">Qty</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-1">Tax %</div>
          <div className="col-span-1">Tax</div>
          <div className="col-span-1">Total</div>
        </div>

        {itemsArray.fields.map((field, index) => (
          <LineItemRow
            key={field.id}
            index={index}
            symbol={symbol}
            canMoveUp={index > 0}
            canMoveDown={index < itemsArray.fields.length - 1}
            onMoveUp={() => itemsArray.swap(index, index - 1)}
            onMoveDown={() => itemsArray.swap(index, index + 1)}
            onDuplicate={() => itemsArray.insert(index + 1, { ...itemsArray.fields[index] })}
            onRemove={() => itemsArray.fields.length > 1 && itemsArray.remove(index)}

          />
        ))}

        {groupsArray.fields.map((field, gIndex) => (
          <GroupCard
            key={field.id}
            groupIndex={gIndex}
            symbol={symbol}
            canMoveUp={gIndex > 0}
            canMoveDown={gIndex < groupsArray.fields.length - 1}
            onMoveUp={() => groupsArray.swap(gIndex, gIndex - 1)}
            onMoveDown={() => groupsArray.swap(gIndex, gIndex + 1)}
            onDuplicate={() => groupsArray.insert(gIndex + 1, { ...groupsArray.fields[gIndex] })}
            onRemove={() => groupsArray.remove(gIndex)}
          />
        ))}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <Button type="button" variant="outline" className="border-dashed" onClick={() => itemsArray.append(makeLineItem())}>
            <Plus className="w-4 h-4 mr-1.5" /> Add New Line
          </Button>
          <Button type="button" variant="outline" className="border-dashed" onClick={() => groupsArray.append(makeGroup())}>
            <Plus className="w-4 h-4 mr-1.5" /> Add New Group
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Single line item row                                                 */
/* ------------------------------------------------------------------ */

function LineItemRow({ index, symbol, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDuplicate, onRemove }) {

  const getUnits = useUnitsStore((s) => s.getForDropdown);
  const units = useUnitsStore((s) => s.forDropdown);
  const unitsLoading = useUnitsStore((s) => s.loading);

  const getWarehouses = useWarehouseStore((s) => s.getForDropdown);
  const warehouses = useWarehouseStore((s) => s.forDropdown);
  const warehousesLoading = useWarehouseStore((s) => s.loading);

  const getItems = useItemStore((s) => s.getForDropdown);
  const items = useItemStore((s) => s.forDropdown);
  const itemsLoading = useItemStore((s) => s.loading);

  useEffect(() => {
    getUnits();
    getWarehouses();
    getItems();
  }, [getUnits, getWarehouses, getItems]);

  const { control, setValue } = useFormContext();
  const row = useWatch({ control, name: `items.${index}` });
  const showDescription = useWatch({ control, name: `items.${index}.showDescription` });
  const showImages = useWatch({ control, name: `items.${index}.showImages` });
  const collapsed = useWatch({ control, name: `items.${index}.collapsed` });
  const t = lineTotals(row || {});

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b">
        <span className="text-xs font-semibold text-muted-foreground">{index + 1}.</span>
        <div className="flex items-center gap-0.5">
          <IconBtn label="Move up" onClick={onMoveUp} disabled={!canMoveUp}><ChevronUp className="w-4 h-4" /></IconBtn>
          <IconBtn label="Move down" onClick={onMoveDown} disabled={!canMoveDown}><ChevronDown className="w-4 h-4" /></IconBtn>
          <IconBtn label="Collapse" onClick={() => setValue(`items.${index}.collapsed`, !collapsed)}><ChevronsUpDown className="w-4 h-4" /></IconBtn>
          <IconBtn label="Duplicate" onClick={onDuplicate}><Copy className="w-4 h-4" /></IconBtn>
          <IconBtn label="Remove" onClick={onRemove}><Trash2 className="w-4 h-4" /></IconBtn>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-3">
        <div className="grid grid-cols-12 gap-2 items-start">
          <div className="col-span-12 md:col-span-4">
            <SelectInput name={`items.${index}.item`} label="" loading={itemsLoading} options={items} placeholder="Select item" />
          </div>
          <div className="col-span-6 md:col-span-2">
            <NumberInput name={`items.${index}.rate`} label="" placeholder="0.00" min={0} />
          </div>
          <div className="col-span-6 md:col-span-1">
            <NumberInput name={`items.${index}.qty`} label="" placeholder="1" min={0} />
          </div>
          <div className="col-span-6 md:col-span-2 text-sm font-medium pt-2 text-right pr-1">{money(t.amount, symbol)}</div>
          <div className="col-span-6 md:col-span-1">
            <NumberInput name={`items.${index}.taxRate`} label="" placeholder="0" min={0} max={100} />
          </div>
          <div className="col-span-6 md:col-span-1 text-sm pt-2 text-right">{money(t.tax, symbol)}</div>
          <div className="col-span-6 md:col-span-1 text-sm font-bold pt-2 text-right">{money(t.total, symbol)}</div>
        </div>

        {!collapsed && (
          <>
            <div>
              <button
                type="button"
                onClick={() => setValue(`items.${index}.showDescription`, !showDescription)}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2"
              >
                {showDescription ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />} Description
              </button>
              {showDescription && <TextareaInput name={`items.${index}.description`} label="" placeholder="Description" rows={3} />}
            </div>

            {!showImages ? (
              <Button type="button" variant="outline" size="sm" className="self-start border-dashed" onClick={() => setValue(`items.${index}.showImages`, true)}>
                <ImagePlus className="w-4 h-4 mr-1.5" /> Upload Image
              </Button>
            ) : (
              <MultiImageUpload name={`items.${index}.images`} label="Images" maxFiles={4} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectInput name={`items.${index}.unit`} label="Product Unit" loading={unitsLoading} options={units} placeholder="Select unit" />
              <SelectInput name={`items.${index}.warehouse`} label="Store" loading={warehousesLoading} options={warehouses} placeholder="Select store" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Group card — a titled bundle of items                               */
/* ------------------------------------------------------------------ */

function GroupCard({ groupIndex, symbol, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDuplicate, onRemove }) {
  const { control, setValue } = useFormContext();
  const collapsed = useWatch({ control, name: `groups.${groupIndex}.collapsed` });
  const showImages = useWatch({ control, name: `groups.${groupIndex}.showImages` });
  const itemsArray = useFieldArray({ control, name: `groups.${groupIndex}.items` });

  return (
    <div className="rounded-lg border overflow-hidden bg-muted/20">
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b gap-3">
        <div className="flex-1 max-w-xs">
          <TextInput name={`groups.${groupIndex}.title`} label="" placeholder="Group title" is_required />
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <IconBtn label="Move up" onClick={onMoveUp} disabled={!canMoveUp}><ChevronUp className="w-4 h-4" /></IconBtn>
          <IconBtn label="Move down" onClick={onMoveDown} disabled={!canMoveDown}><ChevronDown className="w-4 h-4" /></IconBtn>
          <IconBtn label="Collapse" onClick={() => setValue(`groups.${groupIndex}.collapsed`, !collapsed)}><ChevronsUpDown className="w-4 h-4" /></IconBtn>
          <IconBtn label="Duplicate" onClick={onDuplicate}><Copy className="w-4 h-4" /></IconBtn>
          <IconBtn label="Remove" onClick={onRemove}><Trash2 className="w-4 h-4" /></IconBtn>
        </div>
      </div>

      {!collapsed && (
        <div className="p-3 flex flex-col gap-3">
          {!showImages ? (
            <Button type="button" variant="outline" size="sm" className="self-start border-dashed" onClick={() => setValue(`groups.${groupIndex}.showImages`, true)}>
              <ImagePlus className="w-4 h-4 mr-1.5" /> Upload Image
            </Button>
          ) : (
            <MultiImageUpload name={`groups.${groupIndex}.images`} label="Group Images" maxFiles={4} />
          )}

          {itemsArray.fields.map((field, i) => (
            <GroupItemRow
              key={field.id}
              groupIndex={groupIndex}
              itemIndex={i}
              symbol={symbol}
              canMoveUp={i > 0}
              canMoveDown={i < itemsArray.fields.length - 1}
              onMoveUp={() => itemsArray.swap(i, i - 1)}
              onMoveDown={() => itemsArray.swap(i, i + 1)}
              onDuplicate={() => itemsArray.insert(i + 1, { ...itemsArray.fields[i] })}
              onRemove={() => itemsArray.fields.length > 1 && itemsArray.remove(i)}
            />
          ))}

          <Button type="button" variant="ghost" size="sm" className="self-start text-primary" onClick={() => itemsArray.append(makeGroupItem())}>
            <Plus className="w-4 h-4 mr-1.5" /> Add item to group
          </Button>
        </div>
      )}
    </div>
  );
}

function GroupItemRow({ groupIndex, itemIndex, symbol, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDuplicate, onRemove }) {
  const { control, setValue } = useFormContext();
  const base = `groups.${groupIndex}.items.${itemIndex}`;
  const row = useWatch({ control, name: base });
  const showDescription = useWatch({ control, name: `${base}.showDescription` });
  const showImages = useWatch({ control, name: `${base}.showImages` });
  const t = lineTotals(row || {});

  return (
    <div className="rounded-lg border bg-background p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">{itemIndex + 1}.</span>
        <div className="flex items-center gap-0.5">
          <IconBtn label="Move up" onClick={onMoveUp} disabled={!canMoveUp}><ChevronUp className="w-4 h-4" /></IconBtn>
          <IconBtn label="Move down" onClick={onMoveDown} disabled={!canMoveDown}><ChevronDown className="w-4 h-4" /></IconBtn>
          <IconBtn label="Duplicate" onClick={onDuplicate}><Copy className="w-4 h-4" /></IconBtn>
          <IconBtn label="Remove" onClick={onRemove}><Trash2 className="w-4 h-4" /></IconBtn>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-start">
        <div className="col-span-12 md:col-span-4">
          <TextInput name={`${base}.name`} label="" placeholder="Item name / SKU" is_required />
        </div>
        <div className="col-span-6 md:col-span-2">
          <NumberInput name={`${base}.rate`} label="" placeholder="0.00" min={0} />
        </div>
        <div className="col-span-6 md:col-span-1">
          <NumberInput name={`${base}.qty`} label="" placeholder="1" min={0} />
        </div>
        <div className="col-span-6 md:col-span-2 text-sm font-medium pt-2 text-right pr-1">{money(t.amount, symbol)}</div>
        <div className="col-span-6 md:col-span-1">
          <NumberInput name={`${base}.taxRate`} label="" placeholder="0" min={0} max={100} />
        </div>
        <div className="col-span-6 md:col-span-2 text-sm font-bold pt-2 text-right">{money(t.total, symbol)}</div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={() => setValue(`${base}.showDescription`, !showDescription)} className="text-xs text-muted-foreground hover:text-foreground">
          {showDescription ? "Hide Description" : "+ Add Description"}
        </button>
        <button type="button" onClick={() => setValue(`${base}.showImages`, !showImages)} className="text-xs text-muted-foreground hover:text-foreground">
          {showImages ? "Hide Image" : "+ Add Image"}
        </button>
        <div className="w-40">
          <SelectInput name={`${base}.unit`} label="" options={units} placeholder="Unit" />
        </div>
      </div>

      {showDescription && <TextareaInput name={`${base}.description`} label="" placeholder="Description" rows={2} />}
      {showImages && <MultiImageUpload name={`${base}.images`} label="" maxFiles={4} />}
    </div>
  );
}
