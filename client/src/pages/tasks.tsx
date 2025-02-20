import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskList from "@/components/TaskList";
import AddTaskDialog from "@/components/AddTaskDialog";

export default function Tasks() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {isLoading ? (
        <div>Loading tasks...</div>
      ) : (
        <TaskList tasks={tasks || []} />
      )}

      <AddTaskDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
