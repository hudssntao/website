"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { validateSecret } from "./_actions"
import { cn } from "@/lib/utils"
import { useState } from "react"

const formSchema = z.object({
  secret: z.string(),
})

export function SecretForm() {
  const [valid, setValid] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      secret: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const isValid = await validateSecret(values.secret) !== false;
    setValid(isValid);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 justify-center">
        <FormField
          control={form.control}
          name="secret"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className={cn("text-white text-xl text-center", !valid && "text-red-600")}>{valid ? "Enter Secret" : "That's Incorrect."}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Something super secret..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="hover:bg-white hover:text-gray-900">Submit</Button>
      </form>
    </Form>
  )
}

