"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { FormContext, useForm } from "@/lib/FormContext";

/**
 * Form — root wrapper for a whole form.
 *
 * Two usage modes:
 * 1. Managed: pass `initialValues` + `validate` + `onSubmit`, then use
 *    <FormField name="email"> inside — values/errors/submit are all handled for you.
 * 2. Unmanaged: pass your own `form` object (from `useForm()` called yourself)
 *    if you need to reach into form state from outside this component.
 *
 * Features:
 * - Prevents default submit + double-submit while `isSubmitting`
 * - Disables the whole fieldset while submitting (opt-out with `disableOnSubmit={false}`)
 * - Surfaces a form-level error banner (from `errors._form`, e.g. a failed API call)
 * - `noValidate` set by default (component-level validation replaces native browser bubbles)
 */
export default function Form({
  initialValues,
  validate,
  onSubmit,
  form: externalForm,
  children,
  className,
  disableOnSubmit = true,
  ...rest
}) {
  const internalForm = useForm({ initialValues, validate, onSubmit });
  const form = externalForm || internalForm;

  const contextValue = useMemo(() => form, [form]);

  return (
    <FormContext.Provider value={contextValue}>
      <form
        noValidate
        onSubmit={form.handleSubmit}
        className={cn("flex flex-col gap-6", className)}
        {...rest}
      >
        {form.errors?._form && (
          <div role="alert" className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
            {form.errors._form}
          </div>
        )}
        <fieldset disabled={disableOnSubmit && form.isSubmitting} className="contents">
          {typeof children === "function" ? children(form) : children}
        </fieldset>
      </form>
    </FormContext.Provider>
  );
}
