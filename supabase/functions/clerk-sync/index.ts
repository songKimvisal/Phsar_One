import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Webhook } from "https://esm.sh/svix@1.15.0"

const CLERK_WEBHOOK_SECRET = Deno.env.get('CLERK_WEBHOOK_SECRET')

Deno.serve(async (req) => {
  console.log("Function invoked!")

  // 1. Verify Headers
  const svix_id = req.headers.get("svix-id")
  const svix_timestamp = req.headers.get("svix-timestamp")
  const svix_signature = req.headers.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers")
    return new Response("Missing svix headers", { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(CLERK_WEBHOOK_SECRET!)
  let evt: any

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response("Error verifying webhook", { status: 400 })
  }

  // 2. Process Event
  const eventType = evt.type
  console.log(`Received Clerk event: ${eventType}`)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url, phone_numbers } = evt.data
    const email = email_addresses[0]?.email_address
    const phone = phone_numbers[0]?.phone_number

    console.log(`Syncing user ${id} (${email})...`)

    const { error } = await supabase
      .from('users')
      .upsert({
        id: id,
        email: email,
        first_name: first_name,
        last_name: last_name,
        avatar_url: image_url,
        phone: phone,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })

    if (error) {
      console.error('Error upserting user:', error)
      return new Response(JSON.stringify(error), { status: 500 })
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  })
})
