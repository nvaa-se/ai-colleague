
export type AnomaliesModel = {
  intRecnum: number
  strAvvikelsekod: string
  strAvvikelsetext: string
  bolSkallRapporteraSomHandelse: boolean
  strHandelsetyp: string
  bolFakturerasEj: boolean
  bolSkallSkapaOrder: boolean
  bolSkallSkapaNyHandelse: boolean
  strNyHandelsetyp: string
  bolNyHandelseFakturerasEj: boolean
  bolSkallAterrapporteraOrder: boolean
  strFakturaFrekvens: string
  strTaxekod: string
  strRenhOrdertyp: string
  datSkapad: Date
  intSkapadAv: number
  bolSkallSkapaArende: boolean
  strArendeTyp: string
  strArendeAvser: string
  bolAvraknasEj: boolean
  bolUppdateraVagbeskrivning: boolean
  bolUppdateraKorordning: boolean
  bolMatchaKorlistanamn: boolean
  bolSkrivOverVagbeskrivning: boolean
  bolUppdateraKvantitet: boolean
  bolUppdateraKoordinat: boolean
  strDelproduktVagbeskrivning: string
  strKvantitetskod: string
  strDelproduktKvantitet: string
  bolSkickaSMS: boolean
  datUpphorddatum: Date
  bolSkickaEpost: boolean
  strProdukt: string
  strVAOrdertyp: string
  bolAnnulleraOrder: boolean
  bolKvitteraOrder: boolean
  strAutoMeddelandeEpostKod: string
  strAutoMeddelandeSmsKod: string
  bolUppdateraStoppKoordinat: boolean
  allowFreeText: boolean
  forceFreeText: boolean
  allowDoubleAmount: boolean
  forceDoubleAmount: boolean
  allowImage: boolean
  forceImage: boolean
  bolBehallaOrder: boolean
}
export const AnomaliesFields = [
  "intRecnum",
  "strAvvikelsekod",
  "strAvvikelsetext",
  "bolSkallRapporteraSomHandelse",
  "strHandelsetyp",
  "bolFakturerasEj",
  "bolSkallSkapaOrder",
  "bolSkallSkapaNyHandelse",
  "strNyHandelsetyp",
  "bolNyHandelseFakturerasEj",
  "bolSkallAterrapporteraOrder",
  "strFakturaFrekvens",
  "strTaxekod",
  "strRenhOrdertyp",
  "datSkapad",
  "intSkapadAv",
  "bolSkallSkapaArende",
  "strArendeTyp",
  "strArendeAvser",
  "bolAvraknasEj",
  "bolUppdateraVagbeskrivning",
  "bolUppdateraKorordning",
  "bolMatchaKorlistanamn",
  "bolSkrivOverVagbeskrivning",
  "bolUppdateraKvantitet",
  "bolUppdateraKoordinat",
  "strDelproduktVagbeskrivning",
  "strKvantitetskod",
  "strDelproduktKvantitet",
  "bolSkickaSMS",
  "datUpphorddatum",
  "bolSkickaEpost",
  "strProdukt",
  "strVAOrdertyp",
  "bolAnnulleraOrder",
  "bolKvitteraOrder",
  "strAutoMeddelandeEpostKod",
  "strAutoMeddelandeSmsKod",
  "bolUppdateraStoppKoordinat",
  "allowFreeText",
  "forceFreeText",
  "allowDoubleAmount",
  "forceDoubleAmount",
  "allowImage",
  "forceImage",
  "bolBehallaOrder",
]

export type TariffsModel = {
  intRecnum: number
  strTaxekod: string
  strTaxebenamning: string
  strFakturagrupp: string
  strProdukt: string
  strDelProdukt: string
  strLayoutkod: string
  datUpphorddatum: Date
  datDelAvArFrom: Date
  datDelAvArTom: Date
  bolUtforDebOrdFakt: boolean
  strTaxaSpecificeringstyp: string
  bolPriserInklMoms: boolean
  strBehallarestorlektypkod: string
  intTomPerAr: number
  bolKompost: boolean
  bolSommar: boolean
  strAvfallstyp: string
  strEWCKod: string
  decMangdPerTom: number
  intMinimiforbrukning: number
  strHandelsetyp: string
  datSkapad: Date
  intSkapadAv: number
  bolTaxaTillatenForWebbDispens: boolean
  bolTaxaTillatenForWebbKarlbyte: boolean
  strAvrakningTaxekodAvdrag: string
  decMatarStorlekKbm: number
  bolTaxaTillatenForWebbNyTjanst: boolean
  strRenhOrdertyp: string
  strTomningsFrekvenskod: string
  strUNNr: string
  datSenastUppdaterad: Date
  strSummaAvserText: string
  bolSummeraTaxedelar: boolean
  strSummeraLayoutKod: string
  bolHandelseDelas: boolean
  decVolymPerAr: number
  strEntreprenorkod: string
  strFakturaFrekvens: string
  bolMobileTjanstKvantitet: boolean
  strHamtschemaText: string
  strRDKod: string
  bolAgarbytesBrevUndantag: boolean
  bolTillgangligTjanst: boolean
  bolAgarbyteAvslutaTjanst: boolean
  decMatarstorlekQ3: number
  bolSkapaEjRHOrder: boolean
  strKartsymbol: string
  bolFATjanst: boolean
}

export const TariffsFields = [
  "intRecnum",
  "strTaxekod",
  "strTaxebenamning",
  "strFakturagrupp",
  "strProdukt",
  "strDelProdukt",
  "strLayoutkod",
  "datUpphorddatum",
  "datDelAvArFrom",
  "datDelAvArTom",
  "bolUtforDebOrdFakt",
  "strTaxaSpecificeringstyp",
  "bolPriserInklMoms",
  "strBehallarestorlektypkod",
  "intTomPerAr",
  "bolKompost",
  "bolSommar",
  "strAvfallstyp",
  "strEWCKod",
  "decMangdPerTom",
  "intMinimiforbrukning",
  "strHandelsetyp",
  "datSkapad",
  "intSkapadAv",
  "bolTaxaTillatenForWebbDispens",
  "bolTaxaTillatenForWebbKarlbyte",
  "strAvrakningTaxekodAvdrag",
  "decMatarStorlekKbm",
  "bolTaxaTillatenForWebbNyTjanst",
  "strRenhOrdertyp",
  "strTomningsFrekvenskod",
  "strUNNr",
  "datSenastUppdaterad",
  "strSummaAvserText",
  "bolSummeraTaxedelar",
  "strSummeraLayoutKod",
  "bolHandelseDelas",
  "decVolymPerAr",
  "strEntreprenorkod",
  "strFakturaFrekvens",
  "bolMobileTjanstKvantitet",
  "strHamtschemaText",
  "strRDKod",
  "bolAgarbytesBrevUndantag",
  "bolTillgangligTjanst",
  "bolAgarbyteAvslutaTjanst",
  "decMatarstorlekQ3",
  "bolSkapaEjRHOrder",
  "strKartsymbol",
  "bolFATjanst",
]

export type EventsModel = {
  recHandelse: number
  intKundnr: number
  strAnlnr: string
  intTjanstnr: number
  intFakturaadress: number
  datDatumFrom: Date
  datDatumTom: Date
  strTaxekod: string
  strAnm: string
  strRFID: string
  strFordon: string
  strFordonkod: string
  strAvvikelsekod: string
  strObjNr: string
  strKorlistakod: string
  strUtfortAvSignatur: string
  lngFakturanr: BigInt
  strFakturafrekvens: string
  bolKlarAttFakturera: boolean
  strHandelseText: string
  bolEnbartHandelseTextPaFakturan: boolean
  bolFakturerasEj: boolean
  strEntreprenorkod: string
  intRenhOrdernr: number
  intRenhOrderradnr: number
  intVAOrdernr: number
  curFastPrisNetto: number
  strEWCKod: string
  strUNNr: string
  strRDKod: string
  strAvfallstyp: string
  strEnhetKort: string
  datSkapad: Date
  intSkapadAv: number
  strHandelsetyp: string
  strVagsedelNr: string
  intFakturaradnr: number
  datAvraknadDatum: Date
  datKrediteringGodkandDatum: Date
  strKrediteringGodkandSignatur: string
  bolKrediteringsFragaSkickad: boolean
  strAvvikelseText: string
  recHandelsefilInlasning: string
  curAprisNetto: number
  datLagerFort: Date
  strLagerplatskodFran: string
  strLagerplatskod: string
  strFakturagruppering: string
  intInstallationsNr: number
  bolAvraknasEj: boolean
  strRenhDistriktskod: string
  intSkapadAvRecHandelse: number
  intVAOrderradnr: number
  bolAvvikelse: boolean
  decXkoord: number
  decYkoord: number
  strFakturerasEjOrsak: string
  strFakturerasEjOrsakText: string
  datDatum: Date
  strFotoId: string
  datFotoHamtat: Date
  strObjekt: string
  strProjekt: string
  strInkast: string
  strTjanstensOrderIndex: string
}

export const EventsFields = [
  "recHandelse",
  "intKundnr",
  "strAnlnr",
  "intTjanstnr",
  "intFakturaadress",
  "datDatumFrom",
  "datDatumTom",
  "strTaxekod",
  "strAnm",
  "strRFID",
  "strFordon",
  "strFordonkod",
  "strAvvikelsekod",
  "strObjNr",
  "strKorlistakod",
  "strUtfortAvSignatur",
  "lngFakturanr",
  "strFakturafrekvens",
  "bolKlarAttFakturera",
  "strHandelseText",
  "bolEnbartHandelseTextPaFakturan",
  "bolFakturerasEj",
  "strEntreprenorkod",
  "intRenhOrdernr",
  "intRenhOrderradnr",
  "intVAOrdernr",
  "curFastPrisNetto",
  "strEWCKod",
  "strUNNr",
  "strRDKod",
  "strAvfallstyp",
  "strEnhetKort",
  "datSkapad",
  "intSkapadAv",
  "strHandelsetyp",
  "strVagsedelNr",
  "intFakturaradnr",
  "datAvraknadDatum",
  "datKrediteringGodkandDatum",
  "strKrediteringGodkandSignatur",
  "bolKrediteringsFragaSkickad",
  "strAvvikelseText",
  "recHandelsefilInlasning",
  "curAprisNetto",
  "datLagerFort",
  "strLagerplatskodFran",
  "strLagerplatskod",
  "strFakturagruppering",
  "intInstallationsNr",
  "bolAvraknasEj",
  "strRenhDistriktskod",
  "intSkapadAvRecHandelse",
  "intVAOrderradnr",
  "bolAvvikelse",
  "decXkoord",
  "decYkoord",
  "strFakturerasEjOrsak",
  "strFakturerasEjOrsakText",
  "datDatum",
  "strFotoId",
  "datFotoHamtat",
  "strObjekt",
  "strProjekt",
  "strInkast",
  "strTjanstensOrderIndex",
]

export type FacilitiesModel = {
  intRecnum: number
  strAnlnr: string
  intKundnr: number
  strFornamn1: string
  strEfternamn1: string
  strFornamn2: string
  strEfternamn2: string
  intKundFakturaAdress: number
  strAnlAdressgata: string
  intAnlAdressnr: number
  strAnlAdressbokstav: string
  strPostnr: string
  strAnlOrt: string
  strFastbeteckningTrakt: string
  strFastbeteckningBlock: string
  strFastbeteckningTecken: string
  intFastbeteckningEnhet: number
  strPopularNamn: string
  strFastnyckel: string
  strFastighetsUuid: string
  strAnlaggningsKategori: string
  strForNamn: string
  strEfterNamn: string
  strTelefon: string
  strTelefonArbete: string
  strTelefonMobil: string
  bolSMSOK: boolean
  bolEpostOK: boolean
  strEpostadress: string
  strFakturaFrekvens: string
  intFakturaadress: number
  bolSeparatFaktura: boolean
  intAgarekundnr: number
  intAvlasningskortsadress: number
  decAnlXkoordinat: number
  decAnlYkoordinat: number
  bolInterndebiteras: boolean
  strMotpartKoncernkod: string
  strDistriktsInfoExtra1: string
  strDistriktsInfoExtra2: string
  strDistriktsInfoExtra3: string
  strVADistriktskodKomdel: string
  strVADistriktskodStat: string
  strVADistriktskodAvlas: string
  strAvlasningsOrdningsNr: string
  strVADistriktskodMatbyt: string
  strMatarbytesOrdningsNr: string
  strVADistriktskodVatror: string
  strVADistriktskodVatror2: string
  strVADistriktskodAvlror: string
  strVADistriktskodAvlror2: string
  strVADistriktskodVatverk: string
  strVADistriktskodAvlverk: string
  bolInternmoms: boolean
  AnlKommunDistriktstyp: string
  AnlStatDistriktstyp: string
  AnlAvlasDistriktstyp: string
  AnlMatbytDistriktstyp: string
  AnlVatrorDistriktstyp: string
  AnlAvlrorDistriktstyp: string
  AnlVatverkDistriktstyp: string
  AnlAvlverkDistriktstyp: string
  AnlExtra1: string
  AnlExtra2: string
  AnlExtra3: string
  strAnlAdressHel: string
  strFastBeteckningHel: string
  strKundNamnHel: string
  decTotalArsforbrukning: number
  strSpecialAdressHel: string
  FaktAdr: string
  strAnlReferens: string
  strFakturagrupp: string
  strFakturaSortering: string
  intSpecialadressKontakt: number
  strKommunkod: string
  intUtskickadress: number
  strExtraAnlaggning1: string
  strExtraAnlaggning2: string
  datBrevutskick: Date
  strArendeAnteckning: string
  AnlDatSkapad: string
  strAvvikandeDebiterasMoms: string
  bolAnlAdrSomUtskicksAdr: boolean
  AntTj: number
  Prod: string
  Bevakning: string
  bolVarnaForKundManuell: boolean
  strKreditBetyg: string
  strNyckelnr: string
  strPortkod: string
  datUpphorddatum: Date
  intCFAR: number
  bolOmbudAnteckning1: boolean
  intTypkod: number
  bolFAKommun: boolean
}

export const FacilitiesFields = [
  "intRecnum",
  "strAnlnr",
  "intKundnr",
  "strFornamn1",
  "strEfternamn1",
  "strFornamn2",
  "strEfternamn2",
  "intKundFakturaAdress",
  "strAnlAdressgata",
  "intAnlAdressnr",
  "strAnlAdressbokstav",
  "strPostnr",
  "strAnlOrt",
  "strFastbeteckningTrakt",
  "strFastbeteckningBlock",
  "strFastbeteckningTecken",
  "intFastbeteckningEnhet",
  "strPopularNamn",
  "strFastnyckel",
  "strFastighetsUuid",
  "strAnlaggningsKategori",
  "strForNamn",
  "strEfterNamn",
  "strTelefon",
  "strTelefonArbete",
  "strTelefonMobil",
  "bolSMSOK",
  "bolEpostOK",
  "strEpostadress",
  "strFakturaFrekvens",
  "intFakturaadress",
  "bolSeparatFaktura",
  "intAgarekundnr",
  "intAvlasningskortsadress",
  "decAnlXkoordinat",
  "decAnlYkoordinat",
  "bolInterndebiteras",
  "strMotpartKoncernkod",
  "strDistriktsInfoExtra1",
  "strDistriktsInfoExtra2",
  "strDistriktsInfoExtra3",
  "strVADistriktskodKomdel",
  "strVADistriktskodStat",
  "strVADistriktskodAvlas",
  "strAvlasningsOrdningsNr",
  "strVADistriktskodMatbyt",
  "strMatarbytesOrdningsNr",
  "strVADistriktskodVatror",
  "strVADistriktskodVatror2",
  "strVADistriktskodAvlror",
  "strVADistriktskodAvlror2",
  "strVADistriktskodVatverk",
  "strVADistriktskodAvlverk",
  "bolInternmoms",
  "AnlKommunDistriktstyp",
  "AnlStatDistriktstyp",
  "AnlAvlasDistriktstyp",
  "AnlMatbytDistriktstyp",
  "AnlVatrorDistriktstyp",
  "AnlAvlrorDistriktstyp",
  "AnlVatverkDistriktstyp",
  "AnlAvlverkDistriktstyp",
  "AnlExtra1",
  "AnlExtra2",
  "AnlExtra3",
  "strAnlAdressHel",
  "strFastBeteckningHel",
  "strKundNamnHel",
  "decTotalArsforbrukning",
  "strSpecialAdressHel",
  "FaktAdr",
  "strAnlReferens",
  "strFakturagrupp",
  "strFakturaSortering",
  "intSpecialadressKontakt",
  "strKommunkod",
  "intUtskickadress",
  "strExtraAnlaggning1",
  "strExtraAnlaggning2",
  "datBrevutskick",
  "strArendeAnteckning",
  "AnlDatSkapad",
  "strAvvikandeDebiterasMoms",
  "bolAnlAdrSomUtskicksAdr",
  "AntTj",
  "Prod",
  "Bevakning",
  "bolVarnaForKundManuell",
  "strKreditBetyg",
  "strNyckelnr",
  "strPortkod",
  "datUpphorddatum",
  "intCFAR",
  "bolOmbudAnteckning1",
  "intTypkod",
  "bolFAKommun",
]
