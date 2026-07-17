"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Stepper({
    steps,
    currentStep = 1,
    align = "center", // left | center | right
}) {
    return (
        <div
            className={cn(
                "flex flex-wrap items-center gap-3",
                align === "left" && "justify-start",
                align === "center" && "justify-center",
                align === "right" && "justify-end"
            )}
        >
            {steps.map((step, index) => {
                const active = index + 1 === currentStep;
                const completed = index + 1 < currentStep;

                return (
                    <div key={index} className="flex items-center">
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                                    active || completed
                                        ? "bg-violet-600 border-violet-600 text-white"
                                        : "border-gray-300 text-gray-500"
                                )}
                            >
                                {index + 1}
                            </div>

                            <span
                                className={cn(
                                    active ? "text-black font-medium" : "text-gray-500"
                                )}
                            >
                                {step.title}
                            </span>
                        </div>

                        {index < steps.length - 1 && (
                            <ChevronRight className="mx-4 h-5 w-5 text-gray-400" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}