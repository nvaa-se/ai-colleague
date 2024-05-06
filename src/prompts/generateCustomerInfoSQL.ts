const prompt = `
I have a few internal systems that I need to query for an internal customer
service bot. The bot gathers relevant information about a customer ahead of
a call. These are some examples of the tables. Please return with a joined
query that fetches most relevant information from each table for a given phone
number.

Parameter name is "strAnlNr" in the facilities table. This is the same as the
"strAnlnr" in the customer_events table. Put the value of strAnlNr in the
SQL query as a parameter.

Reply in a JSON structure with the SQL query  that fetches the relevant information. It is very
important that your response only includes the valid SQL, no comments or other text.
Also, do not create aliases for columns. And do not rename fields, they have
to be exactly the same as in the examples below.

The reply JSON structure should look like this, there must always be at least one parameter to replace:

\`\`\`
{
  "sql": "SELECT ... FROM ... WHERE ... f.strAnlnr='???strAnlNr???' ...",
  "paramsToReplace": [
    { "param": "strAnlNr", "placeholder": "???strAnlNr???" }
  ]
}
\`\`\`

SQL key is a string with the SQL query. paramsToReplace is an array of strings that should exist within the SQL query.
The Database Server is running Microsoft SQL Server 2024.
SELECT AS FEW FIELDS AS POSSIBLE TO REDUCE DATA TRANSFER SIZE.
The software running the queries will replace param strings with actual values before executing the query.
THE ONLY ACCEPTED PARAMETERS ARE: "strAnlNr".

SORT DATA AS LATEST FIRST unless the user asks otherwise

ANSWER ONLY WITH THE JSON STRUCTURE, NO MARKDOWN! NO COMMENTS! OR OTHER TEXT!
MAKE SURE THE RESPONSE IS VALID JSON AND VALID SQL!

## table: tbFuHandelse
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

## table: tbFuRenhAvvikelse
\`\`\`csv
intRecnum;strAvvikelsekod;strAvvikelsetext;bolSkallRapporteraSomHandelse;strHandelsetyp;bolFakturerasEj;bolSkallSkapaOrder;bolSkallSkapaNyHandelse;strNyHandelsetyp;bolNyHandelseFakturerasEj;bolSkallAterrapporteraOrder;strFakturaFrekvens;strTaxekod;strRenhOrdertyp;datSkapad;intSkapadAv;bolSkallSkapaArende;strArendeTyp;strArendeAvser;bolAvraknasEj;bolUppdateraVagbeskrivning;bolUppdateraKorordning;bolMatchaKorlistanamn;bolSkrivOverVagbeskrivning;bolUppdateraKvantitet;bolUppdateraKoordinat;strDelproduktVagbeskrivning;strKvantitetskod;strDelproduktKvantitet;bolSkickaSMS;datUpphorddatum;bolSkickaEpost;strProdukt;strVAOrdertyp;bolAnnulleraOrder;bolKvitteraOrder;strAutoMeddelandeEpostKod;strAutoMeddelandeSmsKod;bolUppdateraStoppKoordinat;allowFreeText;forceFreeText;allowDoubleAmount;forceDoubleAmount;allowImage;forceImage;bolBehallaOrder
65;H100;Ej Utställt;1;NULL;1;0;1;AVVI;0;1;ENFAKTKÖRN;NULL;NULL;2018-09-04 13:18:29.643;213;0;Ej Utställt;Avvikelse Hush;0;0;0;0;0;0;0;NULL;NULL;NULL;0;NULL;0;NULL;NULL;0;1;NULL;NULL;0;1;0;1;0;1;0;0
69;H120;Tagg Ej Läst;1;NULL;1;0;1;MTÖM;0;1;ENFAKTKÖRN;NULL;NULL;2018-09-04 16:02:43.620;213;0;Tagg Ej Läst;Avvikelse Hush;0;0;0;0;0;0;0;NULL;NULL;NULL;0;NULL;0;NULL;NULL;0;1;NULL;NULL;0;1;0;1;0;1;0;0
77;H195;Tomt kärl;1;NULL;1;0;1;AVVI;0;1;ENFAKTKÖRN;NULL;NULL;2018-09-20 12:18:26.027;600;0;Tomt kärl;Avvikelse Hush;0;0;0;0;0;0;0;NULL;NULL;NULL;0;NULL;0;NULL;NULL;0;1;NULL;NULL;0;1;0;1;0;1;0;0
\`\`\`

## table: tbFuTaxa
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

## table: vwanlaggning
\`\`\`csv
intRecnum;strAnlnr;intKundnr;strFornamn1;strEfternamn1;strFornamn2;strEfternamn2;intKundFakturaAdress;strAnlAdressgata;intAnlAdressnr;strAnlAdressbokstav;strPostnr;strAnlOrt;strFastbeteckningTrakt;strFastbeteckningBlock;strFastbeteckningTecken;intFastbeteckningEnhet;strPopularNamn;strFastnyckel;strFastighetsUuid;strAnlaggningsKategori;strForNamn;strEfterNamn;strTelefon;strTelefonArbete;strTelefonMobil;bolSMSOK;bolEpostOK;strEpostadress;strFakturaFrekvens;intFakturaadress;bolSeparatFaktura;intAgarekundnr;intAvlasningskortsadress;decAnlXkoordinat;decAnlYkoordinat;bolInterndebiteras;strMotpartKoncernkod;strDistriktsInfoExtra1;strDistriktsInfoExtra2;strDistriktsInfoExtra3;strVADistriktskodKomdel;strVADistriktskodStat;strVADistriktskodAvlas;strAvlasningsOrdningsNr;strVADistriktskodMatbyt;strMatarbytesOrdningsNr;strVADistriktskodVatror;strVADistriktskodVatror2;strVADistriktskodAvlror;strVADistriktskodAvlror2;strVADistriktskodVatverk;strVADistriktskodAvlverk;bolInternmoms;AnlKommunDistriktstyp;AnlStatDistriktstyp;AnlAvlasDistriktstyp;AnlMatbytDistriktstyp;AnlVatrorDistriktstyp;AnlAvlrorDistriktstyp;AnlVatverkDistriktstyp;AnlAvlverkDistriktstyp;AnlExtra1;AnlExtra2;AnlExtra3;strAnlAdressHel;strFastBeteckningHel;strKundNamnHel;decTotalArsforbrukning;strSpecialAdressHel;FaktAdr;strAnlReferens;strFakturagrupp;strFakturaSortering;intSpecialadressKontakt;strKommunkod;intUtskickadress;strExtraAnlaggning1;strExtraAnlaggning2;datBrevutskick;strArendeAnteckning;AnlDatSkapad;strAvvikandeDebiterasMoms;bolAnlAdrSomUtskicksAdr;AntTj;Prod;Bevakning;bolVarnaForKundManuell;strKreditBetyg;strNyckelnr;strPortkod;datUpphorddatum;intCFAR;bolOmbudAnteckning1;intTypkod;bolFAKommun
28176;4212108221;171501;Testann;Testsson;NULL;NULL;NULL;Karlsängsvägen;29;NULL;76021;Vätö;Harg;25;:;2;NULL;1017059;NULL;SMÅHUS;NULL;NULL;+46708624190;+46707755831;+46709529036;0;0;NULL;NULL;NULL;0;NULL;NULL;6633104.90000000000000000000;204685.00000000000000000000;0;NULL;NULL;NULL;NULL;NULL;PERMFASTL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;0;KOMDEL;STATOMR;AVLDISTR;MATBYT;VATRORNAT1;AVLRORNAT1;VATVERK;AVLVERK;EXTRA1;EXTRA2;EXTRA3;Karlsängsvägen 29;Harg 25:2;Testann Testsson;NULL;          ;;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;NULL;2009-11-12 12:13:03.477;NULL;0;4;RENH;;0;NULL;NULL;NULL;NULL;NULL;0;220;0
\`\`\`

`

export default prompt
