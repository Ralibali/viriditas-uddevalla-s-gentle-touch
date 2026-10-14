import { defineRoute } from "./define";

export const footerContent = defineRoute({
  id: "footer",
  label: "Sidfot",
  path: "/",
  sections: [
    { title: "Om verksamheten", fields: [
      ["text_001", "Beskrivning under namnet: Klassisk massage i Uddevalla. Diplomerad massa…", "Klassisk massage i Uddevalla. Diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage med passion för välmående.", "longtext", "footer_text"],
      ["text_017", "Text under punktskriften: Viriditas i punktskrift", "Viriditas i punktskrift"],
    ] },
    { title: "Snabblänkar", fields: [
      ["text_002", "Rubrik", "Snabblänkar"],
      ["text_003", "Hem, text", "Hem"],
      ["link_001", "Hem, adress", "/"],
      ["text_004", "Om Andreas, text", "Om Andreas"],
      ["link_002", "Om Andreas, adress", "/om-andreas"],
      ["text_005", "Klassisk massage, text", "Klassisk massage"],
      ["link_003", "Klassisk massage, adress", "/klassisk-massage"],
      ["text_006", "Avslappningsmassage, text", "Avslappningsmassage"],
      ["link_004", "Avslappningsmassage, adress", "/avslappningsmassage-uddevalla"],
      ["text_007", "Nackspänning, text", "Massage mot nackspänning"],
      ["link_005", "Nackspänning, adress", "/massage-mot-nackspanning"],
      ["text_008", "Friskvårdsbidrag, text", "Friskvårdsbidrag"],
      ["link_006", "Friskvårdsbidrag, adress", "/friskvardsbidrag-massage-uddevalla"],
      ["text_009", "Ljungskile, text", "Massage Ljungskile"],
      ["link_007", "Ljungskile, adress", "/massage-ljungskile"],
      ["text_010", "Bokningslänk, text", "Boka online"],
    ] },
    { title: "Kunskapsbank", fields: [
      ["text_011", "Rubrik", "Kunskapsbank"],
      ["text_012", "Text när inga artiklar finns", "Artiklar publiceras snart."],
      ["text_018", "Länk till alla artiklar, text", "Alla artiklar"],
    ] },
    { title: "Kontakt", fields: [
      ["text_013", "Rubrik", "Kontakt"],
      ["text_014", "Besöksadress (gemensam inställning)", "Uddevalla Folkets Hus, Göteborgsvägen 11B", undefined, "address"],
    ] },
    { title: "Längst ned", fields: [
      ["link_008", "Integritet, adress", "/integritet"],
      ["text_015", "Integritet, text", "Integritet och cookies"],
      ["text_019", "Cookieinställningar, text", "Cookieinställningar"],
      ["text_016", "Text efter årtalet", "Viriditas – Andreas Håman. Alla rättigheter förbehållna."],
    ] },
  ],
});
