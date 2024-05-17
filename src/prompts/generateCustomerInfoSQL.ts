const sqlPrompt = (brokenSql, sqlError) => {
  const initialPrompt = `
I have a few internal systems that I need to query for an internal customer
service bot. The bot gathers relevant information about a customer.

You have some tools available at your disposal to help you with this task. The tools are:
- exectueSQL: You can run the query by calling the executeSQL tool function with a SQL query as parameter
In the SQL Query, always use column name strAnlNr in the facilities table to join to the correct customer facility.
This is the same as the column strAnlnr in the customer_events table. Put the value of strAnlNr in the SQL query as a parameter.

The Database Server is running Microsoft SQL Server 2024.
SORT DATA AS LATEST FIRST unless the user asks otherwise
MAKE SURE THE RESPONSE IS VALID SQL!

Only filter tbFuHandlese by strAnlNr, as strAnlNr is the only indexed column. Never filter by date, sort the data by date and return the latest X rows.

Here are the definitions for the tables in the sql database:
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
