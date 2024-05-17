const sqlPrompt = (brokenSql, sqlError) => {
  const initialPrompt = `
I have a few internal systems that I need to query for an internal customer
service bot. The bot gathers relevant information about a customer ahead of
a call. These are some examples of the tables. Please return with a joined
query that fetches most relevant information from each table for a given phone
number.

Parameter name is "strAnlNr" in the facilities table. This is the same as the
"strAnlnr" in the customer_events table. Put the value of strAnlNr in the
T-SQL query as a parameter.

Reply in a JSON structure with the T-SQL query  that fetches the relevant information. It is very
important that your response only includes the valid T-SQL, no comments or other text.
Do not create aliases for columns, MAKE THE T-SQL AS SHORT AS POSSIBLE.
Do not list unneccesary columns, only the ones needed!

The reply JSON structure should look like this, there must always be at least one parameter to replace:

IMPORTANT! Do not rename fields! They have to be exactly the same as in the examples below!

\`\`\`
{
  "sql": "SELECT ... FROM ... WHERE ... f.strAnlnr='???strAnlNr???' ...",
  "paramsToReplace": [
    { "param": "strAnlNr", "placeholder": "???strAnlNr???" }
  ]
}
\`\`\`


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
\`\`\`
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
