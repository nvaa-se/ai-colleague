const sqlPrompt = (brokenSql, sqlError) => {
  const initialPrompt = `
I have a few internal systems that I need to query for an internal customer
service bot. The bot gathers relevant information about a customer.

You have some tools available at your disposal to help you with this task. The tools are:
- exectueSQL: You can run the query by calling the executeSQL tool function with a SQL query as parameter
In the SQL Query, always use column name "strAnlNr" in the facilities table to join to the correct customer facility.
This is the same as the column "strAnlnr" in the customer_events table. Put the value of strAnlNr in the SQL query as a parameter.

The Database Server is running Microsoft SQL Server 2024.
SORT DATA AS LATEST FIRST unless the user asks otherwise
MAKE SURE THE RESPONSE IS VALID SQL!

Only filter tbFuHandlese by "strAnlNr", as strAnlNr is the only indexed column. Never filter by date, sort the data by date and return the latest X rows.

This is example data from the tables in csv format, delimited with ;

## table: tbFuHandelse
\`\`\`csv
recHandelse;intKundnr;strAnlnr;intTjanstnr;datDatumFrom;datDatumTom;strTaxekod;strRFID;strFordonkod;strAvvikelsekod;strKorlistakod;strUtfortAvSignatur;lngFakturanr;strFakturafrekvens;bolKlarAttFakturera;bolEnbartHandelseTextPaFakturan;bolFakturerasEj;strEntreprenorkod;intRenhOrdernr;intRenhOrderradnr;strAvfallstyp;datSkapad;intSkapadAv;strHandelsetyp;intFakturaradnr;datAvraknadDatum;strAvvikelseText;recHandelsefilInlasning;bolAvraknasEj;strRenhDistriktskod;bolAvvikelse;decXkoord;decYkoord;datDatum
9244599;171501;4212108221;370791;2021-07-29 18:07:00.000;2021-07-29 18:07:00.000;1WC0-2;NULL;404;NULL;NULL;NULL;81106327;ENFAKTKÖRN;1;0;0;DKLBC;446192;1;Slam;2021-07-29 18:11:03.710;174;MTÖM;1;7/31/21 0:00;NULL;2376228;0;SL4;0;6633076.51202581000000000000;204687.12685986900000000000;2021-07-29 00:00:00.000
9244600;171501;4212108221;370791;2021-07-29 18:07:00.000;2021-07-29 18:07:00.000;2EXSLANG22;NULL;404;NULL;NULL;NULL;81106327;ENFAKTKÖRN;1;0;0;DKLBC;446192;2;Slam;2021-07-29 18:11:03.727;174;DEBI;NULL;7/31/21 0:00;NULL;2376228;0;SL4;0;6633076.51202581000000000000;204687.12685986900000000000;2021-07-29 00:00:00.000
11176388;171501;4212108221;510310;2022-07-27 16:49:00.000;2022-07-27 16:49:00.000;1WC3-4;NULL;101;NULL;NULL;NULL;81332646;ENFAKTKÖRN;1;0;0;DKLBC;489891;1;Slam;2022-07-27 16:51:03.113;174;MTÖM;1;7/31/22 0:00;NULL;4291394;0;NULL;0;6633081.68324143000000000000;204685.17979671200000000000;2022-07-27 00:00:00.000
9035479;171501;4212108221;504470;2021-06-28 11:17:44.000;NULL;R190-26Å;08887E326E;HH01;NULL;HSIT1D1;CriHam;NULL;ENFAKTKÖRN;1;0;1;HUSH_3;NULL;NULL;Restavfall;2021-06-28 11:31:12.550;174;TÖMN;NULL;6/30/21 0:00;NULL;2168474;0;3;0;6633067.63156060000000000000;204702.03867924600000000000;2021-06-28 00:00:00.000

\`\`\`

## table: tbFuRenhAvvikelse
\`\`\`csv
intRecnum;strAvvikelsekod;strAvvikelsetext;bolSkallRapporteraSomHandelse;bolFakturerasEj;bolSkallSkapaOrder;bolSkallSkapaNyHandelse;strNyHandelsetyp;bolNyHandelseFakturerasEj;bolSkallAterrapporteraOrder;strFakturaFrekvens;datSkapad;intSkapadAv;bolSkallSkapaArende;strArendeTyp;strArendeAvser;bolAvraknasEj;bolUppdateraVagbeskrivning;bolUppdateraKorordning;bolMatchaKorlistanamn;bolSkrivOverVagbeskrivning;bolUppdateraKvantitet;bolUppdateraKoordinat;bolSkickaSMS;bolSkickaEpost;bolAnnulleraOrder;bolKvitteraOrder;bolUppdateraStoppKoordinat;allowFreeText;forceFreeText;allowDoubleAmount;forceDoubleAmount;allowImage;forceImage;bolBehallaOrder
65;H100;Ej Utställt;1;1;0;1;AVVI;0;1;ENFAKTKÖRN;2018-09-04 13:18:29.643;213;0;Ej Utställt;Avvikelse Hush;0;0;0;0;0;0;0;0;0;0;1;0;1;0;1;0;1;0;0
69;H120;Tagg Ej Läst;1;1;0;1;MTÖM;0;1;ENFAKTKÖRN;2018-09-04 16:02:43.620;213;0;Tagg Ej Läst;Avvikelse Hush;0;0;0;0;0;0;0;0;0;0;1;0;1;0;1;0;1;0;0
77;H195;Tomt kärl;1;1;0;1;AVVI;0;1;ENFAKTKÖRN;2018-09-20 12:18:26.027;600;0;Tomt kärl;Avvikelse Hush;0;0;0;0;0;0;0;0;0;0;1;0;1;0;1;0;1;0;0
\`\`\`

## table: tbFuTaxa
\`\`\`csv
intRecnum;strTaxekod;strTaxebenamning;strFakturagrupp;strProdukt;strDelProdukt;strLayoutkod;datUpphorddatum;bolUtforDebOrdFakt;strTaxaSpecificeringstyp;bolPriserInklMoms;strBehallarestorlektypkod;intTomPerAr;bolKompost;bolSommar;strAvfallstyp;strHandelsetyp;datSkapad;intSkapadAv;bolTaxaTillatenForWebbDispens;bolTaxaTillatenForWebbKarlbyte;bolTaxaTillatenForWebbNyTjanst;strTomningsFrekvenskod;datSenastUppdaterad;bolSummeraTaxedelar;bolHandelseDelas;strEntreprenorkod;bolMobileTjanstKvantitet;bolAgarbytesBrevUndantag;bolTillgangligTjanst;bolAgarbyteAvslutaTjanst;bolSkapaEjRHOrder;strKartsymbol;bolFATjanst
1323;1WC0-2;Slamtömning;VR;RENH;SLAM;Hämtställe;NULL;0;SPUT;0;NULL;NULL;0;0;Slam;MTÖM;2009-11-19 14:23:08.093;2;0;0;0;NULL;12/21/23 15:39;0;1;DKLBC;0;0;0;0;0;Trekammarbrunn;0
1326;1WC3-4;Slamtömning;VR;RENH;SLAM;Hämtställe;NULL;0;SPUT;0;NULL;NULL;0;0;Slam;MTÖM;2009-11-19 14:24:03.303;2;0;0;0;NULL;12/21/23 15:39;0;1;DKLBC;0;0;0;0;0;Trekammarbrunn;0
2214;2EXSLANG;Extra slanglängd;VR;RENH;SLAM;Hämtställe;NULL;0;SPUT;0;NULL;NULL;0;0;Slam;DEBI;2022-12-21 15:09:19.137;275;0;0;0;NULL;12/21/23 15:39;0;1;DKLBC;0;0;0;0;0;NULL;0
2212;2EXSLANG22;Extra slanglängd;VR;RENH;SLAM;Hämtställe;12/31/22 0:00;0;SPUT;0;NULL;NULL;0;0;Slam;DEBI;2020-11-03 16:27:16.440;275;0;0;0;NULL;1/9/23 14:47;0;1;DKLBC;0;0;0;0;0;NULL;0
1747;M140-26Å;Matavfall, 140-literskärl 26 ggr/år;VR;RENH;MAT;Hämtställe;NULL;0;SPUT;0;K140-P;26;0;0;Matavfall;TÖMN;2018-05-23 16:11:31.323;275;0;0;0;26 ggr/år;1/29/24 10:52;0;1;NULL;0;0;1;0;0;Mat;0
1782;R190-26Å;Restavfall, 190-literskärl 26 ggr/år;VR;RENH;HUSH;Hämtställe;NULL;0;SPUT;0;K190;26;0;0;Restavfall;TÖMN;2018-05-23 16:11:31.543;275;0;0;0;26 ggr/år;1/15/24 9:11;0;1;NULL;0;0;1;0;0;Renhallning;0
1173;TAGG_SAKNAS;KONTROLL OLÄST TAGG;VR;RENH;HUSH;Hämtställe;NULL;0;SPUT;0;NULL;NULL;0;0;NULL;DEBI;2018-09-04 15:52:06.377;213;0;0;0;NULL;12/21/23 15:39;0;0;NULL;0;0;0;0;0;NULL;0
\`\`\`

## table: vwanlaggning
\`\`\`csv
intRecnum;strAnlnr;intKundnr;strFornamn1;strEfternamn1;strFornamn2;strEfternamn2;intKundFakturaAdress;strAnlAdressgata;intAnlAdressnr;strAnlAdressbokstav;strPostnr;strAnlOrt;strFastbeteckningTrakt;strFastbeteckningBlock;strFastbeteckningTecken;intFastbeteckningEnhet;strPopularNamn;strFastnyckel;strAnlaggningsKategori;strTelefon;strTelefonArbete;strTelefonMobil;bolSMSOK;bolEpostOK;bolSeparatFaktura;decAnlXkoordinat;decAnlYkoordinat;bolInterndebiteras;strVADistriktskodStat;bolInternmoms;AnlKommunDistriktstyp;AnlStatDistriktstyp;AnlAvlasDistriktstyp;AnlMatbytDistriktstyp;AnlVatrorDistriktstyp;AnlAvlrorDistriktstyp;AnlVatverkDistriktstyp;AnlAvlverkDistriktstyp;AnlExtra1;AnlExtra2;AnlExtra3;strAnlAdressHel;strFastBeteckningHel;strKundNamnHel;decTotalArsforbrukning;strSpecialAdressHel;FaktAdr;AnlDatSkapad;bolAnlAdrSomUtskicksAdr;AntTj;Prod;Bevakning;bolVarnaForKundManuell;bolOmbudAnteckning1;intTypkod;bolFAKommun
28176;4212108221;171501;Testann;Testsson;NULL;NULL;NULL;Karlsängsvägen;29;NULL;76021;Vätö;Harg;25;:;2;NULL;1017059;SMÅHUS;46708624190;46707755831;46709529036;0;0;0;6633104.90000000000000000000;204685.00000000000000000000;0;PERMFASTL;0;KOMDEL;STATOMR;AVLDISTR;MATBYT;VATRORNAT1;AVLRORNAT1;VATVERK;AVLVERK;EXTRA1;EXTRA2;EXTRA3;Karlsängsvägen 29;Harg 25:2;Testann Testsson;NULL;          ;;2009-11-12 12:13:03.477;0;4;RENH;;0;0;220;0
\`\`\`
`
  if (brokenSql && sqlError) {
    return `
      ${initialPrompt}
      \`\`\`
      ${brokenSql}
      \`\`\`

      The above query was generated with the follwing error message:
       "${sqlError}".

      Please fix the SQL query based on the error!
    `
  } else {
    return initialPrompt
  }
}

export default sqlPrompt
