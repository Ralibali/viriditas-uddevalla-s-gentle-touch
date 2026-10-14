import { defineRoute } from "./define";

export const articlesContent = defineRoute({
  id: "articles",
  label: "Kunskapsbank",
  path: "/kunskapsbank",
  sections: [
    { title: "Sökmotorer", fields: [
      ["seo_001", "Sidtitel i sökresultat och webbläsarflik", "Kunskapsbank om massage i Uddevalla | Viriditas"],
      ["seo_002", "Beskrivning i sökresultat", "Artiklar om massage, återhämtning och friskvård från Viriditas i Uddevalla. Läs om skillnaderna mellan behandlingar och vad som passar dig.", "longtext"],
    ] },
    { title: "Kunskapsbankens startsida", fields: [
      ["text_001", "Huvudrubrik (H1)", "Kunskapsbank"],
      ["text_002", "Ingress", "Artiklar om massage, återhämtning och friskvård, för dig som vill veta mer innan du bokar.", "longtext"],
      ["text_003", "Text när inga artiklar finns", "Inga artiklar är publicerade ännu."],
      ["text_004", "Länktext på varje artikel", "Läs artikeln"],
    ] },
    { title: "Artikelsidorna", fields: [
      ["text_005", "Text före publiceringsdatum", "Uppdaterad"],
      ["text_006", "Rubrik för fler artiklar", "Fler artiklar"],
      ["text_007", "Bokningsruta, rubrik", "Vill du känna skillnaden själv?"],
      ["text_008", "Bokningsruta, text", "Boka en tid hos Andreas i Uddevalla Folkets Hus.", "longtext"],
    ] },
  ],
});
