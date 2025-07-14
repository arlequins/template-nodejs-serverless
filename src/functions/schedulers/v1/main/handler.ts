import usecaseMain, { EventType } from "@libs/usecases/schedulers/v1/main";
import { wrapper } from "@libs/utils/lambda";

const scheduler = async (event) =>
  await wrapper(
    async () =>
      await usecaseMain({
        type: (event?.type || null) satisfies EventType,
      }),
  );

export const main = scheduler;
