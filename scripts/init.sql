CREATE DATABASE nvaa_ai_colleague;

GRANT ALL PRIVILEGES ON DATABASE nvaa_ai_colleague TO postgres;

USE nvaa_ai_colleague;

CREATE TABLE public.tariff(
   intRecnum                      INTEGER  NOT NULL PRIMARY KEY
  ,strTaxekod                     VARCHAR(255) NOT NULL
  ,strTaxebenamning               VARCHAR(255) NOT NULL
  ,strFakturagrupp                VARCHAR(255) NOT NULL
  ,strProdukt                     VARCHAR(255) NOT NULL
  ,strDelProdukt                  VARCHAR(255) NOT NULL
  ,strLayoutkod                   VARCHAR(255) NOT NULL
  ,datUpphorddatum                DATE
  ,datDelAvArFrom                 DATE
  ,datDelAvArTom                  DATE
  ,bolUtforDebOrdFakt             BOOLEAN  NOT NULL
  ,strTaxaSpecificeringstyp       VARCHAR(255) NOT NULL
  ,bolPriserInklMoms              BOOLEAN  NOT NULL
  ,strBehallarestorlektypkod      VARCHAR(255)
  ,intTomPerAr                    INTEGER
  ,bolKompost                     BOOLEAN  NOT NULL
  ,bolSommar                      BOOLEAN  NOT NULL
  ,strAvfallstyp                  VARCHAR(255)
  ,strEWCKod                      VARCHAR(255)
  ,decMangdPerTom                 NUMERIC
  ,intMinimiforbrukning           INT
  ,strHandelsetyp                 VARCHAR(255) NOT NULL
  ,datSkapad                      DATE  NOT NULL
  ,intSkapadAv                    INTEGER  NOT NULL
  ,bolTaxaTillatenForWebbDispens  BOOLEAN  NOT NULL
  ,bolTaxaTillatenForWebbKarlbyte BOOLEAN  NOT NULL
  ,strAvrakningTaxekodAvdrag      VARCHAR(255)
  ,decMatarStorlekKbm             NUMERIC
  ,bolTaxaTillatenForWebbNyTjanst BOOLEAN  NOT NULL
  ,strRenhOrdertyp                VARCHAR(255)
  ,strTomningsFrekvenskod         VARCHAR(255)
  ,strUNNr                        VARCHAR(255)
  ,datSenastUppdaterad            DATE  NOT NULL
  ,strSummaAvserText              VARCHAR(255)
  ,bolSummeraTaxedelar            BOOLEAN  NOT NULL
  ,strSummeraLayoutKod            VARCHAR(255)
  ,bolHandelseDelas               BOOLEAN  NOT NULL
  ,decVolymPerAr                  NUMERIC
  ,strEntreprenorkod              VARCHAR(255)
  ,strFakturaFrekvens             VARCHAR(255)
  ,bolMobileTjanstKvantitet       BOOLEAN  NOT NULL
  ,strHamtschemaText              VARCHAR(255)
  ,strRDKod                       VARCHAR(255)
  ,bolAgarbytesBrevUndantag       BOOLEAN  NOT NULL
  ,bolTillgangligTjanst           BOOLEAN  NOT NULL
  ,bolAgarbyteAvslutaTjanst       BOOLEAN  NOT NULL
  ,decMatarstorlekQ3              NUMERIC
  ,bolSkapaEjRHOrder              BOOLEAN  NOT NULL
  ,strKartsymbol                  VARCHAR(255)
  ,bolFATjanst                    BOOLEAN  NOT NULL
);
-- INSERT INTO tariff(intRecnum,strTaxekod,strTaxebenamning,strFakturagrupp,strProdukt,strDelProdukt,strLayoutkod,datUpphorddatum,datDelAvArFrom,datDelAvArTom,bolUtforDebOrdFakt,strTaxaSpecificeringstyp,bolPriserInklMoms,strBehallarestorlektypkod,intTomPerAr,bolKompost,bolSommar,strAvfallstyp,strEWCKod,decMangdPerTom,intMinimiforbrukning,strHandelsetyp,datSkapad,intSkapadAv,bolTaxaTillatenForWebbDispens,bolTaxaTillatenForWebbKarlbyte,strAvrakningTaxekodAvdrag,decMatarStorlekKbm,bolTaxaTillatenForWebbNyTjanst,strRenhOrdertyp,strTomningsFrekvenskod,strUNNr,datSenastUppdaterad,strSummaAvserText,bolSummeraTaxedelar,strSummeraLayoutKod,bolHandelseDelas,decVolymPerAr,strEntreprenorkod,strFakturaFrekvens,bolMobileTjanstKvantitet,strHamtschemaText,strRDKod,bolAgarbytesBrevUndantag,bolTillgangligTjanst,bolAgarbyteAvslutaTjanst,decMatarstorlekQ3,bolSkapaEjRHOrder,strKartsymbol,bolFATjanst) VALUES (1323,'1WC0-2','Slamtömning','VR','RENH','SLAM','Hämtställe',NULL,NULL,NULL,FALSE,'SPUT',FALSE,NULL,NULL,FALSE,FALSE,'Slam',NULL,NULL,NULL,'MTÖM','2009-11-19 14:23:08.093',2,FALSE,FALSE,NULL,NULL,FALSE,NULL,NULL,NULL,'12/21/23 15:39',NULL,FALSE,NULL,TRUE,NULL,'DKLBC',NULL,FALSE,NULL,NULL,FALSE,FALSE,FALSE,NULL,FALSE,'Trekammarbrunn',FALSE);
-- INSERT INTO tariff(intRecnum,strTaxekod,strTaxebenamning,strFakturagrupp,strProdukt,strDelProdukt,strLayoutkod,datUpphorddatum,datDelAvArFrom,datDelAvArTom,bolUtforDebOrdFakt,strTaxaSpecificeringstyp,bolPriserInklMoms,strBehallarestorlektypkod,intTomPerAr,bolKompost,bolSommar,strAvfallstyp,strEWCKod,decMangdPerTom,intMinimiforbrukning,strHandelsetyp,datSkapad,intSkapadAv,bolTaxaTillatenForWebbDispens,bolTaxaTillatenForWebbKarlbyte,strAvrakningTaxekodAvdrag,decMatarStorlekKbm,bolTaxaTillatenForWebbNyTjanst,strRenhOrdertyp,strTomningsFrekvenskod,strUNNr,datSenastUppdaterad,strSummaAvserText,bolSummeraTaxedelar,strSummeraLayoutKod,bolHandelseDelas,decVolymPerAr,strEntreprenorkod,strFakturaFrekvens,bolMobileTjanstKvantitet,strHamtschemaText,strRDKod,bolAgarbytesBrevUndantag,bolTillgangligTjanst,bolAgarbyteAvslutaTjanst,decMatarstorlekQ3,bolSkapaEjRHOrder,strKartsymbol,bolFATjanst) VALUES (1326,'1WC3-4','Slamtömning','VR','RENH','SLAM','Hämtställe',NULL,NULL,NULL,FALSE,'SPUT',FALSE,NULL,NULL,FALSE,FALSE,'Slam',NULL,NULL,NULL,'MTÖM','2009-11-19 14:24:03.303',2,FALSE,FALSE,NULL,NULL,FALSE,NULL,NULL,NULL,'12/21/23 15:39',NULL,FALSE,NULL,TRUE,NULL,'DKLBC',NULL,FALSE,NULL,NULL,FALSE,FALSE,FALSE,NULL,FALSE,'Trekammarbrunn',FALSE);
-- INSERT INTO tariff(intRecnum,strTaxekod,strTaxebenamning,strFakturagrupp,strProdukt,strDelProdukt,strLayoutkod,datUpphorddatum,datDelAvArFrom,datDelAvArTom,bolUtforDebOrdFakt,strTaxaSpecificeringstyp,bolPriserInklMoms,strBehallarestorlektypkod,intTomPerAr,bolKompost,bolSommar,strAvfallstyp,strEWCKod,decMangdPerTom,intMinimiforbrukning,strHandelsetyp,datSkapad,intSkapadAv,bolTaxaTillatenForWebbDispens,bolTaxaTillatenForWebbKarlbyte,strAvrakningTaxekodAvdrag,decMatarStorlekKbm,bolTaxaTillatenForWebbNyTjanst,strRenhOrdertyp,strTomningsFrekvenskod,strUNNr,datSenastUppdaterad,strSummaAvserText,bolSummeraTaxedelar,strSummeraLayoutKod,bolHandelseDelas,decVolymPerAr,strEntreprenorkod,strFakturaFrekvens,bolMobileTjanstKvantitet,strHamtschemaText,strRDKod,bolAgarbytesBrevUndantag,bolTillgangligTjanst,bolAgarbyteAvslutaTjanst,decMatarstorlekQ3,bolSkapaEjRHOrder,strKartsymbol,bolFATjanst) VALUES (2214,'2EXSLANG','Extra slanglängd','VR','RENH','SLAM','Hämtställe',NULL,NULL,NULL,FALSE,'SPUT',FALSE,NULL,NULL,FALSE,FALSE,'Slam',NULL,NULL,NULL,'DEBI','2022-12-21 15:09:19.137',275,FALSE,FALSE,NULL,NULL,FALSE,NULL,NULL,NULL,'12/21/23 15:39',NULL,FALSE,NULL,TRUE,NULL,'DKLBC',NULL,FALSE,NULL,NULL,FALSE,FALSE,FALSE,NULL,FALSE,NULL,FALSE);
-- INSERT INTO tariff(intRecnum,strTaxekod,strTaxebenamning,strFakturagrupp,strProdukt,strDelProdukt,strLayoutkod,datUpphorddatum,datDelAvArFrom,datDelAvArTom,bolUtforDebOrdFakt,strTaxaSpecificeringstyp,bolPriserInklMoms,strBehallarestorlektypkod,intTomPerAr,bolKompost,bolSommar,strAvfallstyp,strEWCKod,decMangdPerTom,intMinimiforbrukning,strHandelsetyp,datSkapad,intSkapadAv,bolTaxaTillatenForWebbDispens,bolTaxaTillatenForWebbKarlbyte,strAvrakningTaxekodAvdrag,decMatarStorlekKbm,bolTaxaTillatenForWebbNyTjanst,strRenhOrdertyp,strTomningsFrekvenskod,strUNNr,datSenastUppdaterad,strSummaAvserText,bolSummeraTaxedelar,strSummeraLayoutKod,bolHandelseDelas,decVolymPerAr,strEntreprenorkod,strFakturaFrekvens,bolMobileTjanstKvantitet,strHamtschemaText,strRDKod,bolAgarbytesBrevUndantag,bolTillgangligTjanst,bolAgarbyteAvslutaTjanst,decMatarstorlekQ3,bolSkapaEjRHOrder,strKartsymbol,bolFATjanst) VALUES (2212,'2EXSLANG22','Extra slanglängd','VR','RENH','SLAM','Hämtställe','12/31/22 0:00',NULL,NULL,FALSE,'SPUT',FALSE,NULL,NULL,FALSE,FALSE,'Slam',NULL,NULL,NULL,'DEBI','2020-11-03 16:27:16.440',275,FALSE,FALSE,NULL,NULL,FALSE,NULL,NULL,NULL,'1/9/23 14:47',NULL,FALSE,NULL,TRUE,NULL,'DKLBC',NULL,FALSE,NULL,NULL,FALSE,FALSE,FALSE,NULL,FALSE,NULL,FALSE);
-- INSERT INTO tariff(intRecnum,strTaxekod,strTaxebenamning,strFakturagrupp,strProdukt,strDelProdukt,strLayoutkod,datUpphorddatum,datDelAvArFrom,datDelAvArTom,bolUtforDebOrdFakt,strTaxaSpecificeringstyp,bolPriserInklMoms,strBehallarestorlektypkod,intTomPerAr,bolKompost,bolSommar,strAvfallstyp,strEWCKod,decMangdPerTom,intMinimiforbrukning,strHandelsetyp,datSkapad,intSkapadAv,bolTaxaTillatenForWebbDispens,bolTaxaTillatenForWebbKarlbyte,strAvrakningTaxekodAvdrag,decMatarStorlekKbm,bolTaxaTillatenForWebbNyTjanst,strRenhOrdertyp,strTomningsFrekvenskod,strUNNr,datSenastUppdaterad,strSummaAvserText,bolSummeraTaxedelar,strSummeraLayoutKod,bolHandelseDelas,decVolymPerAr,strEntreprenorkod,strFakturaFrekvens,bolMobileTjanstKvantitet,strHamtschemaText,strRDKod,bolAgarbytesBrevUndantag,bolTillgangligTjanst,bolAgarbyteAvslutaTjanst,decMatarstorlekQ3,bolSkapaEjRHOrder,strKartsymbol,bolFATjanst) VALUES (1747,'M140-26Å','Matavfall, 140-literskärl 26 ggr/år','VR','RENH','MAT','Hämtställe',NULL,NULL,NULL,FALSE,'SPUT',FALSE,'K140-P',26,FALSE,FALSE,'Matavfall',NULL,NULL,NULL,'TÖMN','2018-05-23 16:11:31.323',275,FALSE,FALSE,NULL,NULL,FALSE,NULL,'26 ggr/år',NULL,'1/29/24 10:52',NULL,FALSE,NULL,TRUE,NULL,NULL,NULL,FALSE,NULL,NULL,FALSE,TRUE,FALSE,NULL,FALSE,'Mat',FALSE);
-- INSERT INTO tariff(intRecnum,strTaxekod,strTaxebenamning,strFakturagrupp,strProdukt,strDelProdukt,strLayoutkod,datUpphorddatum,datDelAvArFrom,datDelAvArTom,bolUtforDebOrdFakt,strTaxaSpecificeringstyp,bolPriserInklMoms,strBehallarestorlektypkod,intTomPerAr,bolKompost,bolSommar,strAvfallstyp,strEWCKod,decMangdPerTom,intMinimiforbrukning,strHandelsetyp,datSkapad,intSkapadAv,bolTaxaTillatenForWebbDispens,bolTaxaTillatenForWebbKarlbyte,strAvrakningTaxekodAvdrag,decMatarStorlekKbm,bolTaxaTillatenForWebbNyTjanst,strRenhOrdertyp,strTomningsFrekvenskod,strUNNr,datSenastUppdaterad,strSummaAvserText,bolSummeraTaxedelar,strSummeraLayoutKod,bolHandelseDelas,decVolymPerAr,strEntreprenorkod,strFakturaFrekvens,bolMobileTjanstKvantitet,strHamtschemaText,strRDKod,bolAgarbytesBrevUndantag,bolTillgangligTjanst,bolAgarbyteAvslutaTjanst,decMatarstorlekQ3,bolSkapaEjRHOrder,strKartsymbol,bolFATjanst) VALUES (1782,'R190-26Å','Restavfall, 190-literskärl 26 ggr/år','VR','RENH','HUSH','Hämtställe',NULL,NULL,NULL,FALSE,'SPUT',FALSE,'K190',26,FALSE,FALSE,'Restavfall',NULL,NULL,NULL,'TÖMN','2018-05-23 16:11:31.543',275,FALSE,FALSE,NULL,NULL,FALSE,NULL,'26 ggr/år',NULL,'1/15/24 9:11',NULL,FALSE,NULL,TRUE,NULL,NULL,NULL,FALSE,NULL,NULL,FALSE,TRUE,FALSE,NULL,FALSE,'Renhallning',FALSE);
-- INSERT INTO tariff(intRecnum,strTaxekod,strTaxebenamning,strFakturagrupp,strProdukt,strDelProdukt,strLayoutkod,datUpphorddatum,datDelAvArFrom,datDelAvArTom,bolUtforDebOrdFakt,strTaxaSpecificeringstyp,bolPriserInklMoms,strBehallarestorlektypkod,intTomPerAr,bolKompost,bolSommar,strAvfallstyp,strEWCKod,decMangdPerTom,intMinimiforbrukning,strHandelsetyp,datSkapad,intSkapadAv,bolTaxaTillatenForWebbDispens,bolTaxaTillatenForWebbKarlbyte,strAvrakningTaxekodAvdrag,decMatarStorlekKbm,bolTaxaTillatenForWebbNyTjanst,strRenhOrdertyp,strTomningsFrekvenskod,strUNNr,datSenastUppdaterad,strSummaAvserText,bolSummeraTaxedelar,strSummeraLayoutKod,bolHandelseDelas,decVolymPerAr,strEntreprenorkod,strFakturaFrekvens,bolMobileTjanstKvantitet,strHamtschemaText,strRDKod,bolAgarbytesBrevUndantag,bolTillgangligTjanst,bolAgarbyteAvslutaTjanst,decMatarstorlekQ3,bolSkapaEjRHOrder,strKartsymbol,bolFATjanst) VALUES (1173,'TAGG_SAKNAS','KONTROLL OLÄST TAGG','VR','RENH','HUSH','Hämtställe',NULL,NULL,NULL,FALSE,'SPUT',FALSE,NULL,NULL,FALSE,FALSE,NULL,NULL,NULL,NULL,'DEBI','2018-09-04 15:52:06.377',213,FALSE,FALSE,NULL,NULL,FALSE,NULL,NULL,NULL,'12/21/23 15:39',NULL,FALSE,NULL,FALSE,NULL,NULL,NULL,FALSE,NULL,NULL,FALSE,FALSE,FALSE,NULL,FALSE,NULL,FALSE);
