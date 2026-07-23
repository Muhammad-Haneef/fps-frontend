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
  const show_description = useWatch({ control, name: `items.${index}.show_description` });
  const show_images = useWatch({ control, name: `items.${index}.show_images` });
  const collapsed = useWatch({ control, name: `items.${index}.collapsed` });
  const selectedItemId = useWatch({ control, name: `items.${index}.item` });
  const t = lineTotals(row || {});

  // Auto-fill rate, description and images when an item is selected from the dropdown.
  useEffect(() => {
    if (!selectedItemId || !items?.length) return;

    const selected = items.find(
      (i) => String(i.id || i.value) === String(selectedItemId)
    );
    if (!selected) return;

    if (selected.selling_price !== undefined && selected.selling_price !== null) {
      setValue(`items.${index}.selling_price`, selected.selling_price, { shouldDirty: true });
    }

    const nameVal = selected.title || selected.label || selected.name;
    if (nameVal) {
      setValue(`items.${index}.name`, nameVal, { shouldDirty: true });
    }

    const unitVal = selected.qty_unit_id || selected.qty_unit || selected.unit || selected.unit_id;
    if (unitVal) {
      setValue(`items.${index}.qty_unit_id`, String(unitVal), { shouldDirty: true });
    }

    if (selected.description) {
      setValue(`items.${index}.description`, selected.description, { shouldDirty: true });
      setValue(`items.${index}.show_description`, true, { shouldDirty: true });
    }

    if (selected.images?.length) {
      setValue(`items.${index}.images`, selected.images, { shouldDirty: true });
      setValue(`items.${index}.show_images`, true, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemId, items]);

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
            <NumberInput name={`items.${index}.selling_price`} label="" placeholder="0.00" min={0} allowDecimal maxDecimals={2} />
          </div>
          <div className="col-span-6 md:col-span-1">
            <NumberInput name={`items.${index}.qty`} label="" placeholder="1" min={0} allowDecimal />
          </div>
          <div className="col-span-6 md:col-span-2 text-sm font-medium pt-2 text-right pr-1">{money(t.amount, symbol)}</div>
          <div className="col-span-6 md:col-span-1">
            <NumberInput name={`items.${index}.tax_rate`} label="" placeholder="0" min={0} max={100} allowDecimal />
          </div>
          <div className="col-span-6 md:col-span-1 text-sm pt-2 text-right">{money(t.tax, symbol)}</div>
          <div className="col-span-6 md:col-span-1 text-sm font-bold pt-2 text-right">{money(t.total, symbol)}</div>
        </div>

        {!collapsed && (
          <>
            <div>
              <button
                type="button"
                onClick={() => setValue(`items.${index}.show_description`, !show_description)}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2"
              >
                {show_description ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />} Description
              </button>
              {show_description && <TextareaInput name={`items.${index}.description`} label="" placeholder="Description" rows={3} />}
            </div>

            {!show_images ? (
              <Button type="button" variant="outline" size="sm" className="self-start border-dashed" onClick={() => setValue(`items.${index}.show_images`, true)}>
                <ImagePlus className="w-4 h-4 mr-1.5" /> Upload Image
              </Button>
            ) : (
              <MultiImageUpload name={`items.${index}.images`} label="Images" maxFiles={4} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectInput name={`items.${index}.qty_unit_id`} label="Product Unit" loading={unitsLoading} options={units} placeholder="Select unit" />
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
  const show_images = useWatch({ control, name: `groups.${groupIndex}.show_images` });
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
          {!show_images ? (
            <Button type="button" variant="outline" size="sm" className="self-start border-dashed" onClick={() => setValue(`groups.${groupIndex}.show_images`, true)}>
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
  const base = `groups.${groupIndex}.items.${itemIndex}`;
  const row = useWatch({ control, name: base });
  const show_description = useWatch({ control, name: `${base}.show_description` });
  const show_images = useWatch({ control, name: `${base}.show_images` });
  const collapsed = useWatch({ control, name: `${base}.collapsed` });
  const selectedItemId = useWatch({ control, name: `${base}.item` });
  const t = lineTotals(row || {});

  // Auto-fill rate, description and images when an item is selected from the dropdown.
  useEffect(() => {
    if (!selectedItemId || !items?.length) return;

    const selected = items.find(
      (i) => String(i.id || i.value) === String(selectedItemId)
    );
    if (!selected) return;

    if (selected.selling_price !== undefined && selected.selling_price !== null) {
      setValue(`${base}.selling_price`, selected.selling_price, { shouldDirty: true });
    }

    const nameVal = selected.title || selected.label || selected.name;
    if (nameVal) {
      setValue(`${base}.name`, nameVal, { shouldDirty: true });
    }

    const unitVal = selected.qty_unit_id || selected.qty_unit || selected.unit || selected.unit_id;
    if (unitVal) {
      setValue(`${base}.qty_unit_id`, String(unitVal), { shouldDirty: true });
    }

    if (selected.description) {
      setValue(`${base}.description`, selected.description, { shouldDirty: true });
      setValue(`${base}.show_description`, true, { shouldDirty: true });
    }

    if (selected.images?.length) {
      setValue(`${base}.images`, selected.images, { shouldDirty: true });
      setValue(`${base}.show_images`, true, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemId, items]);

  return (
    <div className="rounded-lg border overflow-hidden bg-background">
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b">
        <span className="text-xs font-semibold text-muted-foreground">{itemIndex + 1}.</span>
        <div className="flex items-center gap-0.5">
          <IconBtn label="Move up" onClick={onMoveUp} disabled={!canMoveUp}><ChevronUp className="w-4 h-4" /></IconBtn>
          <IconBtn label="Move down" onClick={onMoveDown} disabled={!canMoveDown}><ChevronDown className="w-4 h-4" /></IconBtn>
          <IconBtn label="Collapse" onClick={() => setValue(`${base}.collapsed`, !collapsed)}><ChevronsUpDown className="w-4 h-4" /></IconBtn>
          <IconBtn label="Duplicate" onClick={onDuplicate}><Copy className="w-4 h-4" /></IconBtn>
          <IconBtn label="Remove" onClick={onRemove}><Trash2 className="w-4 h-4" /></IconBtn>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-3">
        <div className="grid grid-cols-12 gap-2 items-start">
          <div className="col-span-12 md:col-span-4">
            <SelectInput name={`${base}.item`} label="" loading={itemsLoading} options={items} placeholder="Select item" />
          </div>
          <div className="col-span-6 md:col-span-2">
            <NumberInput name={`${base}.selling_price`} label="" placeholder="0.00" min={0} allowDecimal maxDecimals={2} />
          </div>
          <div className="col-span-6 md:col-span-1">
            <NumberInput name={`${base}.qty`} label="" placeholder="1" min={0} allowDecimal />
          </div>
          <div className="col-span-6 md:col-span-2 text-sm font-medium pt-2 text-right pr-1">{money(t.amount, symbol)}</div>
          <div className="col-span-6 md:col-span-1">
            <NumberInput name={`${base}.tax_rate`} label="" placeholder="0" min={0} max={100} allowDecimal />
          </div>
          <div className="col-span-6 md:col-span-1 text-sm pt-2 text-right">{money(t.tax, symbol)}</div>
          <div className="col-span-6 md:col-span-1 text-sm font-bold pt-2 text-right">{money(t.total, symbol)}</div>
        </div>

        {!collapsed && (
          <>
            <div>
              <button
                type="button"
                onClick={() => setValue(`${base}.show_description`, !show_description)}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2"
              >
                {show_description ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />} Description
              </button>
              {show_description && <TextareaInput name={`${base}.description`} label="" placeholder="Description" rows={3} />}
            </div>

            {!show_images ? (
              <Button type="button" variant="outline" size="sm" className="self-start border-dashed" onClick={() => setValue(`${base}.show_images`, true)}>
                <ImagePlus className="w-4 h-4 mr-1.5" /> Upload Image
              </Button>
            ) : (
              <MultiImageUpload name={`${base}.images`} label="Images" maxFiles={4} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectInput name={`${base}.qty_unit_id`} label="Product Unit" loading={unitsLoading} options={units} placeholder="Select unit" />
              <SelectInput name={`${base}.warehouse`} label="Store" loading={warehousesLoading} options={warehouses} placeholder="Select store" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}