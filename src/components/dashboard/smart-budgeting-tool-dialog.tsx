"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { smartBudgetingTool } from "@/ai/flows/smart-budgeting-tool";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Wand2 } from "lucide-react";
import type { SmartBudgetingToolInput } from "@/ai/flows/smart-budgeting-tool";

const formSchema = z.object({
  riskTolerance: z.enum(["low", "medium", "high"]),
});

type SmartBudgetingFormProps = SmartBudgetingToolInput;

export default function SmartBudgetingToolDialog(props: SmartBudgetingFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ savingsSuggestions: string; financialForecast: string } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      riskTolerance: "medium",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const response = await smartBudgetingTool({
        ...props,
        riskTolerance: values.riskTolerance,
      });
      setResult(response);
    } catch (error) {
      console.error("Error with Smart Budgeting Tool:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full font-bold" size="lg">
          <Wand2 className="mr-2 h-5 w-5" />
          Smart Budgeting Tool
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Smart Budgeting Tool</DialogTitle>
          <DialogDescription>
            Get AI-powered savings strategies and financial forecasts based on your data.
          </DialogDescription>
        </DialogHeader>
        
        {!result && !loading && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="riskTolerance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Tolerance</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your risk tolerance" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                Get Advice
              </Button>
            </form>
          </Form>
        )}

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold font-headline">Savings Suggestions</h3>
              <p className="text-sm text-muted-foreground">{result.savingsSuggestions}</p>
            </div>
            <div>
              <h3 className="font-semibold font-headline">Financial Forecast</h3>
              <p className="text-sm text-muted-foreground">{result.financialForecast}</p>
            </div>
             <Button onClick={() => setResult(null)} variant="outline" className="w-full">
              Start Over
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
