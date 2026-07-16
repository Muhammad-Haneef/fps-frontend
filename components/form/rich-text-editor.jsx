"use client";

import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] rounded-md border border-input bg-background p-4 flex items-center justify-center text-sm text-muted-foreground">
      Loading editor...
    </div>
  ),
});

// Utility: debounce
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  return (...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  };
};

// Utility: format bytes
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Utility: base64 to File
const base64ToFile = (base64String, filename = "image.png") => {
  if (typeof window === "undefined") return null;
  const base64Regex = /^data:image\/([a-zA-Z]*);base64,([^\s]*)$/;
  const matches = base64String.match(base64Regex);
  if (!matches) return null;

  const mimeType = matches[1];
  const base64Data = matches[2];

  try {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    const blob = new Blob(byteArrays, { type: `image/${mimeType}` });
    return new File([blob], filename, { type: `image/${mimeType}` });
  } catch (error) {
    console.error("Error converting base64 to file:", error);
    return null;
  }
};

export default function RichTextEditor({
  name,
  label,
  placeholder = "Write something...",
  is_required = false,
  helperText,
  tooltip,
  disabled = false,
  height = 200,
  className = "",
  toolbarConfig = "full", // minimal, basic, full
  allowImageUpload = true,
  allowVideoUpload = false,
  showCharCount = false,
  showContentSize = true,
  onImageUpload, // Custom image upload handler
  uploadEndpoint, // Upload API endpoint
  ...props
}) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const editorRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [contentSize, setContentSize] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);

  const value = watch(name) || "";
  const error = errors[name]?.message;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Toolbar configurations
  const getToolbarConfig = () => {
    switch (toolbarConfig) {
      case "minimal":
        return [["bold", "italic", "underline"]];
      case "basic":
        return [
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ];
      case "full":
      default:
        return [
          [{ font: [] }, { size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          [{ direction: "rtl" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
        ];
    }
  };

  const getFormatsConfig = () => {
    switch (toolbarConfig) {
      case "minimal":
        return ["bold", "italic", "underline"];
      case "basic":
        return [
          "bold",
          "italic",
          "underline",
          "strike",
          "list",
          "align",
          "link",
          "image",
        ];
      case "full":
      default:
        return [
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "indent",
          "direction",
          "align",
          "link",
          "image",
          "video",
          "color",
          "background",
          "script",
          "code-block",
        ];
    }
  };

  const toolbar = useMemo(() => getToolbarConfig(), [toolbarConfig]);
  const formats = useMemo(() => getFormatsConfig(), [toolbarConfig]);

  // Image upload handler
  const uploadImage = async (file) => {
    if (!file) return null;
    setUploading(true);

    if (onImageUpload) {
      try {
        const imageUrl = await onImageUpload(file);
        setUploading(false);
        return imageUrl;
      } catch (error) {
        setUploading(false);
        console.error("Image upload failed:", error);
        return null;
      }
    }

    if (!uploadEndpoint) {
      setUploading(false);
      return URL.createObjectURL(file);
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data?.status === 200 || data?.success) {
        const imageUrl = data?.data?.image_url || data?.url;
        setUploading(false);
        return imageUrl;
      }
      throw new Error("Upload failed");
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploading(false);
      return null;
    }
  };

  const handleBase64Image = async (base64String) => {
    const file = base64ToFile(base64String);
    if (file) {
      const imageUrl = await uploadImage(file);
      return imageUrl;
    }
    return null;
  };

  const insertImageToEditor = (imageUrl) => {
    const editor = editorRef.current?.getEditor();
    if (!editor) return;
    const range = editor.getSelection(true);
    if (range) {
      editor.insertEmbed(range.index, "image", imageUrl);
      editor.setSelection(range.index + 1, 0);
    }
  };

  const imageHandler = () => {
    if (!allowImageUpload) return;
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const imageUrl = await uploadImage(file);
        if (imageUrl) insertImageToEditor(imageUrl);
      }
    };
  };

  const videoHandler = () => {
    if (!allowVideoUpload) return;
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "video/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const videoUrl = URL.createObjectURL(file);
        const quill = editorRef.current?.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "video", videoUrl);
      }
    };
  };

  const modules = {
    toolbar: {
      container: toolbar,
      handlers: {
        ...(allowImageUpload && { image: imageHandler }),
        ...(allowVideoUpload && { video: videoHandler }),
      },
    },
    clipboard: { matchVisual: false },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true,
    },
  };

  // Undo/Redo keyboard shortcuts
  useEffect(() => {
    const quill = editorRef.current?.getEditor?.();
    if (!quill) return;

    if (!quill.history) {
      quill.history = quill.getModule("history");
    }

    quill.keyboard.bindings["undo"] = [];
    quill.keyboard.bindings["redo"] = [];

    quill.keyboard.addBinding({ key: "z", shortKey: true }, () => {
      quill.history.undo();
    });

    quill.keyboard.addBinding({ key: "y", shortKey: true }, () => {
      quill.history.redo();
    });

    quill.keyboard.addBinding(
      { key: "z", shortKey: true, shiftKey: true },
      () => {
        quill.history.redo();
      }
    );
  }, [isClient]);

  // Handle paste and drop for base64 images
  useEffect(() => {
    if (!isClient) return;
    const quill = editorRef.current?.getEditor();
    if (!quill) return;

    const editorElement = quill.root;

    const handleDrop = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const files = Array.from(e.dataTransfer?.files || []);
      const imageFile = files.find((file) => file.type.startsWith("image/"));
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        if (imageUrl) insertImageToEditor(imageUrl);
      }
    };

    const handlePaste = async (e) => {
      const clipboardItems = Array.from(e.clipboardData?.items || []);
      const imageItem = clipboardItems.find((item) =>
        item.type.startsWith("image/")
      );
      if (imageItem) {
        e.preventDefault();
        e.stopPropagation();
        const file = imageItem.getAsFile();
        const imageUrl = await uploadImage(file);
        if (imageUrl) insertImageToEditor(imageUrl);
      }
    };

    editorElement.addEventListener("drop", handleDrop, true);
    editorElement.addEventListener("paste", handlePaste, true);

    return () => {
      editorElement.removeEventListener("drop", handleDrop, true);
      editorElement.removeEventListener("paste", handlePaste, true);
    };
  }, [isClient]);

  // Debounce for content size and char count
  const debouncedSetContentSize = useDebounce((sizeInBytes) => {
    setContentSize(sizeInBytes);
  }, 400);

  const debouncedCharCount = useDebounce((len) => {
    setCharCount(len);
  }, 400);

  const handleChange = async (content) => {
    if (!isClient) return;

    // Convert base64 images to uploaded URLs
    const base64Regex =
      /<img[^>]*src="(data:image\/[^;]+;base64[^"]*)"[^>]*>/gi;
    const base64Matches = content.match(base64Regex);

    if (base64Matches && base64Matches.length > 0) {
      let updatedContent = content;
      for (const imgTag of base64Matches) {
        const srcMatch = imgTag.match(/src="([^"]*)"/);
        if (srcMatch && srcMatch[1]) {
          const base64String = srcMatch[1];
          const imageUrl = await handleBase64Image(base64String);
          if (imageUrl) {
            updatedContent = updatedContent.replace(
              imgTag,
              imgTag.replace(base64String, imageUrl)
            );
          }
        }
      }
      content = updatedContent;
    }

    // Track images
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const currentImages = Array.from(doc.querySelectorAll("img"))
      .map((img) => img.src)
      .filter((src) => !src.startsWith("data:"));
    setImageUrls(currentImages);

    setValue(name, content, { shouldValidate: true });

    // Calculate content size and character count
    const contentInBytes = new Blob([content]).size;
    debouncedSetContentSize(contentInBytes);

    const textOnly = content.replace(/<[^>]*>/g, "");
    debouncedCharCount(textOnly.length);
  };

  if (!isClient) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <Label htmlFor={name}>
            {label}
            {is_required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div className="min-h-[200px] rounded-md border border-input bg-background p-4 flex items-center justify-center text-sm text-muted-foreground">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <Label htmlFor={name} className={error ? "text-destructive" : ""}>
            {label}
            {is_required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      <div className="relative">
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 text-sm font-medium rounded-lg">
            Uploading image...
          </div>
        )}

        <div
          className={`rounded-md border ${
            error ? "border-destructive" : "border-input"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          style={{ minHeight: height }}
        >
          <ReactQuill
            ref={editorRef}
            value={value}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            readOnly={disabled}
            theme="snow"
            {...props}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <div>
          {showCharCount && value && <span>Characters: {charCount}</span>}
        </div>
        <div>{showContentSize && <span>Size: {formatBytes(contentSize)}</span>}</div>
      </div>

      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
