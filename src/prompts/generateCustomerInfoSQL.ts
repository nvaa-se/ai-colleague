import databaseLayout from "./databaseLayout"
import tableAanalysis from "./tableAanalysis"
import sampleQueries from "./sampleQueries"

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
If you select dates, order them with latest first.

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
${databaseLayout}
${sampleQueries}
${tableAanalysis}

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
