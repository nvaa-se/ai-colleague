export default `Here are som examples of validated SQL Queries:

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
`