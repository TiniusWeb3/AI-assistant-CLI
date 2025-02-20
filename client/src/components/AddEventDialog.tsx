import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { insertEventSchema, type InsertEvent } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddEventDialog({ open, onOpenChange }: AddEventDialogProps) {
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const { toast } = useToast();

  const form = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: InsertEvent) => {
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    try {
      const startDateTime = new Date(date);
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      startDateTime.setHours(startHours, startMinutes);

      const endDateTime = new Date(date);
      const [endHours, endMinutes] = endTime.split(":").map(Number);
      endDateTime.setHours(endHours, endMinutes);

      await apiRequest("POST", "/api/events", {
        ...data,
        startTime: startDateTime,
        endTime: endDateTime,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      onOpenChange(false);
      form.reset();

      toast({
        title: "Event created",
        description: "Your event has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ""} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                  />
                </PopoverContent>
              </Popover>
            </FormItem>

            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </FormControl>
              </FormItem>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}