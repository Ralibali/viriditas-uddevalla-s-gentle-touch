import { defineRoute } from "./define";
import andreasPortrait from "@/assets/andreas-portrait.webp";
import massagePhoto from "@/assets/massage-2.webp";

export const aboutContent = defineRoute({
  id: "about",
  label: "Om Andreas",
  path: "/om-andreas",
  sections: [
    { title: "Sökmotorer", fields: [
      ["seo_001", "Sidtitel i sökresultat och webbläsarflik", "Om Andreas Håman | Certifierad massör i Uddevalla"],
      ["seo_002", "Beskrivning i sökresultat", "Andreas Håman – diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage i Uddevalla. Lär känna mannen bakom Viriditas.", "longtext"],
      ["seo_003", "Brödsmula, startsidan: Hem", "Hem"],
      ["seo_004", "Brödsmula, den här sidan: Om Andreas", "Om Andreas"],
      ["seo_005", "Yrkestitel för Google: Certifierad massör", "Certifierad massör"],
      ["seo_006", "Arbetsplats för Google: Uddevalla Folkets Hus", "Uddevalla Folkets Hus"],
      ["seo_007", "Gatuadress för Google: Göteborgsvägen 11B", "Göteborgsvägen 11B"],
      ["seo_008", "Ort för Google: Uddevalla", "Uddevalla"],
    ] },
    { title: "Sidans början", fields: [
      ["text_001", "Huvudrubrik (H1)", "Andreas Håman – Certifierad massör i Uddevalla"],
      ["text_002", "Ingress", "Andreas Håman är diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage med bakgrund inom vården. Hans resa till massageyrket är ovanlig – och det är just det som gör hans behandlingar unika.", "longtext"],
      ["image_001", "Porträtt", andreasPortrait],
      ["text_009", "Porträttets bildtext: Andreas Håman, massageterapeut på Viriditas i…", "Andreas Håman, massageterapeut på Viriditas i Uddevalla"],
    ] },
    { title: "Berättelsen", fields: [
      ["text_003", "Stycke: Andreas har en synnedsättning som skärpt hans…", "Andreas har en synnedsättning som skärpt hans övriga sinnen på ett sätt som är svårt att förklara men lätt att känna. Varje behandling är djupt uppmärksam. Han lyssnar med händerna.", "longtext"],
      ["text_010", "Citat: Jag lyssnar med händerna.", "Jag lyssnar med händerna."],
      ["text_004", "Stycke: Han praktiserar i Uddevalla Folkets Hus, Göteb…", "Han praktiserar i Uddevalla Folkets Hus, Göteborgsvägen 11B, och erbjuder klassisk massage och återhämtningsmassage – anpassade efter varje persons unika behov, oavsett om du söker avkoppling, smärtlindring eller återhämtning.", "longtext"],
      ["image_002", "Bild från en behandling", massagePhoto],
      ["text_011", "Bildtext: Andreas under en behandling i mottagningen i U…", "Andreas under en behandling i mottagningen i Uddevalla Folkets Hus"],
      ["text_012", "Rubrik för utbildning och bakgrund: Utbildning och bakgrund", "Utbildning och bakgrund"],
      ["text_013", "Utbildning, punkt 1: Diplomerad massageterapeut", "Diplomerad massageterapeut"],
      ["text_014", "Utbildning, punkt 2: Certifierad massör enligt Branschrådet Svensk…", "Certifierad massör enligt Branschrådet Svensk Massage"],
      ["text_015", "Utbildning, punkt 3: Bakgrund inom personlig assistans, psykiatri o…", "Bakgrund inom personlig assistans, psykiatri och äldreomsorg"],
    ] },
    { title: "Bokning och länkar", fields: [
      ["text_005", "Bokningsrutan längst ned, rubrik", "Nyfiken på hur det känns?"],
      ["text_006", "Bokningsrutan längst ned, text", "Boka din första behandling och upplev skillnaden."],
      ["text_007", "Bokningsrutan längst ned, text på knappen", "Boka din tid"],
      ["link_001", "Länk till klassisk massage, adress", "/klassisk-massage"],
      ["text_008", "Länk till klassisk massage, länktext", "Läs mer om klassisk massage"],
    ] },
  ],
});
