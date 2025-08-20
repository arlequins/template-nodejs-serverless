import usecaseMain, { EventType } from "@lib/usecases/schedulers/v1/main";
import { wrapper } from "@lib/utils/lambda";

const scheduler = async (event) =>
  await wrapper(
    async () =>
      await usecaseMain({
        type: (event?.type || null) satisfies EventType,
      }),
  );

export const main = scheduler;
