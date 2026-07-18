"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import { Save, FileText, Loader2 } from "lucide-react";

import { generateQuotationNumber } from "./form-partials/utils";
import { quotationSchema } from "./form-partials/schema";
import { makeLineItem, makeTerm } from "./form-partials/calculations";

// Quotation form sections
import Header from "./form-partials/header";
import MetaCard from "./form-partials/meta-card";
import CompanySelector from "./form-partials/company-selector";
import ClientSelector from "./form-partials/client-selector";
import ShippingDetails from "./form-partials/shipping-details";
import CurrencySelector from "./form-partials/currency-selector";
import ItemsTable from "./form-partials/items-table";
import Summary from "./form-partials/summary";
import ContactDetails from "./form-partials/contact-details";
import Terms from "./form-partials/terms";
import Attachments from "./form-partials/attachments";
import { AdditionalNotes, AdditionalInfo } from "./form-partials/additional-sections";
import AdvancedOptions from "./form-partials/advanced-options";

const DEFAULT_VALUES = {
  // Header
  title: "QUOTATION",
  subtitle: "",
  logo: null,

  // Meta Information
  quotationNumber: generateQuotationNumber(),
  quotationDate: new Date(),
  dueDate: null,
  reminderDays: 3,
  customFields: [],

  // Company & Client
  company: {
    name: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    ntn: "",
    gst: "",
  },
  client: null,
  clientId: "",

  // Shipping
  shippingEnabled: false,
  shippingDetails: {
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    notes: "",
  },

  // Currency & Tax
  currency: "PKR",
  numberFormat: "1,234.00",

  // Items — start with a single blank line, matching the paper-form feel
  items: [makeLineItem()],
  groups: [],

  // Summary Calculations
  overallDiscountType: "percentage",
  overallDiscountValue: 0,
  additionalCharges: [],
  roundMode: "none",
  signature: null,

  // Contact Details
  contactDetails: {
    phone: "",
    mobile: "",
    email: "",
    website: "",
    address: "",
  },

  // Terms & Conditions
  terms: [makeTerm("Validity of the quotation is approximately two weeks.")],

  // Attachments
  attachments: [],

  // Additional Notes / Info
  additionalNotes: "",
  additionalInfo: [],

  // Advanced Options
  advancedOptions: {
    displayUnit: true,
    mergeQuantity: false,
    showTaxSummary: true,
    hideCountry: false,
    hideOriginalImages: false,
    showThumbnails: true,
    showFullDescription: false,
    hideGroupSubtotal: false,
    showSKU: true,
    showSerialNumber: false,
    displayBatchDetails: false,
    showItemImages: true,
  },
};

export default function ModuleForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSavingDraft, setIsSavingDraft] = React.useState(false);

  const methods = useForm({
    resolver: zodResolver(quotationSchema),
    mode: "onBlur",
    defaultValues: DEFAULT_VALUES,
  });

  const { formState } = methods;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Quotation Data:", data);

      // Here you would typically send data to your API
      // await api.createQuotation(data);

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      alert("Quotation created successfully!");

      // Optionally reset or redirect
      // methods.reset();
      // router.push("/quotations");
    } catch (error) {
      console.error("Error creating quotation:", error);
      alert("Failed to create quotation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors) => {
    console.error("Validation errors:", errors);
    alert("Please fix the highlighted fields before saving.");
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      // Drafts are saved as-is, without full validation
      const data = methods.getValues();
      console.log("Saving draft:", data);

      localStorage.setItem("quotation_draft", JSON.stringify(data));

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSaveAndCreateNew = methods.handleSubmit(async (data) => {
    await onSubmit(data);

    // Reset form for a new quotation
    methods.reset({
      ...DEFAULT_VALUES,
      quotationNumber: generateQuotationNumber(),
    });
  }, onInvalid);

  // Auto-save draft every 2 minutes
  React.useEffect(() => {
    const interval = setInterval(() => {
      const data = methods.getValues();
      localStorage.setItem("quotation_draft_autosave", JSON.stringify(data));
      console.log("Auto-saved draft");
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [methods]);

  return (
    <div className="min-h-screen bg-background p-6">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit, onInvalid)} className="max-w-[1600px] mx-auto">
          {/* Header */}
          <Header />

          {/* Quotation Information */}
          <div className="mb-6">
            <MetaCard />
          </div>

          {/* Company & Client - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CompanySelector />
            <ClientSelector />
          </div>


          {/* Shipping Details */}
          <div className="mb-6">
            <ShippingDetails />
          </div>

          {/* Currency & Configuration
          <div className="mb-6">
            <CurrencySelector />
          </div>
           */}

          {/* Main Content - Items Table & Summary Sidebar */}
          <div className="mb-6">
            {/* Items Table - Takes 2/3 width on large screens */}
            <div>
              <ItemsTable />
              {formState.errors?.items?.message && (
                <p className="text-sm text-destructive mt-2">{formState.errors.items.message}</p>
              )}
            </div>

          </div>
          {/* Summary Sidebar - Takes 1/3 width on large screens */}
          <div className="ml-auto w-1/3">
            <Summary />
          </div>

          {/* Contact Detailsx
          <div className="mb-6">
            <ContactDetails />
          </div>
           */}

          {/* Terms & Conditions
          <div className="mb-6">
            <Terms />
          </div>
           */}

          {/* Attachments
          <div className="mb-6">
            <Attachments />
          </div>
           */}

          {/* Additional Notesx
          <div className="mb-6">
            <AdditionalNotes />
          </div>
           */}

          {/* Additional Info
          <div className="mb-6">
            <AdditionalInfo />
          </div>
           */}

          {/* Advanced Options
          <div className="mb-6">
            <AdvancedOptions />
          </div>
           */}

          {/* Footer Action Buttons - Sticky */}
          <div className="sticky bottom-0 bg-background border-t border-border py-4 mt-8 -mx-6 px-6 z-10 shadow-lg">
            <div className="max-w-[1600px] mx-auto flex flex-wrap gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSavingDraft || isSubmitting}
                className="min-w-[140px]"
              >
                {isSavingDraft ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Save as Draft
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleSaveAndCreateNew}
                disabled={isSubmitting || isSavingDraft}
                className="min-w-[180px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save & Create New
                  </>
                )}
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || isSavingDraft}
                className="min-w-[160px] bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save & Continue
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
