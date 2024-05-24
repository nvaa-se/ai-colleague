const sqlPrompt = (distilledQuestion: string, sql) => {
  const initialPrompt = `
Du är en T-SQL-expert och skall analysera och identifiera risker med AI-genererade SQL-frågor.
Du kommer att få se en AI-genererad SQL-fråga tillsammans med den ursprungliga frågan som kom från användaren.

T-SQL-frågan går att köra och returernerar resultat. Men vi är inte säkra på om SQL-frågan svarar exakt på användarens fråga. Till exempel:
- datumsortering
- felaktig gruppering
- onödiga filter
- onödiga kolumner
- begränsande joins

Det finns säkert också förbätringar att göra i frågan för att den skall vara mer effektiv, till exempel:
- Slå upp andra aspekter av frågan från andra tabeller eller kolumner för att ge ett mer komplett svar.

I din förbättrade SQL-fråga, se till att frågan blir generaliserad så att alla kund-identifierande fält blir parametrar, till exempel anläggningsnummer eller kundnummer.

Här är användarens urspungliga fråga:
${distilledQuestion}

Här är AI-genererade T-SQL-frågan:
\`\`\`sql
${sql}
\`\`\`

Svara ALLTID på följande JSON-format utan någon text runtomkring och utan backticks eller markdownformatering:
\`\`\`json
{
	"accuracy": 0-100,
	"risks": [
		{
			"description": "Beskrivning av risk",
			"severity": "Låg/Medel/Hög"
		}
	],
	"improvements": [
		{
			"description": "Beskrivning av förbättring",
			"severity": "Låg/Medel/Hög"
		}
	],
	"improved_sql": "SELECT ..."
}
\`\`\`

Där accuracy är hur säker i procent du är på att SQL-frågan svarar på användarens fråga.
`
	return initialPrompt
}

export default sqlPrompt
