const prompt = `
Här kommer en förklaring för de olika fälten i tabellen tbFuHandelse

e = events (händelser), tabellen tbFuHandelse

e.recHandelse = Primärnyckel för händelsetabellen
e.intKundnr = Unika numret för en kund
e.strAnlnr = Unika numret för en anläggning, en anläggning kan vara en fastighet men även ett annat objekt så som en fontän eller någon annan typ av offentlig byggnad osv.
e.intTjanstnr = Det unika numret för en tjänst. En tjänst är något vi utför. Kan vara ett abonnemang för soptömning, slambrunn, vattentjänst mm
e.intFakturaadress = Unikt numret till en specialadress. En specialadess är en alternativ adress som ska användas istället för kundens primära adress
e.datDatumFrom = Från och med när händelsen gäller
e.datDatumTom = Till och med datumet för händelsen
e.strTaxekod = Koden för taxan. Taxa innehåller uppgifter om debitering och ersättning. Alltså vad tjänsten eller händelsen avser
e.strAnm = Anmärkningstext för händelsen
e.strRFID = Rfid tagg på sopkärl
e.strFordon = Vilket fordon som utfört händelsen
e.strFordonkod = Unika koden för ett fordon som utfört händelsen
e.strAvvikelsekod = Koden för avvikelsen som registrerats
e.strObjNr = Numret till ett objekt vilket är primärnyckel för tabellen där RFID finns
e.strKorlistakod = Koden för körlistan som är "beställningen" för händelsen. Körlistor används för soptömningar. Det är rutterna som körs
e.strUtfortAvSignatur = Vilken chaufför som utfört händelsen
e.lngFakturanr = Om händelsen fakturerats, så är detta fakturans nummer
e.strFakturafrekvens = Koden för när det ska faktureras
e.bolKlarAttFakturera = Flagga för att händelsen ska fakturerats
e.strHandelseText = Ett textfält för händelsen. Kan användas för att visas på fakturan
e.bolEnbartHandelseTextPaFakturan = Berättar om endast händelsetexten ska visas på fakturan. Annars visas texten ifrån taxan.
e.bolFakturerasEj = Berättar om händelsen inte ska faktureras
e.strEntreprenorkod = Kod för vilken entreprenör som utfört händelsen
e.intRenhOrdernr = Ordernummer om händelsen är skapad utifrån en order
e.intRenhOrderradnr = Vilken rad i orden händelsen är skapad utifrån
e.intVAOrdernr = Om Händelsen är skapad utifrån en VA-order
e.curFastPrisNetto = Om händelsen ska debiteras med ett fast nettopris.
e.strAvfallstyp = Vilken typ av avfall händelsen gäller
e.datSkapad = Skapad datum
e.intSkapadAv = Vilken användare i systemet som skapat händelsen
e.strHandelsetyp = Kod för vilken typ av händelse det är
e.intFakturaradnr = Om fakturerad, så vilken rad på fakturan är genererad utifrån händelsen
e.datAvraknadDatum = Vilken datum händelsen är avräknad. Används för att få ut ett underlag för vilken ersättning entreprenör (utförare) ska få.
e.datKrediteringGodkandDatum = Om händelsen fakturerats och sedan krediterats så anges datum för krediteringen
e.strKrediteringGodkandSignatur = Vilken användare som krediterat
e.bolKrediteringsFragaSkickad = Om händelsen eventuellt ska krediteras
e.strAvvikelseText = Förklaring av vad eventuell avvikelse avser
e.recHandelsefilInlasning = Primärnyckel för register för vilken inläsningsfil som skapat händelsen
e.curAprisNetto = Om händelsen ska debiteras med ett netto pris
e.intInstallationsNr = Om händelsen är genererad utifrån en VA-installation. Det används då som ett faktura underlag för anslutningsavgift
e.bolAvraknasEj = Om händelsen inte ska avräknas. Alltså inte ge någon ersättning till utförare (entreprenör)
e.intSkapadAvRecHandelse = Vet ej
e.intVAOrderradnr = Vilken rad, om händelsen kommer ifrån en VA-order
e.bolAvvikelse = Om händelsen avser en avvikelse
e.decXkoord = xKoordinat på händelsens geoposition
e.decYkoord = yKoordinat på händelsens geoposition
e.strFakturerasEjOrsak = Orsak till varför händelsen inte bör fakturerats. Om den nu ska faktureras i normal fall
e.strFakturerasEjOrsakText = Löptext till strFakturerasEjOrsak. Alltså en utförligare förklaring
e.datDatum = Datum för händelsen utan klockslag
e.strFotoId = Om händelsen har ett kopplat foto
e.datFotoHamtat = Datum för när fotot hämtat ifrån fotoservern
e.strObjekt =
e.strProjekt = Om händelsen har ett projektnummer (det kan komma ifrån VA-installation)
e.strTjanstensOrderIndex = Vet ej/används inte



`

export default prompt
