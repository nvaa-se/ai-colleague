const prompt = `
Du är en kundtjänstmedarbetare på Norrtälje Vatten och Avfall (NVAA), frågan som användaren ställer handlar om en
specifik kund. Svara kort, koncist och exakt. Svara alltid på svenska.
Här är kundens data


f = facilities
e = events
d = deviations
t = tariffs

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

## table: customer_events
\`\`\`csv
recHandelse;intKundnr;strAnlnr;intTjanstnr;intFakturaadress;datDatumFrom;datDatumTom;strTaxekod;strAnm;strRFID;strFordon;strFordonkod;strAvvikelsekod;strObjNr;strKorlistakod;strUtfortAvSignatur;lngFakturanr;strFakturafrekvens;bolKlarAttFakturera;strHandelseText;bolEnbartHandelseTextPaFakturan;bolFakturerasEj;strEntreprenorkod;intRenhOrdernr;intRenhOrderradnr;intVAOrdernr;curFastPrisNetto;strEWCKod;strUNNr;strRDKod;strAvfallstyp;strEnhetKort;datSkapad;intSkapadAv;strHandelsetyp;strVagsedelNr;intFakturaradnr;datAvraknadDatum;datKrediteringGodkandDatum;strKrediteringGodkandSignatur;bolKrediteringsFragaSkickad;strAvvikelseText;recHandelsefilInlasning;curAprisNetto;datLagerFort;strLagerplatskodFran;strLagerplatskod;strFakturagruppering;intInstallationsNr;bolAvraknasEj;strRenhDistriktskod;intSkapadAvRecHandelse;intVAOrderradnr;bolAvvikelse;decXkoord;decYkoord;strFakturerasEjOrsak;strFakturerasEjOrsakText;datDatum;strFotoId;datFotoHamtat;strObjekt;strProjekt;strInkast;strTjanstensOrderIndex
9244599;171501;4212108221;370791;NULL;2021-07-29 18:07:00.000;2021-07-29 18:07:00.000;1WC0-2;NULL;NULL;NULL;404;NULL;NULL;NULL;NULL;81106327;ENFAKTKÖRN;1;NULL;0;0;DKLBC;446192;1;NULL;NULL;NULL;NULL;NULL;Slam;NULL;2021-07-29 18:11:03.710;174;MTÖM;NULL;1;7/31/21 0:00;NULL;NULL;NULL;NULL;2376228;NULL;NULL;NULL;NULL;NULL;NULL;0;SL4;NULL;NULL;0;6633076.51202581000000000000;204687.12685986900000000000;NULL;NULL;2021-07-29 00:00:00.000;NULL;NULL;NULL;NULL;NULL;NULL
9244600;171501;4212108221;370791;NULL;2021-07-29 18:07:00.000;2021-07-29 18:07:00.000;2EXSLANG22;NULL;NULL;NULL;404;NULL;NULL;NULL;NULL;81106327;ENFAKTKÖRN;1;NULL;0;0;DKLBC;446192;2;NULL;NULL;NULL;NULL;NULL;Slam;NULL;2021-07-29 18:11:03.727;174;DEBI;NULL;NULL;7/31/21 0:00;NULL;NULL;NULL;NULL;2376228;NULL;NULL;NULL;NULL;NULL;NULL;0;SL4;NULL;NULL;0;6633076.51202581000000000000;204687.12685986900000000000;NULL;NULL;2021-07-29 00:00:00.000;NULL;NULL;NULL;NULL;NULL;NULL
11176388;171501;4212108221;510310;NULL;2022-07-27 16:49:00.000;2022-07-27 16:49:00.000;1WC3-4;NULL;NULL;NULL;101;NULL;NULL;NULL;NULL;81332646;ENFAKTKÖRN;1;NULL;0;0;DKLBC;489891;1;NULL;NULL;NULL;NULL;NULL;Slam;NULL;2022-07-27 16:51:03.113;174;MTÖM;NULL;1;7/31/22 0:00;NULL;NULL;NULL;NULL;4291394;NULL;NULL;NULL;NULL;NULL;NULL;0;NULL;NULL;NULL;0;6633081.68324143000000000000;204685.17979671200000000000;NULL;NULL;2022-07-27 00:00:00.000;NULL;NULL;NULL;NULL;NULL;NULL
11176389;171501;4212108221;510310;NULL;2022-07-27 16:49:00.000;2022-07-27 16:49:00.000;2EXSLANG22;NULL;NULL;NULL;101;NULL;NULL;NULL;NULL;81332646;ENFAKTKÖRN;1;NULL;0;0;DKLBC;489891;2;NULL;NULL;NULL;NULL;NULL;Slam;NULL;2022-07-27 16:51:03.130;174;DEBI;NULL;NULL;7/31/22 0:00;NULL;NULL;NULL;NULL;4291394;NULL;NULL;NULL;NULL;NULL;NULL;0;NULL;NULL;NULL;0;6633081.68324143000000000000;204685.17979671200000000000;NULL;NULL;2022-07-27 00:00:00.000;NULL;NULL;NULL;NULL;NULL;NULL
13224554;171501;4212108221;510310;NULL;2023-07-28 08:57:00.000;2023-07-28 08:57:00.000;1WC3-4;NULL;NULL;NULL;101;NULL;NULL;NULL;NULL;81560209;ENFAKTKÖRN;1;NULL;0;0;DKLBC;532957;1;NULL;NULL;NULL;NULL;NULL;Slam;NULL;2023-07-28 09:01:29.807;174;MTÖM;NULL;1;7/31/23 0:00;NULL;NULL;NULL;NULL;6392936;NULL;NULL;NULL;NULL;NULL;NULL;0;SL 101;NULL;NULL;0;6633079.14438582000000000000;204689.33340857900000000000;NULL;NULL;2023-07-28 00:00:00.000;NULL;NULL;NULL;NULL;NULL;NULL
13224555;171501;4212108221;510310;NULL;2023-07-28 08:57:00.000;2023-07-28 08:57:00.000;2EXSLANG;NULL;NULL;NULL;101;NULL;NULL;NULL;NULL;81560209;ENFAKTKÖRN;1;NULL;0;0;DKLBC;532957;2;NULL;NULL;NULL;NULL;NULL;Slam;NULL;2023-07-28 09:01:29.823;174;DEBI;NULL;NULL;7/31/23 0:00;NULL;NULL;NULL;NULL;6392936;NULL;NULL;NULL;NULL;NULL;NULL;0;SL 101;NULL;NULL;0;6633079.14438582000000000000;204689.33340857900000000000;NULL;NULL;2023-07-28 00:00:00.000;NULL;NULL;NULL;NULL;NULL;NULL
9035470;171501;4212108221;495219;NULL;2021-06-28 11:19:37.000;NULL;M140-26Å;NULL;08887EF0FF;NULL;HH01;H195;NULL;HSIT1D1;CriHam;NULL;ENFAKTKÖRN;0;NULL;0;1;HUSH_3;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;2021-06-28 11:31:09.287;174;AVVI;NULL;NULL;6/30/21 0:00;NULL;NULL;NULL;NULL;2168465;NULL;NULL;NULL;NULL;NULL;NULL;0;NULL;NULL;NULL;1;6633067.63018517000000000000;204701.94514716200000000000;NULL;NULL;2021-06-28 00:00:00.000;NULL;NULL;NULL;NULL;NULL;NULL
\`\`\`

## table: deviations
\`\`\`csv
intRecnum;strAvvikelsekod;strAvvikelsetext;bolSkallRapporteraSomHandelse;strHandelsetyp;bolFakturerasEj;bolSkallSkapaOrder;bolSkallSkapaNyHandelse;strNyHandelsetyp;bolNyHandelseFakturerasEj;bolSkallAterrapporteraOrder;strFakturaFrekvens;strTaxekod;strRenhOrdertyp;datSkapad;intSkapadAv;bolSkallSkapaArende;strArendeTyp;strArendeAvser;bolAvraknasEj;bolUppdateraVagbeskrivning;bolUppdateraKorordning;bolMatchaKorlistanamn;bolSkrivOverVagbeskrivning;bolUppdateraKvantitet;bolUppdateraKoordinat;strDelproduktVagbeskrivning;strKvantitetskod;strDelproduktKvantitet;bolSkickaSMS;datUpphorddatum;bolSkickaEpost;strProdukt;strVAOrdertyp;bolAnnulleraOrder;bolKvitteraOrder;strAutoMeddelandeEpostKod;strAutoMeddelandeSmsKod;bolUppdateraStoppKoordinat;allowFreeText;forceFreeText;allowDoubleAmount;forceDoubleAmount;allowImage;forceImage;bolBehallaOrder
65;H100;Ej Utställt;1;NULL;1;0;1;AVVI;0;1;ENFAKTKÖRN;NULL;NULL;2018-09-04 13:18:29.643;213;0;Ej Utställt;Avvikelse Hush;0;0;0;0;0;0;0;NULL;NULL;NULL;0;NULL;0;NULL;NULL;0;1;NULL;NULL;0;1;0;1;0;1;0;0
69;H120;Tagg Ej Läst;1;NULL;1;0;1;MTÖM;0;1;ENFAKTKÖRN;NULL;NULL;2018-09-04 16:02:43.620;213;0;Tagg Ej Läst;Avvikelse Hush;0;0;0;0;0;0;0;NULL;NULL;NULL;0;NULL;0;NULL;NULL;0;1;NULL;NULL;0;1;0;1;0;1;0;0
77;H195;Tomt kärl;1;NULL;1;0;1;AVVI;0;1;ENFAKTKÖRN;NULL;NULL;2018-09-20 12:18:26.027;600;0;Tomt kärl;Avvikelse Hush;0;0;0;0;0;0;0;NULL;NULL;NULL;0;NULL;0;NULL;NULL;0;1;NULL;NULL;0;1;0;1;0;1;0;0
\`\`\`

## table: tariffs
\`\`\`csv
intRecnum;strTaxekod;strTaxebenamning;strFakturagrupp;strProdukt;strDelProdukt;strLayoutkod;datUpphorddatum;datDelAvArFrom;datDelAvArTom;bolUtforDebOrdFakt;strTaxaSpecificeringstyp;bolPriserInklMoms;strBehallarestorlektypkod;intTomPerAr;bolKompost;bolSommar;strAvfallstyp;strEWCKod;decMangdPerTom;intMinimiforbrukning;strHandelsetyp;datSkapad;intSkapadAv;bolTaxaTillatenForWebbDispens;bolTaxaTillatenForWebbKarlbyte;strAvrakningTaxekodAvdrag;decMatarStorlekKbm;bolTaxaTillatenForWebbNyTjanst;strRenhOrdertyp;strTomningsFrekvenskod;strUNNr;datSenastUppdaterad;strSummaAvserText;bolSummeraTaxedelar;strSummeraLayoutKod;bolHandelseDelas;decVolymPerAr;strEntreprenorkod;strFakturaFrekvens;bolMobileTjanstKvantitet;strHamtschemaText;strRDKod;bolAgarbytesBrevUndantag;bolTillgangligTjanst;bolAgarbyteAvslutaTjanst;decMatarstorlekQ3;bolSkapaEjRHOrder;strKartsymbol;bolFATjanst
1323;1WC0-2;Slamtömning;VR;RENH;SLAM;Hämtställe;NULL;NULL;NULL;0;SPUT;0;NULL;NULL;0;0;Slam;NULL;NULL;NULL;MTÖM;2009-11-19 14:23:08.093;2;0;0;NULL;NULL;0;NULL;NULL;NULL;12/21/23 15:39;NULL;0;NULL;1;NULL;DKLBC;NULL;0;NULL;NULL;0;0;0;NULL;0;Trekammarbrunn;0
1326;1WC3-4;Slamtömning;VR;RENH;SLAM;Hämtställe;NULL;NULL;NULL;0;SPUT;0;NULL;NULL;0;0;Slam;NULL;NULL;NULL;MTÖM;2009-11-19 14:24:03.303;2;0;0;NULL;NULL;0;NULL;NULL;NULL;12/21/23 15:39;NULL;0;NULL;1;NULL;DKLBC;NULL;0;NULL;NULL;0;0;0;NULL;0;Trekammarbrunn;0
2214;2EXSLANG;Extra slanglängd;VR;RENH;SLAM;Hämtställe;NULL;NULL;NULL;0;SPUT;0;NULL;NULL;0;0;Slam;NULL;NULL;NULL;DEBI;2022-12-21 15:09:19.137;275;0;0;NULL;NULL;0;NULL;NULL;NULL;12/21/23 15:39;NULL;0;NULL;1;NULL;DKLBC;NULL;0;NULL;NULL;0;0;0;NULL;0;NULL;0
2212;2EXSLANG22;Extra slanglängd;VR;RENH;SLAM;Hämtställe;12/31/22 0:00;NULL;NULL;0;SPUT;0;NULL;NULL;0;0;Slam;NULL;NULL;NULL;DEBI;2020-11-03 16:27:16.440;275;0;0;NULL;NULL;0;NULL;NULL;NULL;1/9/23 14:47;NULL;0;NULL;1;NULL;DKLBC;NULL;0;NULL;NULL;0;0;0;NULL;0;NULL;0
1747;M140-26Å;Matavfall, 140-literskärl 26 ggr/år;VR;RENH;MAT;Hämtställe;NULL;NULL;NULL;0;SPUT;0;K140-P;26;0;0;Matavfall;NULL;NULL;NULL;TÖMN;2018-05-23 16:11:31.323;275;0;0;NULL;NULL;0;NULL;26 ggr/år;NULL;1/29/24 10:52;NULL;0;NULL;1;NULL;NULL;NULL;0;NULL;NULL;0;1;0;NULL;0;Mat;0
1782;R190-26Å;Restavfall, 190-literskärl 26 ggr/år;VR;RENH;HUSH;Hämtställe;NULL;NULL;NULL;0;SPUT;0;K190;26;0;0;Restavfall;NULL;NULL;NULL;TÖMN;2018-05-23 16:11:31.543;275;0;0;NULL;NULL;0;NULL;26 ggr/år;NULL;1/15/24 9:11;NULL;0;NULL;1;NULL;NULL;NULL;0;NULL;NULL;0;1;0;NULL;0;Renhallning;0
1173;TAGG_SAKNAS;KONTROLL OLÄST TAGG;VR;RENH;HUSH;Hämtställe;NULL;NULL;NULL;0;SPUT;0;NULL;NULL;0;0;NULL;NULL;NULL;NULL;DEBI;2018-09-04 15:52:06.377;213;0;0;NULL;NULL;0;NULL;NULL;NULL;12/21/23 15:39;NULL;0;NULL;0;NULL;NULL;NULL;0;NULL;NULL;0;0;0;NULL;0;NULL;0
\`\`\`

## table: facilities
\`\`\`csv
intRecnum;strAnlnr;intKundnr;strFornamn1;strEfternamn1;strFornamn2;strEfternamn2;intKundFakturaAdress;strAnlAdressgata;intAnlAdressnr;strAnlAdressbokstav;strPostnr;strAnlOrt;strFastbeteckningTrakt;strFastbeteckningBlock;strFastbeteckningTecken;intFastbeteckningEnhet;strPopularNamn;strFastnyckel;strFastighetsUuid;strAnlaggningsKategori;strForNamn;strEfterNamn;strTelefon;strTelefonArbete;strTelefonMobil;bolSMSOK;bolEpostOK;strEpostadress;strFakturaFrekvens;intFakturaadress;bolSeparatFaktura;intAgarekundnr;intAvlasningskortsadress;decAnlXkoordinat;decAnlYkoordinat;bolInterndebiteras;strMotpartKoncernkod;strDistriktsInfoExtra1;strDistriktsInfoExtra2;strDistriktsInfoExtra3;strVADistriktskodKomdel;strVADistriktskodStat;strVADistriktskodAvlas;strAvlasningsOrdningsNr;strVADistriktskodMatbyt;strMatarbytesOrdningsNr;strVADistriktskodVatror;strVADistriktskodVatror2;strVADistriktskodAvlror;strVADistriktskodAvlror2;strVADistriktskodVatverk;strVADistriktskodAvlverk;bolInternmoms;AnlKommunDistriktstyp;AnlStatDistriktstyp;AnlAvlasDistriktstyp;AnlMatbytDistriktstyp;AnlVatrorDistriktstyp;AnlAvlrorDistriktstyp;AnlVatverkDistriktstyp;AnlAvlverkDistriktstyp;AnlExtra1;AnlExtra2;AnlExtra3;strAnlAdressHel;strFastBeteckningHel;strKundNamnHel;decTotalArsforbrukning;strSpecialAdressHel;FaktAdr;strAnlReferens;strFakturagrupp;strFakturaSortering;intSpecialadressKontakt;strKommunkod;intUtskickadress;strExtraAnlaggning1;strExtraAnlaggning2;datBrevutskick;strArendeAnteckning;AnlDatSkapad;strAvvikandeDebiterasMoms;bolAnlAdrSomUtskicksAdr;AntTj;Prod;Bevakning;bolVarnaForKundManuell;strKreditBetyg;strNyckelnr;strPortkod;datUpphorddatum;intCFAR;bolOmbudAnteckning1;intTypkod;bolFAKommun
28176;4212108221;171501;Testann;Testsson;NULL;NULL;NULL;Karlsängsvägen;29;NULL;76021;Vätö;Harg;25;:;2;NULL;1017059;NULL;SMÅHUS;NULL;NULL;+46708624190;+46707755831;+46709529036;0;0;NULL;NULL;NULL;0;NULL;NULL;6633104.90000000000000000000;204685.00000000000000000000;0;NULL;NULL;NULL;NULL;NULL;PERMFASTL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;0;KOMDEL;STATOMR;AVLDISTR;MATBYT;VATRORNAT1;AVLRORNAT1;VATVERK;AVLVERK;EXTRA1;EXTRA2;EXTRA3;Karlsängsvägen 29;Harg 25:2;Testann Testsson;NULL;          ;;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;2009-11-12 12:13:03.477;NULL;0;4;RENH;;0;NULL;NULL;NULL;NULL;NULL;0;220;0
\`\`\`


`

export default prompt
