import { z } from "zod";

/**
 * The parts of a Fatsoma event page's schema.org data that the site relies on.
 * If Fatsoma changes any of these, validation fails instead of publishing bad data.
 */
export const fatsomaEventSchema = z
  .object({
    "@type": z.literal("Event"),
    name: z.string().trim().min(1),
    url: z.string().regex(/^https:\/\/www\.fatsoma\.com\/e\/[a-z0-9]+\/[^?#]+$/),
    /** Real UTC instants. A time with no timezone is rejected. */
    startDate: z.iso.datetime({ offset: true }),
    endDate: z.iso.datetime({ offset: true }),
    eventStatus: z.string().optional(),
    description: z.string().optional(),
    image: z.url({ protocol: /^https$/ }).optional(),
    location: z.object({
      name: z.string().trim().min(1),
      address: z.object({
        addressLocality: z.string().trim().min(1),
      }),
    }),
    offers: z
      .array(
        z.object({
          /** Excludes Fatsoma's booking fee. */
          price: z.number().nonnegative().optional(),
          availability: z.string().optional(),
        }),
      )
      .optional(),
  })
  .refine((event) => Date.parse(event.endDate) > Date.parse(event.startDate), {
    path: ["endDate"],
    message: "Event ends before it starts",
  });

export type FatsomaEvent = z.infer<typeof fatsomaEventSchema>;

/** The site only lists Southampton nights; out-of-town events are left off. */
export function isInSouthampton(event: FatsomaEvent): boolean {
  return event.location.address.addressLocality.toLowerCase() === "southampton";
}
