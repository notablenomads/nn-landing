import { WizardOptions } from "@/components/landing/wizard/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useWizardOptions = () => {
  return useQuery<WizardOptions>({
    queryKey: ["wizardOptions"],
    queryFn: async () => {
      const { data } = await axios.get<WizardOptions>(
        `${process.env.NEXT_PUBLIC_BASE_URL}leads/options`
      );
      return data;
    },
  });
};
