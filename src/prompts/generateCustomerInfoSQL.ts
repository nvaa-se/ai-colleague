const sqlPrompt = (brokenSql, sqlError) => {
  const initialPrompt = `
I have a few internal systems that I need to query for an internal customer
service bot. The bot gathers relevant information about a customer ahead of
a call. These are some examples of the tables. Please return with a joined
query that fetches most relevant information from each table for a given facility id (strAnlnr)

Parameter name is "strAnlnr" in the facilities table. This is the same as the
"strAnlnr" in the customer_events table. Put the value of strAnlnr in the
T-SQL query as a parameter.

Equally named columns should be joinable across tables.

You can check what tariffs exist by selecting strTaxekod & strTaxebenamning from tbFuTaxa

Reply in a JSON structure with the T-SQL query  that fetches the relevant information. It is very
important that your response only includes the valid T-SQL, no comments or other text.
Do not create aliases for columns, MAKE THE T-SQL AS SHORT AS POSSIBLE.
Do not list unneccesary columns, only the ones needed. Use up to 5 columns in the select statement, never more!

To return less data, consider doing count and aggregation queries, and only return the most relevant data.

The reply JSON structure should look like this:
\`\`\`
{
  "sql": "SELECT ... FROM ... WHERE ... f.strAnlnr='@strAnlnr' ...;",
}
\`\`\`

To identify a customer or facility, you only need strAnlnr as a parameter in the query, adresses, names et.c. are redundant.


IMPORTANT! Do not rename fields! They have to be exactly the same as in the examples below!

Below are the definitions of the relevant tables in the database

\`\`\`sql
CREATE TABLE tbFuHandelse (
	recHandelse int,
	intKundnr int,
	strAnlnr varchar(15),
	intTjanstnr int,
	intFakturaadress int,
	datDatumFrom datetime,
	datDatumTom datetime,
	strTaxekod varchar(15),
	strAnm varchar(50),
	strRFID varchar(20),
	strFordon varchar(15),
	strFordonkod varchar(40),
	strAvvikelsekod varchar(18),
	strObjNr varchar(20),
	strKorlistakod varchar(10),
	strUtfortAvSignatur varchar(10),
	lngFakturanr bigint,
	strFakturafrekvens varchar(10),
	bolKlarAttFakturera bit,
	strHandelseText varchar(4000),
	bolEnbartHandelseTextPaFakturan bit,
	bolFakturerasEj bit,
	strEntreprenorkod varchar(10),
	intRenhOrdernr int,
	intRenhOrderradnr int,
	intVAOrdernr int,
	curFastPrisNetto decimal(12,2),
	strEWCKod varchar(10),
	strUNNr varchar(10),
	strRDKod varchar(10),
	strAvfallstyp varchar(15),
	strEnhetKort char(3),
	datSkapad datetime,
	intSkapadAv int,
	strHandelsetyp varchar(4),
	strVagsedelNr varchar(15),
	intFakturaradnr smallint,
	datAvraknadDatum smalldatetime,
	datKrediteringGodkandDatum smalldatetime,
	strKrediteringGodkandSignatur varchar(10),
	bolKrediteringsFragaSkickad bit,
	strAvvikelseText varchar(1000),
	recHandelsefilInlasning int,
	curAprisNetto decimal(13,4),
	datLagerFort smalldatetime,
	strLagerplatskodFran varchar(10),
	strLagerplatskod varchar(10),
	strFakturagruppering varchar(50),
	intInstallationsNr int,
	bolAvraknasEj bit,
	strRenhDistriktskod varchar(10),
	intSkapadAvRecHandelse int,
	intVAOrderradnr int,
	bolAvvikelse int,
	decXkoord decimal(28,20),
	decYkoord decimal(28,20),
	strFakturerasEjOrsak varchar(60),
	strFakturerasEjOrsakText varchar(400),
	datDatum datetime,
	strFotoId varchar(36),
	datFotoHamtat datetime,
	strObjekt varchar(10),
	strProjekt varchar(10),
	strInkast varchar(100),
	strTjanstensOrderIndex varchar(50),
	CONSTRAINT PK_tbFuHandelse_recHandelse PRIMARY KEY (recHandelse)
);

-- tbFuHandelse foreign keys
ALTER TABLE tbFuHandelse ADD CONSTRAINT FK_tbFuHandelsetbFuAnlaggning_strAnlnr FOREIGN KEY (strAnlnr) REFERENCES tbFuAnlaggning(strAnlnr);
ALTER TABLE tbFuHandelse ADD CONSTRAINT FK_tbFuHandelsetbFuHandelse_intSkapadAvRecHandelserecHandelse FOREIGN KEY (intSkapadAvRecHandelse) REFERENCES tbFuHandelse(recHandelse);
ALTER TABLE tbFuHandelse ADD CONSTRAINT FK_tbFuHandelsetbFuRenhAvvikelse_strAvvikelsekod FOREIGN KEY (strAvvikelsekod) REFERENCES tbFuRenhAvvikelse(strAvvikelsekod);
ALTER TABLE tbFuHandelse ADD CONSTRAINT FK_tbFuHandelsetbFuTaxa_strTaxekod FOREIGN KEY (strTaxekod) REFERENCES tbFuTaxa(strTaxekod);

CREATE TABLE tbFuRenhAvvikelse (
	intRecnum int,
	strAvvikelsekod varchar(18),
	strAvvikelsetext varchar(200),
	bolSkallRapporteraSomHandelse bit,
	strHandelsetyp varchar(4),
	bolFakturerasEj bit,
	bolSkallSkapaOrder bit,
	bolSkallSkapaNyHandelse bit,
	strNyHandelsetyp varchar(4),
	bolNyHandelseFakturerasEj bit,
	bolSkallAterrapporteraOrder bit,
	strFakturaFrekvens varchar(10),
	strTaxekod varchar(15),
	strRenhOrdertyp varchar(20),
	datSkapad datetime,
	intSkapadAv int,
	bolSkallSkapaArende bit,
	strArendeTyp varchar(60),
	strArendeAvser varchar(60),
	bolAvraknasEj bit,
	bolUppdateraVagbeskrivning bit,
	bolUppdateraKorordning bit,
	bolMatchaKorlistanamn bit,
	bolSkrivOverVagbeskrivning bit,
	bolUppdateraKvantitet bit,
	bolUppdateraKoordinat bit,
	strDelproduktVagbeskrivning varchar(6),
	strKvantitetskod varchar(4),
	strDelproduktKvantitet varchar(6),
	bolSkickaSMS bit,
	datUpphorddatum smalldatetime,
	bolSkickaEpost bit,
	strProdukt varchar(6),
	strVAOrdertyp varchar(10),
	bolAnnulleraOrder bit,
	bolKvitteraOrder bit,
	strAutoMeddelandeEpostKod varchar(20),
	strAutoMeddelandeSmsKod varchar(20),
	bolUppdateraStoppKoordinat bit,
	allowFreeText bit,
	forceFreeText bit,
	allowDoubleAmount bit,
	forceDoubleAmount bit,
	allowImage bit,
	forceImage bit,
	bolBehallaOrder bit,
	CONSTRAINT PK_tbFuRenhAvvikelse_strAvvikelsekod PRIMARY KEY (strAvvikelsekod)
);

-- tbFuRenhAvvikelse foreign keys
ALTER TABLE tbFuRenhAvvikelse ADD CONSTRAINT FK_tbFuRenhAvvikelsetbFuHandelsetyp_strHandelsetyp FOREIGN KEY (strHandelsetyp) REFERENCES tbFuHandelsetyp(strHandelsetyp);
ALTER TABLE tbFuRenhAvvikelse ADD CONSTRAINT FK_tbFuRenhAvvikelsetbFuHandelsetyp_strNyHandelsetypstrHandelsetyp FOREIGN KEY (strNyHandelsetyp) REFERENCES tbFuHandelsetyp(strHandelsetyp);
ALTER TABLE tbFuRenhAvvikelse ADD CONSTRAINT FK_tbFuRenhAvvikelsetbFuTaxa_strTaxekod FOREIGN KEY (strTaxekod) REFERENCES tbFuTaxa(strTaxekod);

CREATE TABLE tbFuTaxa (
	intRecnum int,
	strTaxekod varchar(15),
	strTaxebenamning varchar(120),
	strFakturagrupp varchar(6),
	strProdukt varchar(6),
	strDelProdukt varchar(6),
	strLayoutkod varchar(200),
	datUpphorddatum smalldatetime,
	datDelAvArFrom smalldatetime,
	datDelAvArTom smalldatetime,
	bolUtforDebOrdFakt bit,
	strTaxaSpecificeringstyp char(4),
	bolPriserInklMoms bit,
	strBehallarestorlektypkod varchar(10),
	intTomPerAr int,
	bolKompost bit,
	bolSommar bit,
	strAvfallstyp varchar(15),
	strEWCKod varchar(10),
	decMangdPerTom decimal(11,4),
	intMinimiforbrukning int,
	strHandelsetyp varchar(4),
	datSkapad datetime,
	intSkapadAv int,
	bolTaxaTillatenForWebbDispens bit,
	bolTaxaTillatenForWebbKarlbyte bit,
	strAvrakningTaxekodAvdrag varchar(10),
	decMatarStorlekKbm decimal(11,4),
	bolTaxaTillatenForWebbNyTjanst bit,
	strRenhOrdertyp varchar(20),
	strTomningsFrekvenskod varchar(50),
	strUNNr varchar(10),
	datSenastUppdaterad smalldatetime,
	strSummaAvserText varchar(60),
	bolSummeraTaxedelar bit,
	strSummeraLayoutKod varchar(200),
	bolHandelseDelas bit,
	decVolymPerAr decimal(11,4),
	strEntreprenorkod varchar(10),
	strFakturaFrekvens varchar(10),
	bolMobileTjanstKvantitet bit,
	strHamtschemaText varchar(120),
	strRDKod varchar(10),
	bolAgarbytesBrevUndantag bit,
	bolTillgangligTjanst bit,
	bolAgarbyteAvslutaTjanst bit,
	decMatarstorlekQ3 decimal(11,4),
	bolSkapaEjRHOrder bit,
	strKartsymbol varchar(100),
	bolFATjanst bit,
	CONSTRAINT PKtbFuTaxa PRIMARY KEY (strTaxekod)
);

-- tbFuTaxa foreign keys
ALTER TABLE tbFuTaxa ADD CONSTRAINT FK_tbFuTaxatbFuHandelsetyp_strHandelsetyp FOREIGN KEY (strHandelsetyp) REFERENCES tbFuHandelsetyp(strHandelsetyp);
ALTER TABLE tbFuTaxa ADD CONSTRAINT FKtbFuTaxatbFuRenhEWCkod FOREIGN KEY (strEWCKod) REFERENCES tbFuRenhEWCKod(strEWCKod);

CREATE TABLE tbFuAnlaggning (
	intRecnum int,
	strAnlnr varchar(15),
	intKundnr int,
	strAnlAdressgata varchar(40),
	intAnlAdressnr int,
	strAnlAdressbokstav varchar(20),
	strPostnr varchar(8),
	strAnlOrt varchar(40),
	strFastbeteckningTrakt varchar(40),
	strFastbeteckningBlock varchar(4),
	strFastbeteckningTecken varchar(1),
	intFastbeteckningEnhet int,
	strFastnyckel varchar(20),
	strAnlaggningsKategori varchar(6),
	intFakturaadress int,
	bolSeparatFaktura bit,
	intAgarekundnr int,
	bolInterndebiteras bit,
	strMotpartKoncernkod varchar(10),
	decAnlXkoordinat decimal(28,20),
	decAnlYkoordinat decimal(28,20),
	strFakturaFrekvens varchar(10),
	intAvlasningskortsadress int,
	bolInternmoms bit,
	strFakturaKundReferens varchar(60),
	intTotalArsforbrukning int,
	datSkapad datetime,
	intSkapadAv int,
	decTotalArsforbrukning decimal(11,4),
	strAnlReferens varchar(80),
	strFakturagrupp varchar(6),
	strFakturaSortering varchar(2),
	intSpecialAdressKontakt int,
	strKommunkod varchar(10),
	intUtskickadress int,
	strExtraAnlaggning1 varchar(100),
	strExtraAnlaggning2 varchar(100),
	datBrevutskick datetime,
	strArendeAnteckning varchar(100),
	strAvvikandeDebiterasMoms varchar(1),
	bolAnlAdrSomUtskicksAdr bit,
	strNyckelnr varchar(15),
	strPortkod varchar(10),
	datUpphorddatum smalldatetime,
	strPopularNamn varchar(80),
	strFastighetsUuid varchar(36),
	strProduktLista varchar(100),
	intCFAR int,
	bolOmbudAnteckning1 bit,
	intTypkod int,
	bolFAKommun bit,
	CONSTRAINT PKtbFuAnlaggning PRIMARY KEY (strAnlnr)
);

CREATE TABLE tbFuFaktura (
	intRecnum int IDENTITY(1,1),
	lngFakturanr bigint,
	intKundnr int,
	intSpecialAdressnr int,
	strSeparatAnlnr varchar(15)
	strForstaAnlnr varchar(15)
	strFakturaEfternamn1 varchar(40)
	strFakturaFornamn1 varchar(40)
	strFakturaEfternamn2 varchar(40)
	strFakturaFornamn2 varchar(40)
	strFakturaAdressGata varchar(40)
	intFakturaAdressnr int,
	strFakturaAdressbokstav varchar(20)
	strPostnr varchar(8)
	strOrt varchar(60)
	strLandkod char(2)
	strDistributionssatt char(4)
	strFakturasortering varchar(2)
	strBetalningssatt char(4)
	strBetalstatus char(4)
	strKravstatus char(4)
	strAvskrivningsstatus char(4)
	bolReglerad bit,
	bytFakturaex tinyint,
	curBruttobelopp decimal(12,2),
	curNettobelopp decimal(12,2),
	decOresavrundning decimal(9,2),
	curRenhbelopp decimal(12,2),
	curKvarAttBetala decimal(12,2),
	datFakturadatum smalldatetime,
	datForfallodatum smalldatetime,
	datAnstandTom smalldatetime,
	datPaminnelsedatum smalldatetime,
	datInkassodatum smalldatetime,
	datAvstangningsdatum smalldatetime,
	datBetalningsforelaggandedatum smalldatetime,
	datLangtidsbevakningsdatum smalldatetime,
	datUtskriven smalldatetime,
	datBokforingsdatum smalldatetime,
	datSenKravBetDatum smalldatetime,
	bolInternfaktura bit,
	bolFlyttfaktura bit,
	bolFrifaktura bit,
	bolRantefaktura bit,
	bolOrdinariefaktura bit,
	bolForseningsAvgiftFaktura bit,
	curPaminnelseavgift decimal(12,2),
	strAnteckning varchar(1000),
	strKundtext varchar(1000),
	datAvstangningshotdatum smalldatetime,
	datOppningsdatum smalldatetime,
	bolAtgardstackningsaknas bit,
	strFakturaKundReferens varchar(60),
	curMoms decimal(12,2),
	strFakturaVarReferens varchar(100),
	datAutogirofildatum smalldatetime,
	datAutogirofildatumAnnullerad smalldatetime,
	datExternreskontradatum smalldatetime,
	datExternreskontradatumAnnullerad smalldatetime,
	datReskontraSkapaddatum smalldatetime,
	strFakturagrupp varchar(6),
	strOCRnr varchar(20),
	datEfakturafildatum smalldatetime,
	bolStoppaUtskrift bit,
	strBetalningsforelaggandeAvser varchar(30),
	datSkapad datetime,
	intSkapadAv int,
	strValutakod char(3),
	bolArkiverad bit,
	strVarReferensKod varchar(10),
	curPaminnelseavgiftAvskriven decimal(12,2),
	curPaminnelseavgiftOverford decimal(12,2),
	bolPaminnelseavgiftPaPaminnelse bit,
	strBilagor varchar(50),
	datFlyttDatum smalldatetime,
	strFakturagruppering varchar(50),
	bolEjArkiveradIEDPArkiv bit,
	datFakturaAndelSkapaddatum smalldatetime,
	bolSidbrytPerAnlaggning bit,
	strKravText varchar(200),
	bolTvingaUtInkasso bit,
	strArendenrUtslagsnr varchar(30),
	bolAnnulleradMedNyFaktura bit,
	lngSkapadAvAnnulleradFakturanr bigint,
	strUrsprung varchar(20),
	strRegistratorLoginID varchar(10),
	strFakturaExtra1 varchar(100),
	strFakturaExtra2 varchar(100),
	strFakturaExtra3 varchar(100),
	strFakturaExtra4 varchar(100),
	strMomsregnr varchar(14),
);


\`\`\`

Here are som examples of validated SQL Queries:

Question 1:
Vilken faktura avser slamtömningen den 28/7 2023?
Query 1:
SELECT H.lngFakturanr
FROM tbFuHandelse H
WHERE strAnlnr='4212108221'
AND strHandelsetyp='MTÖM'
AND strAvfallstyp='SLAM'
AND datDatum='2023-07-28';

Question 2:
‌Vad har fakturan för status, och när skickades den?
Query 2:
SELECT F.strBetalstatus,F.datUtskriven
FROM tbfuFaktura F
WHERE lngFakturanr= (SELECT H.lngFakturanr
FROM tbFuHandelse H
WHERE strAnlnr='4212108221'
AND strHandelsetyp='MTÖM'
AND strAvfallstyp='SLAM'
AND datDatum='2023-07-28');

Question 3:
Har kunden några obetalda fakturor?
Query: 3
SELECT lngFakturanr
FROM vwFaktura
WHERE intKundnr = (SELECT intKundnr FROM tbFuAnlaggning WHERE strAnlnr='4212108221')
AND strBetalstatus='OBET';

Question 4:
Hur ser tömningshistoriken ut på fastigheten?
Query 4:
SELECT datDatumFrom,strHandelsetyp,strTaxebenamning,strAvvikelseText,strHandelseText,AnlAdress
FROM vwHandelse
WHERE strAnlnr='2034052452';

Question 5:
Jag vill också ha med fastighetsbeteckningen i listan.
Query 5:
SELECT datDatumFrom,strHandelsetyp,strTaxebenamning,strAvvikelseText,strHandelseText,AnlAdress,strFastighetsBeteckning
FROM vwHandelse H
JOIN vwKomplettFastighetsBeteckning KF ON KF.strAnlnr=H.strAnlnr
WHERE H.strAnlnr='2034052452';

Question 6:
Okej, men jag vill bara se slam-historik
Query 6:
SELECT datDatumFrom,H.strHandelsetyp,H.strTaxebenamning,strAvvikelseText,strHandelseText,AnlAdress,strFastighetsBeteckning
FROM vwHandelse H
JOIN vwKomplettFastighetsBeteckning KF ON KF.strAnlnr=H.strAnlnr
JOIN tbFuTaxa TA ON TA.strTaxekod=H.strTaxekod AND TA.strDelProdukt='SLAM'
WHERE H.strAnlnr='2034052452';

Question 7:
Och bara soporna?
Query 7:
SELECT datDatumFrom,TA.strDelProdukt,H.strHandelsetyp,H.strTaxebenamning,strAvvikelseText,strHandelseText,AnlAdress,strFastighetsBeteckning
FROM vwHandelse H
JOIN vwKomplettFastighetsBeteckning KF ON KF.strAnlnr=H.strAnlnr
JOIN tbFuTaxa TA ON TA.strTaxekod=H.strTaxekod AND TA.strDelProdukt in ('HUSH','MAT')
WHERE H.strAnlnr='2034052452';

Tables and Fields
tbFuHandelse
This table seems to record events or transactions related to facilities. Key fields include:

recHandelse (int): Primary key, unique identifier for each event.
intKundnr (int): Customer number, linking the event to a customer.
strAnlnr (varchar): Facility number, linking the event to a facility.
intTjanstnr (int): Service number, indicating the type of service.
datDatumFrom and datDatumTom (datetime): Start and end dates of the event.
strTaxekod (varchar): Tariff code, linking to the tariff table.
lngFakturanr (bigint): Invoice number, linking the event to an invoice.
Various other fields related to the event details, such as strRFID, strFordon, strAvvikelsekod, and strHandelseText.
tbFuRenhAvvikelse
This table records deviations or issues related to events.

intRecnum (int): Primary key, unique identifier for each deviation.
strAvvikelsekod (varchar): Deviation code, primary key.
strAvvikelsetext (varchar): Text describing the deviation.
Various boolean fields indicating different statuses and actions related to the deviation.
tbFuTaxa
This table contains tariff or pricing information.

intRecnum (int): Primary key, unique identifier for each tariff.
strTaxekod (varchar): Tariff code, primary key.
strTaxebenamning (varchar): Tariff name.
Various fields related to pricing, grouping, and applicability of the tariff.
tbFuAnlaggning
This table contains information about facilities.

intRecnum (int): Primary key, unique identifier for each facility.
strAnlnr (varchar): Facility number, primary key.
intKundnr (int): Customer number, linking the facility to a customer.
Various fields related to the address, categorization, and additional details of the facility.
Relationships
tbFuHandelse references tbFuAnlaggning through strAnlnr.
tbFuHandelse references tbFuTaxa through strTaxekod.
tbFuHandelse references tbFuRenhAvvikelse through strAvvikelsekod.
Key Insights
Facility Management: The tbFuAnlaggning table holds details about each facility, which are linked to events in tbFuHandelse.
Event Tracking: The tbFuHandelse table is central to tracking all events, services, and transactions for each facility.
Deviations Handling: The tbFuRenhAvvikelse table helps manage and document any issues or deviations related to events.
Tariff Management: The tbFuTaxa table provides detailed tariff information, crucial for billing and pricing.

Database Structure Analysis for tbFuTaxa

The tbFuTaxa table in the provided database contains the following fields:

strTaxekod:
Description: This field likely represents the unique code or identifier for each tax type or service fee.
Data Type: String
Purpose: It serves as the primary key or unique identifier for each record in the table. It helps in distinguishing different types of taxes or service fees.
strTaxebenamning:
Description: This field describes the name or the details of the tax or service fee.
Data Type: String
Purpose: It provides a descriptive name for each tax type or service fee, allowing users to understand the nature of the fee or tax.
Insights and Observations:

Diversity of Tax Codes:

The table contains a wide range of tax codes (e.g., 0001, 0002, 1101, 1201, 240K104), suggesting it covers various tax types and service fees related to different aspects such as water (e.g., VA, V), waste (e.g., RESTAVFALL, KÄRL), and administrative fees.
Naming Conventions:

The strTaxekod uses a combination of letters and numbers which appear to follow specific conventions. For example:
VA likely stands for water-related services.
V might refer to specific types of water charges.
K and S in the middle or end could indicate different types of containers or services (e.g., KÄRL for bins or containers, SÄCK for bags).
Service Frequency:

The tax descriptions often include numbers that seem to indicate the frequency of the service (e.g., 13 ggr/år, 52 ggr/år which translate to 13 times a year, 52 times a year). This provides insights into how often these services are billed or provided.
Specific Services:

Some codes are very specific, detailing particular services or scenarios (e.g., Slamtömning for sludge emptying, Sprinkleranläggning for sprinkler systems, Matavfall for food waste collection). This suggests the database is used for managing a detailed and comprehensive range of municipal services.
Administrative and Miscellaneous Charges:

There are entries for administrative tasks and other charges (e.g., ADMAVG for administrative fees, DRÖJRÄNTA for penalty interest). This indicates the table also includes financial penalties and additional service-related fees.
Comprehensive Coverage:

The table appears to comprehensively cover various aspects of municipal services including water supply, sewage, waste management, and administrative processes.
Use Cases:

Billing and Invoicing:

The table can be used to generate bills and invoices for residents and businesses based on the services they use.
Service Management:

It helps in managing different municipal services, scheduling collections, and ensuring all provided services are documented and billed correctly.
Reporting and Analysis:

The table allows for detailed reporting and analysis of tax revenues, service usage, and operational efficiency of municipal services.
Suggestions for Improvement:

Normalization:

If the database grows, consider normalizing the tables to reduce redundancy. For example, separate tables for service types, frequencies, and container types might help in managing the data more efficiently.
Additional Fields:

Adding fields such as effective_date and expiration_date for each tax code could help manage changes over time more effectively.
Data Validation:

Implement data validation rules to ensure the consistency and accuracy of the codes and descriptions.
By understanding the structure and content of the tbFuTaxa table, one can better manage and utilize the database for municipal services and financial management.
`
  if (brokenSql && sqlError) {
    return `
      ${initialPrompt}
      \`\`\`
      ${brokenSql}
      \`\`\`

      The above was generated with the follwing error message: "${sqlError}".

      Please fix the SQL query based on the error above!
    `
  } else {
    return initialPrompt
  }
}

export default sqlPrompt
