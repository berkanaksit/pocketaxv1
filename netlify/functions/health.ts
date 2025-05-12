import { Handler } from '@netlify/functions'

const handler: Handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    }),
  }
}

export { handler }