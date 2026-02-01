import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'
import { useEffect } from 'react'

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    console.log('Auth Layout - isSignedIn:', isSignedIn, 'isLoaded:', isLoaded)
  }, [isSignedIn, isLoaded])

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    console.log('Redirecting to home...')
    return <Redirect href={'/(tabs)'} />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}