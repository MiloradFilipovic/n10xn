import '@netlify/functions'
import { getOrCreateDocAndToken } from '@y-sweet/sdk'

export default async function handler(req: Request) {
  const { docId } = await req.json()

  const connectionString =
    process.env.Y_SWEET_CONNECTION_STRING ||
    (typeof Netlify !== 'undefined' ? Netlify.env.get('Y_SWEET_CONNECTION_STRING') : undefined)

  if (!connectionString)
    return new Response('Y-Sweet connection string is not set', { status: 500 })

  // IMPORTANT!:
  // In a production environment, you should authenticate the user and check
  // that they are authorized to access the document here.

  const clientToken = await getOrCreateDocAndToken(connectionString, docId)
  return Response.json(clientToken)
}
