"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Use shadcn/ui Tooltip
import Button from "../ui/button/Button";

type Action = {
  icon: LucideIcon;
  label?: string;
  onClick: () => void;
  className?: string;
};

interface ActionButtonsProps {
  actions: Action[];
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ actions, className }) => {
  return (
    <div className={`flex items-center space-x-2 ${className || ""}`}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Tooltip key={action.label || Math.random().toString()}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                onClick={action.onClick}
                className={action.className}
              >
                <Icon className="w-5 h-5 text-gray-600 hover:text-primary" />
              </Button>
            </TooltipTrigger>
            {action.label && (
              <TooltipContent>
                <span>{action.label}</span>
              </TooltipContent>
            )}
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ActionButtons;
