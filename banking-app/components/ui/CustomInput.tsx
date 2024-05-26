import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
const CustomInput = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">Password</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder="Enter your password"
                className="input-class"
                type="password"
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
