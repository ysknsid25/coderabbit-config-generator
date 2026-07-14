import { useForm } from '@formisch/react';
import { configSchema } from '../schema';

export function useConfigForm() {
  return useForm({ schema: configSchema });
}
