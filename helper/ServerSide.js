"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

import { auth } from "@/api-endpoints/auth";

// Re-throw Next.js redirect errors so they aren't swallowed by catch blocks
function rethrowIfRedirect(error) {
  if (
    error?.message === "NEXT_REDIRECT" ||
    error?.digest?.startsWith("NEXT_REDIRECT")
  )
    throw error;
}

const redirecToLogin = '/';

// Remove session
export const Logout = async () => {
  try {
    (await cookies()).delete("session");
    // Return success instead of redirecting
    // Let the client handle the redirect
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

// Get session token
export async function fetchToken() {
  const cookieStore = await cookies();
  return cookieStore.get("session")?.value;
}

export const LOGIN = async (body) => {
  try {
    const formData = new FormData();
    formData.append("email", body.email);
    formData.append("password", body.password);

    const res = await fetch(auth?.login, {
      method: "POST",
      body: formData,
    });

    // Check if response is ok before parsing
    if (!res.ok) {
      // Try to parse error response
      try {
        const errorResponse = await res.json();
        return errorResponse;
      } catch (parseError) {
        // If JSON parsing fails, return a generic error
        return {
          status: res.status,
          message:
            res.status === 403
              ? "Access forbidden. Please check if your account is active and verified."
              : `Request failed with status ${res.status}`,
        };
      }
    }

    // Parse successful response
    const response = await res.json();

    // Only set cookie and return if status is 200
    if (response?.status === 200) {
      const { token } = response;
      if (token) {
        const cookieStore = await cookies();
        cookieStore.set({
          name: "session",
          value: token,
          httpOnly: true,
          path: "/",
        });
      }
      return response;
    }

    // Return response even if status is not 200 (for error handling)
    return response;
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("LOGIN error:", error);
    return {
      status: 500,
      message:
        error?.message || "Internal Server Error. Please try again later.",
    };
  }
};

// Generic GET
export const GET = async (endpoint, tags) => {
  try {
    if (!endpoint) {
      console.error("GET called with undefined/null endpoint");
      return { status: 400, message: "Invalid endpoint" };
    }
    const token = await fetchToken();

    // If no token, redirect to login immediately
    if (!token) {
      console.warn("No session token found - redirecting to login");
      redirect(redirecToLogin);
    }

    const res = await fetch(endpoint, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
      next: { tags },
    });

    // Check if unauthorized
    if (res.status === 401 || res.status === 403) {
      console.error(
        "Unauthorized - session expired or invalid. Redirecting to login",
      );
      redirect(redirecToLogin);
    }

    // Check if response is ok before parsing
    if (!res.ok) {
      console.error(
        `GET failed with status ${res.status} for endpoint:`,
        endpoint,
      );

      // Try to parse as JSON first
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await res.json();
          return {
            status: res.status,
            message:
              errorData.message ||
              errorData.detail ||
              `Request failed with status ${res.status}`,
            error: true,
          };
        } catch (parseError) {
          console.error("Failed to parse error response as JSON:", parseError);
        }
      }

      // If not JSON or parsing failed, return generic error
      return {
        status: res.status,
        message: `API returned ${res.status} error. The server may be down or misconfigured.`,
        error: true,
      };
    }

    const jsonResponse = await res.json();
    console.log("GET success response:", jsonResponse, "Endpoint:", endpoint);
    return jsonResponse;
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("GET error:", error, "Endpoint:", endpoint);
    console.error("GET error stack:", error.stack);
    // If it's a connection error, might be API server issue
    if (
      error.message?.includes("fetch failed") ||
      error.code === "ECONNREFUSED"
    ) {
      console.error(
        "Cannot connect to API server. Please check if the API is running.",
      );
    }
    // Return error response instead of undefined
    return {
      status: 500,
      message: error?.message || "Failed to fetch data",
      error: true,
    };
  }
};

export const POST = async (endpoint, formData = {}, tags) => {
  try {
    const token = await fetchToken();

    // If no token, redirect to login immediately
    if (!token) {
      console.warn("No session token found - redirecting to login");
      redirect(redirecToLogin);
    }

    const body = new FormData();

    for (const [key, value] of Object.entries(formData)) {
      body.append(key, value);
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    // Check if unauthorized
    if (response.status === 401 || response.status === 403) {
      console.error(
        "Unauthorized - session expired or invalid. Redirecting to login",
      );
      redirect(redirecToLogin);
    }

    // Check if response is ok before parsing
    if (!response.ok) {
      console.error(
        `POST failed with status ${response.status} for endpoint:`,
        endpoint,
      );

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await response.json();
          return {
            status: response.status,
            message:
              errorData.message ||
              errorData.detail ||
              `Request failed with status ${response.status}`,
            error: true,
          };
        } catch (parseError) {
          console.error("Failed to parse error response as JSON:", parseError);
        }
      }

      return {
        status: response.status,
        message: `API returned ${response.status} error. The server may be down or misconfigured.`,
        error: true,
      };
    }

    const data = await response.json();

    if ([200, 201].includes(response?.status) && tags) {
      revalidateTag(tags, "max");
    }

    return data;
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("POST error:", error);
    return { error: true, message: error?.message };
  }
};

// POST JSON (no auth — for public endpoints like 2FA verify at login)
export const POST_JSON_PUBLIC = async (endpoint, body) => {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("POST_JSON_PUBLIC error:", error);
    return {
      status: 500,
      message: error?.message || "Request failed",
      error: true,
    };
  }
};

// Set session cookie after successful 2FA verify (called from client after direct API fetch)
export const SET_SESSION_COOKIE = async (token) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: token,
    httpOnly: true,
    path: "/",
  });
};

// POST JSON
export const POST_JSON = async (endpoint, body, tags, tag) => {
  try {
    const token = await fetchToken();

    // If no token, redirect to login immediately
    if (!token) {
      console.warn("No session token found - redirecting to login");
      redirect(redirecToLogin);
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      next: { tags },
    });

    // Check if unauthorized
    if (res.status === 401 || res.status === 403) {
      console.error(
        "Unauthorized - session expired or invalid. Redirecting to login",
      );
      redirect(redirecToLogin);
    }

    // Check if response is ok before parsing
    if (!res.ok) {
      console.error(
        `POST_JSON failed with status ${res.status} for endpoint:`,
        endpoint,
      );

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await res.json();
          return {
            status: res.status,
            message:
              errorData.message ||
              errorData.detail ||
              `Request failed with status ${res.status}`,
            error: true,
          };
        } catch (parseError) {
          console.error("Failed to parse error response as JSON:", parseError);
        }
      }

      return {
        status: res.status,
        message: `API returned ${res.status} error. The server may be down or misconfigured.`,
        error: true,
      };
    }

    const data = await res.json();
    if (data?.status === 200) revalidateTag(tag, "max");
    return data;
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("POST_JSON error:", error);
    return {
      status: 500,
      message: error?.message || "Failed to fetch data",
      error: true,
    };
  }
};

// POST already-formed FormData
export const POST_WITH_FORMDATA = async (endpoint, body, tags, tag) => {
  try {
    const token = await fetchToken();

    console.log("🔧 POST_WITH_FORMDATA - Endpoint:", endpoint);
    console.log(
      "🔧 POST_WITH_FORMDATA - Token:",
      token ? "Present" : "Missing",
    );

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
      next: { tags },
    });

    console.log("🔧 POST_WITH_FORMDATA - Response status:", res.status);
    console.log("🔧 POST_WITH_FORMDATA - Response ok:", res.ok);

    // Check if response is ok before parsing
    if (!res.ok) {
      console.error(
        `POST_WITH_FORMDATA failed with status ${res.status} for endpoint:`,
        endpoint,
      );

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await res.json();
          return {
            status: res.status,
            message:
              errorData.message ||
              errorData.detail ||
              `Request failed with status ${res.status}`,
            error: true,
          };
        } catch (parseError) {
          console.error("Failed to parse error response as JSON:", parseError);
        }
      }

      return {
        status: res.status,
        message: `API returned ${res.status} error. The server may be down or misconfigured.`,
        error: true,
      };
    }

    const data = await res.json();
    console.log("🔧 POST_WITH_FORMDATA - Response data:", data);

    if (tag && data?.status === 200) revalidateTag(tag, "max");
    return data;
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("POST_WITH_FORMDATA error:", error);
    return {
      status: 500,
      message: error?.message || "Failed to create",
      error: true,
    };
  }
};

// PUT (alias for PUT_JSON for convenience)
export const PUT = async (endpoint, body, tags, tag) => {
  return PUT_JSON(endpoint, body, tags, tag);
};

// PUT JSON
export const PUT_JSON = async (endpoint, body, tags, tag) => {
  try {
    const token = await fetchToken();

    // If no token, redirect to login immediately
    if (!token) {
      console.warn("No session token found - redirecting to login");
      redirect(redirecToLogin);
    }

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      next: { tags },
    });

    // Check if unauthorized
    if (res.status === 401 || res.status === 403) {
      console.error(
        "Unauthorized - session expired or invalid. Redirecting to login",
      );
      redirect(redirecToLogin);
    }

    // Check if response is ok before parsing
    if (!res.ok) {
      console.error(
        `PUT_JSON failed with status ${res.status} for endpoint:`,
        endpoint,
      );

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await res.json();
          return {
            status: res.status,
            message:
              errorData.message ||
              errorData.detail ||
              `Request failed with status ${res.status}`,
            error: true,
          };
        } catch (parseError) {
          console.error("Failed to parse error response as JSON:", parseError);
        }
      }

      return {
        status: res.status,
        message: `API returned ${res.status} error. The server may be down or misconfigured.`,
        error: true,
      };
    }

    const data = await res.json();
    if (data?.status === 200 && tag) revalidateTag(tag, "max");
    return data;
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("PUT_JSON error:", error);
    return {
      status: 500,
      message: error?.message || "Failed to update data",
      error: true,
    };
  }
};

// PUT already-formed FormData
export const PUT_WITH_FORMDATA = async (endpoint, body, tags, tag) => {
  try {
    const token = await fetchToken();

    // If no token, redirect to login immediately
    if (!token) {
      console.warn("No session token found - redirecting to login");
      redirect(redirecToLogin);
    }

    console.log("🔧 PUT_WITH_FORMDATA - Endpoint:", endpoint);
    console.log("🔧 PUT_WITH_FORMDATA - Token:", token ? "Present" : "Missing");

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
      next: { tags },
    });

    console.log("🔧 PUT_WITH_FORMDATA - Response status:", res.status);
    console.log("🔧 PUT_WITH_FORMDATA - Response ok:", res.ok);

    // Check if unauthorized
    if (res.status === 401 || res.status === 403) {
      console.error(
        "Unauthorized - session expired or invalid. Redirecting to login",
      );
      redirect(redirecToLogin);
    }

    // Check if response is ok before parsing
    if (!res.ok) {
      console.error(
        `PUT_WITH_FORMDATA failed with status ${res.status} for endpoint:`,
        endpoint,
      );

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await res.json();
          return {
            status: res.status,
            message:
              errorData.message ||
              errorData.detail ||
              `Request failed with status ${res.status}`,
            error: true,
          };
        } catch (parseError) {
          console.error("Failed to parse error response as JSON:", parseError);
        }
      }

      return {
        status: res.status,
        message: `API returned ${res.status} error. The server may be down or misconfigured.`,
        error: true,
      };
    }

    const data = await res.json();
    console.log("🔧 PUT_WITH_FORMDATA - Response data:", data);

    if (tag && data?.status === 200) revalidateTag(tag, "max");
    return data;
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("PUT_WITH_FORMDATA error:", error);
    return {
      status: 500,
      message: error?.message || "Failed to update",
      error: true,
    };
  }
};

// PATCH (alias for PATCH_JSON)
export const PATCH = async (endpoint, body, tags, tag) => {
  return PATCH_JSON(endpoint, body, tags, tag);
};

// PATCH JSON
export const PATCH_JSON = async (endpoint, body = {}, tags, tag) => {
  try {
    const token = await fetchToken();

    if (!token) {
      console.warn("No session token found - redirecting to login");
      redirect(redirecToLogin);
    }

    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      next: { tags },
    });

    if (res.status === 401 || res.status === 403) {
      console.error("Unauthorized - session expired or invalid.");
      redirect(redirecToLogin);
    }

    if (!res.ok) {
      const contentType = res.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        try {
          const errorData = await res.json();
          return {
            status: res.status,
            message:
              errorData.message ||
              errorData.detail ||
              `Request failed with status ${res.status}`,
            error: true,
          };
        } catch {}
      }

      return {
        status: res.status,
        message: `API returned ${res.status} error.`,
        error: true,
      };
    }

    const data = await res.json();

    if (tag && data?.status === 200) {
      revalidateTag(tag, "max");
    }

    return data;
  } catch (error) {
    rethrowIfRedirect(error);

    console.error("PATCH error:", error);

    return {
      status: 500,
      message: error?.message || "Failed to update",
      error: true,
    };
  }
};

// DELETE
export const DELETE = async (endpoint, tags) => {
  try {
    const token = await fetchToken();

    // If no token, redirect to login immediately
    if (!token) {
      console.warn("No session token found - redirecting to login");
      redirect(redirecToLogin);
    }

    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      next: { tags },
    });

    // Check if unauthorized
    if (res.status === 401 || res.status === 403) {
      console.error(
        "Unauthorized - session expired or invalid. Redirecting to login",
      );
      redirect(redirecToLogin);
    }

    // Check if response is ok before parsing
    if (!res.ok) {
      console.error(
        `DELETE failed with status ${res.status} for endpoint:`,
        endpoint,
      );

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await res.json();
          return {
            status: res.status,
            message:
              errorData.message ||
              errorData.detail ||
              `Request failed with status ${res.status}`,
            error: true,
          };
        } catch (parseError) {
          console.error("Failed to parse error response as JSON:", parseError);
        }
      }

      return {
        status: res.status,
        message: `API returned ${res.status} error. The server may be down or misconfigured.`,
        error: true,
      };
    }

    return await res.json();
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("DELETE error:", error);
    return {
      status: 500,
      message: error?.message || "Failed to delete",
      error: true,
    };
  }
};

// GET for file downloads (returns blob data)
export const GET_FILE = async (endpoint) => {
  try {
    if (!endpoint) {
      console.error("GET_FILE called with undefined/null endpoint");
      return { status: 400, message: "Invalid endpoint", error: true };
    }
    const token = await fetchToken();

    // If no token, redirect to login immediately
    if (!token) {
      console.warn("No session token found - redirecting to login");
      redirect(redirecToLogin);
    }

    const res = await fetch(endpoint, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });

    // Check if unauthorized
    if (res.status === 401 || res.status === 403) {
      console.error(
        "Unauthorized - session expired or invalid. Redirecting to login",
      );
      redirect(redirecToLogin);
    }

    // Check if response is ok
    if (!res.ok) {
      // Try to parse error as JSON
      try {
        const errorData = await res.json();
        return {
          status: res.status,
          message:
            errorData.message || errorData.detail || "Failed to download file",
          error: true,
        };
      } catch {
        return {
          status: res.status,
          message: "Failed to download file",
          error: true,
        };
      }
    }

    // Get the blob data
    const blob = await res.blob();

    // Get filename from Content-Disposition header if available
    const contentDisposition = res.headers.get("Content-Disposition");
    let filename = "download";
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
      );
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    return {
      status: 200,
      blob,
      filename,
      contentType: res.headers.get("Content-Type"),
    };
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("GET_FILE error:", error, "Endpoint:", endpoint);
    return {
      status: 500,
      message: error?.message || "Failed to download file",
      error: true,
    };
  }
};
