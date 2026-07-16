//import { API_DOMAIN } from "@/constants/general";
import { createCrudEndpoints } from "@/stores/factories/createCrudEndpoints";


export const admin = {

  // Items
  warehouses: createCrudEndpoints('warehouses'),
  items: createCrudEndpoints('items'),

  // Meta Data
  countries: createCrudEndpoints('countries'),
  states: createCrudEndpoints('states'),
  cities: createCrudEndpoints('cities'),
  systemUsers: createCrudEndpoints('system-users'),
  tags: createCrudEndpoints('tags'),

  contacts: createCrudEndpoints('contacts'),
  companies: createCrudEndpoints('companies'),

  //Meta Data
  categories: createCrudEndpoints('categories'),
  industries: createCrudEndpoints('industries'),
  companyTypes: createCrudEndpoints('company-types'),
  ownerships: createCrudEndpoints('ownerships'),
  companySizes: createCrudEndpoints('company-sizes'),
  sourceTypes: createCrudEndpoints('sources'),
  units: createCrudEndpoints('units'),

  //clients: createCrudEndpoints('clients'),
  quotations: createCrudEndpoints('quotations'),
  invoices: createCrudEndpoints('invoices'),
  paymentReceipts: createCrudEndpoints('payment-receipts'),
  salesOrders: createCrudEndpoints('sales-orders'),
  deliveryChallans: createCrudEndpoints('delivery-challans'),
  creditNotes: createCrudEndpoints('credit-notes'),
  //suppliers: createCrudEndpoints('suppliers'),
  expenditures: createCrudEndpoints('expenditures'),
  payoutReceipts: createCrudEndpoints('payout-receipts'),
  purchaseOrders: createCrudEndpoints('purchase-orders'),
  debitNotes: createCrudEndpoints('debit-notes'),
  accountGroups: createCrudEndpoints('account-groups'),

  chartOfAccounts: createCrudEndpoints('chart-of-accounts'),

  voucherBooks: createCrudEndpoints('voucher-books'),


  paymentAccounts: createCrudEndpoints('payment-accounts'),
  bankAccounts: createCrudEndpoints('bank-accounts'),
  systemUsers: createCrudEndpoints('system-users'),
  roles: createCrudEndpoints('roles'),
  greetings: createCrudEndpoints('greetings'),
  testimonials: createCrudEndpoints('testimonials'),

};

/*
settings/business
settings/integrations
*/