"use client";

import { create } from "zustand";
//import { GET, POST } from "@/helper/ServerSide";
import { GET, POST, PUT, PATCH, DELETE } from "@/helper/ServerSide";
import { toast } from "sonner";

import dayjs from "dayjs";

export const createCrudStore = ({ moduleName, endpoints }) => {
  const initialState = {
    records: [],
    forDropdown: [],
    record: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      perPage: 10,
      totalPages: 0,
    },
    filters: {},
  };

  const validateEndpoint = (endpoint, action) => {
    if (endpoint) return true;
    toast.error(`${moduleName}: ${action} endpoint is not configured.`);
    console.error(`Missing '${action}' endpoint for ${moduleName}`);
    return false;
  };

  const validateId = (id) => {
    if (id) return true;

    toast.error("Record ID is required.");
    return false;
  };

  return create((set, get) => {
    const request = async ({
      endpoint,
      action,
      method = POST,
      data = null,
      onSuccess,
      successMessage,
      updater,
    }) => {
      if (!validateEndpoint(endpoint, action)) return null;

      set({ loading: true, error: null });

      try {
        const response = await method(endpoint, data);

        console.log("response for " + endpoint);
        console.log(response);


        if (response?.status >= 200 && response?.status < 300) {
          if (updater) {
            set((state) => updater(state, response));
          }

          if (successMessage) {
            toast.success(response?.message || successMessage);
          }

          onSuccess?.(response);

          return response;
        } else {
          toast.error(response.message);
        }
        set({ loading: false });
        return null;
      } catch (err) {

        set({ loading: false });
        const message = err?.message || `${action} failed`;
        set({ error: message });
        toast.error(message);

        return null;
      } finally {
        set({ loading: false });
      }
    };

    return {
      ...initialState,

      // =====================
      // Get Records
      // =====================

      getRecords: (params = {}) =>
        request({
          endpoint: endpoints.get,
          method: GET,
          action: "Load",
          data: params,
          updater: (_, response) => ({
            records: response?.data ?? [],
          }),
        }),

      // =====================
      // Get Records
      // =====================

      getForDropdown: (params = {}) =>{
        request({
          endpoint: endpoints.getForDropdown,
          method: GET,
          action: "Load",
          data: params,
          updater: (_, response) => ({
            forDropdown: response?.data ?? [],
          }),
        })},

      // =====================
      // Get Single
      // =====================

      findRecord: (id) => get().records.find((item) => item.id === id) || null,
      //      getRecord: (id) => get().records.find((item) => item.id === id) || null,

      getRecord: (id) => {
        if (!validateId(id)) return;

        return request({
          endpoint: endpoints.record?.(id),
          action: "Load",
          method: GET,
          updater: (_, response) => ({
            record: response?.data ?? null,
          }),
        });
      },

      // =====================
      // Create
      // =====================

      saveRecord: (data, options = {}) =>
        request({
          endpoint: endpoints.save,
          action: "Save",
          data,
          onSuccess: options.onSuccess,
          successMessage: `${moduleName} created`,
          updater: (state, response) => {
            const record = response?.data ?? data;

            return {
              record,
              records: [record, ...state.records],
            };
          },
        }),

      // =====================
      // Update
      // =====================

      updateRecord: (data, options = {}) => {
        
        if (!validateId(data?.id)) return;

        return request({
          endpoint: endpoints.update(data.id),
          method: PUT,
          action: "Update",
          data,
          onSuccess: options.onSuccess,
          successMessage: `${moduleName} updated`,
          updater: (state, response) => {
            const updated = response?.data ?? data;

            return {
              record:
                state.record?.id === data.id
                  ? { ...state.record, ...updated }
                  : state.record,

              records: state.records.map((item) =>
                item.id === data.id ? { ...item, ...updated } : item,
              ),
            };
          },
        });
      },

      // =====================
      // Trash
      // =====================

      trashRecord: (id, options = {}) => {
        if (!validateId(id)) return;
        return request({
          endpoint: endpoints.trash(id),
          method: PATCH,
          action: "Trash",
          onSuccess: options.onSuccess,
          successMessage: `${moduleName} moved to trash`,
          /*
          updater: (state) => ({
            record: state.record?.id === id ? null : state.record,
            records: state.records.filter((item) => item.id !== id),
          }),
          */
          updater: (state) => ({
            record:
              state.record?.id === id
                ? {
                    ...state.record,
                    deleted_at: `${dayjs().format("YYYY-MM-DD HH:mm:ss")}`,
                  }
                : state.record,

            records: state.records.map((item) =>
              item.id === id
                ? {
                    ...item,
                    deleted_at: `${dayjs().format("YYYY-MM-DD HH:mm:ss")}`,
                  }
                : item,
            ),
          }),
        });
      },

      // =====================
      // Restore
      // =====================

      restoreRecord: (id, options = {}) => {
        if (!validateId(id)) return;

        return request({
          endpoint: endpoints.restore(id),
          method: PATCH,
          action: "Restore",
          onSuccess: options.onSuccess,
          successMessage: `${moduleName} restored`,
          updater: (state) => ({
            record:
              state.record?.id === id
                ? { ...state.record, deleted_at: "" }
                : state.record,

            records: state.records.map((item) =>
              item.id === id ? { ...item, deleted_at: "" } : item,
            ),
          }),
        });
      },

      // =====================
      // Destroy
      // =====================

      destroyRecord: (id, options = {}) => {
        if (!validateId(id)) return;
        return request({
          endpoint: endpoints.destroy(id),
          method: DELETE,
          action: "Delete",
          onSuccess: options.onSuccess,
          successMessage: `${moduleName} deleted permanently`,
          /*
          updater: (state) => ({
            record: state.record?.id === id ? null : state.record,
            records: state.records.filter((item) => item.id !== id),
          }),
          */
        });
      },

      // =====================
      // Helpers
      // =====================

      setRecord: (record) =>
        set({
          record: record,
        }),
      clearRecord: () =>
        set({
          record: null,
        }),

      clearRecords: () =>
        set({
          records: [],
        }),

      reset: () => set(initialState),
    };
  });
};
