import { defineRoute } from "./define";

export const navigationContent = defineRoute({
  id: "navigation",
  label: "Meny",
  path: "/",
  sections: [
    { title: "Menyval", fields: [
      ["text_002", "Behandlingar, text", "Behandlingar"],
      ["link_002", "Behandlingar, adress", "/#behandlingar"],
      ["text_003", "Om Andreas, text", "Om Andreas"],
      ["link_003", "Om Andreas, adress", "/om-andreas"],
      ["text_008", "Presentkort, text", "Presentkort"],
      ["link_006", "Presentkort, adress", "/#presentkort"],
      ["articles_label", "Kunskapsbank, text", "Kunskapsbank"],
      ["text_005", "Kontakt, text", "Kontakt"],
      ["link_005", "Kontakt, adress", "/#kontakt"],
      ["text_001", "Hem, text (mobilmenyn)", "Hem"],
      ["link_001", "Hem, adress", "/"],
      ["text_004", "Klassisk massage, text (mobilmenyn)", "Klassisk massage"],
      ["link_004", "Klassisk massage, adress", "/klassisk-massage"],
    ] },
    { title: "Tillgänglighet", fields: [
      ["text_006", "Beskrivning av logotypen för skärmläsare", "Viriditas Massage – till startsidan"],
      ["text_007", "Text på menyknappen (mobil)", "Meny"],
    ] },
  ],
});
