import { Handler } from '@netlify/functions'
import * as Sentry from '@sentry/node'

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

    const { fileContent, fileType } = JSON.parse(event.body || '{}')

    if (!fileContent || !fileType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing file content or type' }),
      }
    }

    // TODO: Implement file parsing logic based on fileType
    const transactions = []

    return {
      statusCode: 200,
      body: JSON.stringify({ transactions }),
    }
  } catch (error) {
    console.error('File parsing error:', error)
    Sentry.captureException(error)
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to parse file' }),
    }
  }
}

export { handler }