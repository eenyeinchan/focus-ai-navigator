import { useState } from "react";
import { useUpdateTask } from "@workspace/api-client-react";
import { getListTasksQueryKey, getGetActionPlanQueryKey, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Task, TaskPriority, TaskStatus } from "@workspace/api-client-react/src/generated/api.schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, Sparkles, AlertCircle, ArrowUpCircle, Minus, ArrowDownCircle } from "lucide-react";

export function TaskItem({ task }: { task: Task }) {
  const queryClient = useQueryClient();
  const updateTask = useUpdateTask();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsUpdating(true);
    updateTask.mutate(
      {
        id: task.id,
        data: { status: checked ? "done" : "todo" }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetActionPlanQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        },
        onSettled: () => {
          setIsUpdating(false);
        }
      }
    );
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case "critical": return <AlertCircle className="h-3 w-3 text-destructive" />;
      case "high": return <ArrowUpCircle className="h-3 w-3 text-amber-500" />;
      case "medium": return <Minus className="h-3 w-3 text-blue-500" />;
      case "low": return <ArrowDownCircle className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "critical": return "text-destructive border-destructive/20 bg-destructive/10";
      case "high": return "text-amber-500 border-amber-500/20 bg-amber-500/10";
      case "medium": return "text-blue-500 border-blue-500/20 bg-blue-500/10";
      case "low": return "text-muted-foreground border-muted/20 bg-muted/10";
    }
  };

  return (
    <div 
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg border bg-card transition-all duration-200 hover:shadow-sm",
        task.status === "done" && "opacity-60 bg-muted/50",
        isUpdating && "opacity-50 pointer-events-none"
      )}
    >
      <div className="pt-0.5">
        <Checkbox 
          checked={task.status === "done"} 
          onCheckedChange={handleToggle}
          className="h-5 w-5 transition-transform data-[state=checked]:scale-110"
        />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <span className={cn(
            "font-medium text-sm transition-all",
            task.status === "done" && "line-through text-muted-foreground"
          )}>
            {task.title}
          </span>
          <Badge variant="outline" className={cn("shrink-0 h-5 px-1.5 text-[10px] font-medium border capitalize flex items-center gap-1", getPriorityColor(task.priority))}>
            {getPriorityIcon(task.priority)}
            {task.priority}
          </Badge>
        </div>
        
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(task.dueDate), "MMM d")}
            </div>
          )}
          
          {task.noteTitle && (
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="truncate max-w-[150px]">From: {task.noteTitle}</span>
            </div>
          )}
          
          {task.aiGenerated && (
            <div className="flex items-center text-xs text-amber-600 dark:text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded font-medium">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Extracted
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
