import { WizardOptions } from "@/components/landing/wizard/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ApiResponse {
  statusCode: number;
  message: string;
  data: WizardOptions;
  timestamp: string;
  path: string;
}

export const useWizardOptions = () => {
  return useQuery<WizardOptions>({
    queryKey: ["wizardOptions"],
    queryFn: async () => {
      const { data: response } = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_BASE_URL}leads/options`);

      if (response.statusCode >= 400) {
        throw new Error(response.message || "Failed to fetch wizard options");
      }

      return response.data;
    },
  });
};
