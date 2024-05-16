const prompt = `
I have a few internal systems that I need to query for an internal customer
service bot. The bot gathers relevant information about a customer ahead of
a call. These are some examples of the tables. Please return with a joined
query that fetches most relevant information from each table for a given phone
number.

Parameter name is "strAnlNr" in the facilities table. This is the same as the
"strAnlnr" in the customer_events table. Put the value of strAnlNr in the
SQL query as a parameter.

The Database Server is running Microsoft SQL Server 2024.
SORT DATA AS LATEST FIRST unless the user asks otherwise
MAKE SURE THE RESPONSE IS VALID SQL!

Only filter tbFuHandlese by "strAnlNr", as strAnlNr is the only indexed column. Never filter by date, sort the data by date and return the latest X rows.

Here are the definitions for the tables in the sql database:

\`\`\`sql
CREATE TABLE tbFuHandelse (
	recHandelse int NOT NULL,
	intKundnr int NOT NULL,
	strAnlnr varchar(15) NULL,
	intTjanstnr int NULL,
	intFakturaadress int NULL,
	datDatumFrom datetime NOT NULL,
	datDatumTom datetime NULL,
	strTaxekod varchar(15) NULL,
	strAnm varchar(50) NULL,
	strRFID varchar(20) NULL,
	strFordon varchar(15) NULL,
	strFordonkod varchar(40) NULL,
	strAvvikelsekod varchar(18) NULL,
	strObjNr varchar(20) NULL,
	strKorlistakod varchar(10) NULL,
	strUtfortAvSignatur varchar(10) NULL,
	lngFakturanr bigint NULL,
	strFakturafrekvens varchar(10) NULL,
	bolKlarAttFakturera bit NOT NULL,
	strHandelseText varchar(4000) NULL,
	bolEnbartHandelseTextPaFakturan bit NULL,
	bolFakturerasEj bit NOT NULL,
	strEntreprenorkod varchar(10) NULL,
	intRenhOrdernr int NULL,
	intRenhOrderradnr int NULL,
	intVAOrdernr int NULL,
	curFastPrisNetto decimal(12,2) NULL,
	strEWCKod varchar(10) NULL,
	strUNNr varchar(10) NULL,
	strRDKod varchar(10) NULL,
	strAvfallstyp varchar(15) NULL,
	strEnhetKort char(3) NULL,
	datSkapad datetime NOT NULL,
	intSkapadAv int NOT NULL,
	strHandelsetyp varchar(4) NULL,
	strVagsedelNr varchar(15) NULL,
	intFakturaradnr smallint NULL,
	datAvraknadDatum smalldatetime NULL,
	datKrediteringGodkandDatum smalldatetime NULL,
	strKrediteringGodkandSignatur varchar(10) NULL,
	bolKrediteringsFragaSkickad bit NULL,
	strAvvikelseText varchar(1000) NULL,
	recHandelsefilInlasning int NULL,
	curAprisNetto decimal(13,4) NULL,
	datLagerFort smalldatetime NULL,
	strLagerplatskodFran varchar(10) NULL,
	strLagerplatskod varchar(10) NULL,
	strFakturagruppering varchar(50) NULL,
	intInstallationsNr int NULL,
	bolAvraknasEj bit NOT NULL,
	strRenhDistriktskod varchar(10) NULL,
	intSkapadAvRecHandelse int NULL,
	intVAOrderradnr int NULL,
	bolAvvikelse int NOT NULL,
	decXkoord decimal(28,20) NULL,
	decYkoord decimal(28,20) NULL,
	strFakturerasEjOrsak varchar(60) NULL,
	strFakturerasEjOrsakText varchar(400) NULL,
	datDatum datetime NULL,
	strFotoId varchar(36) NULL,
	datFotoHamtat datetime NULL,
	strObjekt varchar(10) NULL,
	strProjekt varchar(10) NULL,
	strInkast varchar(100) NULL,
	strTjanstensOrderIndex varchar(50) NULL,
	CONSTRAINT PK_tbFuHandelse_recHandelse PRIMARY KEY (recHandelse)
);

-- tbFuHandelse foreign keys
ALTER TABLE tbFuHandelse ADD CONSTRAINT FK_tbFuHandelsetbFuAnlaggning_strAnlnr FOREIGN KEY (strAnlnr) REFERENCES tbFuAnlaggning(strAnlnr);
ALTER TABLE tbFuHandelse ADD CONSTRAINT FK_tbFuHandelsetbFuHandelse_intSkapadAvRecHandelserecHandelse FOREIGN KEY (intSkapadAvRecHandelse) REFERENCES tbFuHandelse(recHandelse);
ALTER TABLE tbFuHandelse ADD CONSTRAINT FK_tbFuHandelsetbFuKund_intKundnr FOREIGN KEY (intKundnr) REFERENCES tbFuKund(intKundnr);
ALTER TABLE tbFuHandelse ADD CONSTRAINT FK_tbFuHandelsetbFuRenhAvvikelse_strAvvikelsekod FOREIGN KEY (strAvvikelsekod) REFERENCES tbFuRenhAvvikelse(strAvvikelsekod);
ALTER TABLE tbFuHandelse ADD CONSTRAINT FK_tbFuHandelsetbFuTaxa_strTaxekod FOREIGN KEY (strTaxekod) REFERENCES tbFuTaxa(strTaxekod);
\`\`\`

\`\`\`sql
CREATE TABLE tbFuRenhAvvikelse (
	intRecnum int NOT NULL,
	strAvvikelsekod varchar(18) COLLATE Finnish_Swedish_CI_AS NOT NULL,
	strAvvikelsetext varchar(200) COLLATE Finnish_Swedish_CI_AS NULL,
	bolSkallRapporteraSomHandelse bit NOT NULL,
	strHandelsetyp varchar(4) COLLATE Finnish_Swedish_CI_AS NULL,
	bolFakturerasEj bit NOT NULL,
	bolSkallSkapaOrder bit NOT NULL,
	bolSkallSkapaNyHandelse bit NOT NULL,
	strNyHandelsetyp varchar(4) COLLATE Finnish_Swedish_CI_AS NULL,
	bolNyHandelseFakturerasEj bit NOT NULL,
	bolSkallAterrapporteraOrder bit NOT NULL,
	strFakturaFrekvens varchar(10) COLLATE Finnish_Swedish_CI_AS NULL,
	strTaxekod varchar(15) COLLATE Finnish_Swedish_CI_AS NULL,
	strRenhOrdertyp varchar(20) COLLATE Finnish_Swedish_CI_AS NULL,
	datSkapad datetime NOT NULL,
	intSkapadAv int NOT NULL,
	bolSkallSkapaArende bit NOT NULL,
	strArendeTyp varchar(60) COLLATE Finnish_Swedish_CI_AS NULL,
	strArendeAvser varchar(60) COLLATE Finnish_Swedish_CI_AS NULL,
	bolAvraknasEj bit NOT NULL,
	bolUppdateraVagbeskrivning bit NOT NULL,
	bolUppdateraKorordning bit NOT NULL,
	bolMatchaKorlistanamn bit NOT NULL,
	bolSkrivOverVagbeskrivning bit NOT NULL,
	bolUppdateraKvantitet bit NOT NULL,
	bolUppdateraKoordinat bit NOT NULL,
	strDelproduktVagbeskrivning varchar(6) COLLATE Finnish_Swedish_CI_AS NULL,
	strKvantitetskod varchar(4) COLLATE Finnish_Swedish_CI_AS NULL,
	strDelproduktKvantitet varchar(6) COLLATE Finnish_Swedish_CI_AS NULL,
	bolSkickaSMS bit NOT NULL,
	datUpphorddatum smalldatetime NULL,
	bolSkickaEpost bit NOT NULL,
	strProdukt varchar(6) COLLATE Finnish_Swedish_CI_AS NULL,
	strVAOrdertyp varchar(10) COLLATE Finnish_Swedish_CI_AS NULL,
	bolAnnulleraOrder bit NOT NULL,
	bolKvitteraOrder bit NOT NULL,
	strAutoMeddelandeEpostKod varchar(20) COLLATE Finnish_Swedish_CI_AS NULL,
	strAutoMeddelandeSmsKod varchar(20) COLLATE Finnish_Swedish_CI_AS NULL,
	bolUppdateraStoppKoordinat bit NOT NULL,
	allowFreeText bit NOT NULL,
	forceFreeText bit NOT NULL,
	allowDoubleAmount bit NOT NULL,
	forceDoubleAmount bit NOT NULL,
	allowImage bit NOT NULL,
	forceImage bit NOT NULL,
	bolBehallaOrder bit NOT NULL,
	CONSTRAINT PK_tbFuRenhAvvikelse_strAvvikelsekod PRIMARY KEY (strAvvikelsekod)
);


-- tbFuRenhAvvikelse foreign keys
ALTER TABLE tbFuRenhAvvikelse ADD CONSTRAINT FK_tbFuRenhAvvikelsetbFuHandelsetyp_strHandelsetyp FOREIGN KEY (strHandelsetyp) REFERENCES tbFuHandelsetyp(strHandelsetyp);
ALTER TABLE tbFuRenhAvvikelse ADD CONSTRAINT FK_tbFuRenhAvvikelsetbFuHandelsetyp_strNyHandelsetypstrHandelsetyp FOREIGN KEY (strNyHandelsetyp) REFERENCES tbFuHandelsetyp(strHandelsetyp);
ALTER TABLE tbFuRenhAvvikelse ADD CONSTRAINT FK_tbFuRenhAvvikelsetbFuTaxa_strTaxekod FOREIGN KEY (strTaxekod) REFERENCES tbFuTaxa(strTaxekod);
\`\`\`

\`\`\`sql
-- EDPFutureNorrtaljeTest.dbo.tbFuTaxa definition

-- Drop table

-- DROP TABLE EDPFutureNorrtaljeTest.dbo.tbFuTaxa;

CREATE TABLE tbFuTaxa (
	intRecnum int NOT NULL,
	strTaxekod varchar(15) COLLATE Finnish_Swedish_CI_AS NOT NULL,
	strTaxebenamning varchar(120) COLLATE Finnish_Swedish_CI_AS NOT NULL,
	strFakturagrupp varchar(6) COLLATE Finnish_Swedish_CI_AS NULL,
	strProdukt varchar(6) COLLATE Finnish_Swedish_CI_AS NULL,
	strDelProdukt varchar(6) COLLATE Finnish_Swedish_CI_AS NULL,
	strLayoutkod varchar(200) COLLATE Finnish_Swedish_CI_AS NULL,
	datUpphorddatum smalldatetime NULL,
	datDelAvArFrom smalldatetime NULL,
	datDelAvArTom smalldatetime NULL,
	bolUtforDebOrdFakt bit NOT NULL,
	strTaxaSpecificeringstyp char(4) COLLATE Finnish_Swedish_CI_AS NULL,
	bolPriserInklMoms bit NOT NULL,
	strBehallarestorlektypkod varchar(10) COLLATE Finnish_Swedish_CI_AS NULL,
	intTomPerAr int NULL,
	bolKompost bit NOT NULL,
	bolSommar bit NOT NULL,
	strAvfallstyp varchar(15) COLLATE Finnish_Swedish_CI_AS NULL,
	strEWCKod varchar(10) COLLATE Finnish_Swedish_CI_AS NULL,
	decMangdPerTom decimal(11,4) NULL,
	intMinimiforbrukning int NULL,
	strHandelsetyp varchar(4) COLLATE Finnish_Swedish_CI_AS NULL,
	datSkapad datetime NOT NULL,
	intSkapadAv int NOT NULL,
	bolTaxaTillatenForWebbDispens bit NOT NULL,
	bolTaxaTillatenForWebbKarlbyte bit NOT NULL,
	strAvrakningTaxekodAvdrag varchar(10) COLLATE Finnish_Swedish_CI_AS NULL,
	decMatarStorlekKbm decimal(11,4) NULL,
	bolTaxaTillatenForWebbNyTjanst bit NOT NULL,
	strRenhOrdertyp varchar(20) COLLATE Finnish_Swedish_CI_AS NULL,
	strTomningsFrekvenskod varchar(50) COLLATE Finnish_Swedish_CI_AS NULL,
	strUNNr varchar(10) COLLATE Finnish_Swedish_CI_AS NULL,
	datSenastUppdaterad smalldatetime NULL,
	strSummaAvserText varchar(60) COLLATE Finnish_Swedish_CI_AS NULL,
	bolSummeraTaxedelar bit NOT NULL,
	strSummeraLayoutKod varchar(200) COLLATE Finnish_Swedish_CI_AS NULL,
	bolHandelseDelas bit NOT NULL,
	decVolymPerAr decimal(11,4) NULL,
	strEntreprenorkod varchar(10) COLLATE Finnish_Swedish_CI_AS NULL,
	strFakturaFrekvens varchar(10) COLLATE Finnish_Swedish_CI_AS NULL,
	bolMobileTjanstKvantitet bit NOT NULL,
	strHamtschemaText varchar(120) COLLATE Finnish_Swedish_CI_AS NULL,
	strRDKod varchar(10) COLLATE Finnish_Swedish_CI_AS NULL,
	bolAgarbytesBrevUndantag bit NOT NULL,
	bolTillgangligTjanst bit NOT NULL,
	bolAgarbyteAvslutaTjanst bit NOT NULL,
	decMatarstorlekQ3 decimal(11,4) NULL,
	bolSkapaEjRHOrder bit NOT NULL,
	strKartsymbol varchar(100) COLLATE Finnish_Swedish_CI_AS NULL,
	bolFATjanst bit NOT NULL,
	CONSTRAINT PKtbFuTaxa PRIMARY KEY (strTaxekod)
);


-- tbFuTaxa foreign keys
ALTER TABLE tbFuTaxa ADD CONSTRAINT FK_tbFuTaxatbFuHandelsetyp_strHandelsetyp FOREIGN KEY (strHandelsetyp) REFERENCES tbFuHandelsetyp(strHandelsetyp);
ALTER TABLE tbFuTaxa ADD CONSTRAINT FKtbFuTaxatbFuRenhEWCkod FOREIGN KEY (strEWCKod) REFERENCES tbFuRenhEWCKod(strEWCKod);
\`\`\`

\`\`\`sql
CREATE TABLE tbFuAnlaggning (
	intRecnum int NOT NULL,
	strAnlnr varchar(15) COLLATE Finnish_Swedish_CI_AS NOT NULL,
	intKundnr int NOT NULL,
	strAnlAdressgata varchar(40) COLLATE Finnish_Swedish_CI_AS NULL,
	intAnlAdressnr int NULL,
	strAnlAdressbokstav varchar(20) COLLATE Finnish_Swedish_CI_AS NULL,
	strPostnr varchar(8) COLLATE Finnish_Swedish_CI_AS NULL,
	strAnlOrt varchar(40) COLLATE Finnish_Swedish_CI_AS NULL,
	strFastbeteckningTrakt varchar(40) COLLATE Finnish_Swedish_CI_AS NULL,
	strFastbeteckningBlock varchar(4) COLLATE Finnish_Swedish_CI_AS NULL,
	strFastbeteckningTecken varchar(1) COLLATE Finnish_Swedish_CI_AS NULL,
	intFastbeteckningEnhet int NULL,
	strFastnyckel varchar(20) COLLATE Finnish_Swedish_CI_AS NULL,
	strAnlaggningsKategori varchar(6) COLLATE Finnish_Swedish_CI_AS NULL,
	intFakturaadress int NULL,
	bolSeparatFaktura bit NOT NULL,
	intAgarekundnr int NULL,
	bolInterndebiteras bit NOT NULL,
	strMotpartKoncernkod varchar(10) COLLATE Finnish_Swedish_CI_AS NULL,
	decAnlXkoordinat decimal(28,20) NULL,
	decAnlYkoordinat decimal(28,20) NULL,
	strFakturaFrekvens varchar(10) COLLATE Finnish_Swedish_CI_AS NULL,
	intAvlasningskortsadress int NULL,
	bolInternmoms bit NOT NULL,
	strFakturaKundReferens varchar(60) COLLATE Finnish_Swedish_CI_AS NULL,
	intTotalArsforbrukning int NULL,
	datSkapad datetime NOT NULL,
	intSkapadAv int NOT NULL,
	decTotalArsforbrukning decimal(11,4) NULL,
	strAnlReferens varchar(80) COLLATE Finnish_Swedish_CI_AS NULL,
	strFakturagrupp varchar(6) COLLATE Finnish_Swedish_CI_AS NULL,
	strFakturaSortering varchar(2) COLLATE Finnish_Swedish_CI_AS NULL,
	intSpecialAdressKontakt int NULL,
	strKommunkod varchar(10) COLLATE Finnish_Swedish_CI_AS NULL,
	intUtskickadress int NULL,
	strExtraAnlaggning1 varchar(100) COLLATE Finnish_Swedish_CI_AS NULL,
	strExtraAnlaggning2 varchar(100) COLLATE Finnish_Swedish_CI_AS NULL,
	datBrevutskick datetime NULL,
	strArendeAnteckning varchar(100) COLLATE Finnish_Swedish_CI_AS NULL,
	strAvvikandeDebiterasMoms varchar(1) COLLATE Finnish_Swedish_CI_AS NULL,
	bolAnlAdrSomUtskicksAdr bit NOT NULL,
	strNyckelnr varchar(15) COLLATE Finnish_Swedish_CI_AS NULL,
	strPortkod varchar(10) COLLATE Finnish_Swedish_CI_AS NULL,
	datUpphorddatum smalldatetime NULL,
	strPopularNamn varchar(80) COLLATE Finnish_Swedish_CI_AS NULL,
	strFastighetsUuid varchar(36) COLLATE Finnish_Swedish_CI_AS NULL,
	strProduktLista varchar(100) COLLATE Finnish_Swedish_CI_AS NULL,
	intCFAR int NULL,
	bolOmbudAnteckning1 bit NOT NULL,
	intTypkod int NULL,
	bolFAKommun bit NOT NULL,
	CONSTRAINT PKtbFuAnlaggning PRIMARY KEY (strAnlnr)
);
\`\`\`

`

export default prompt
