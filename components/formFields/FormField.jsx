"use client";

import { cloneElement, isValidElement } from "react";
import { useFormContext } from "@/lib/FormContext";

/**
 * FormField — binds a single form control to the parent <Form>'s state by `name`,
 * without prop-drilling value/onChange/error everywhere yourself.
 *
 * Usage:
 *   <FormField name="email">
 *     <EmailInput label="Email" />
 *   </FormField>
 *
 * It clones the child and injects `value`, `onChange`, `onBlur`, `error`, `name`
 * — any of these the child already sets explicitly win (won't be overridden).
 *
 * Works standalone too (outside a <Form>): if there's no FormContext, it just
 * renders children untouched, so components remain independently usable.
 */
export default function FormField({ name, children, ...rest }) {
  const form = useFormContext();

  if (!form || !isValidElement(children)) {
    return children;
  }

  const field = form.register(name);

  const injectedProps = {
    ...field,
    ...rest,
    // Let explicit props on the child itself win over auto-wiring.
    ...children.props,
  };

  // If the child didn't explicitly set onChange, use the field's.
  if (children.props.onChange === undefined) injectedProps.onChange = field.onChange;
  if (children.props.onBlur === undefined) injectedProps.onBlur = field.onBlur;
  if (children.props.value === undefined) injectedProps.value = field.value;
  if (children.props.checked === undefined) injectedProps.checked = field.value;
  if (children.props.error === undefined) injectedProps.error = field.error;
  if (children.props.name === undefined) injectedProps.name = name;

  return cloneElement(children, injectedProps);
}
