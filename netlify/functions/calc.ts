import { Handler } from '@netlify/functions'
import * as Sentry from '@sentry/node'
import { buildTaxSummary } from '../../src/lib/taxEngine'

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  tracesSampleRate: 1.0,
})

const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
      }
    }

    const { income } = JSON.parse(event.body || '{}')

    if (typeof income !== 'number' || isNaN(income)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid income value' }),
      }
    }

    const taxSummary = buildTaxSummary(income)

    return {
      statusCode: 200,
      body: JSON.stringify(taxSummary),
    }
  } catch (error) {
    console.error('Tax calculation error:', error)
    Sentry.captureException(error)
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to calculate tax' }),
    }
  }
}

export { handler }