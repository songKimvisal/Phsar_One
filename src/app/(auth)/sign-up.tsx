import { useSignUp, useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import * as React from 'react'
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { signOut } = useAuth()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) {
      console.log('Clerk not loaded yet')
      return
    }

    if (!emailAddress || emailAddress.trim() === '') {
      console.error('Email address is required')
      return
    }

    if (!password || password.length < 8) {
      console.error('Password must be at least 8 characters long')
      return
    }

    if (password !== confirmPassword) {
      console.error('Passwords do not match')
      return
    }

    try {
      console.log('SignUp object status before create:', signUp?.status)
      console.log('Creating account with email:', emailAddress)

      // Create the sign up attempt
      const result = await signUp.create({
        emailAddress,
        password,
      })

      console.log('Sign up created successfully, status:', result.status)

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      console.log('Email verification prepared')
      setPendingVerification(true)
    } catch (err: any) {
      console.error('Sign up error:', err)

      // Check if it's a session_exists error
      if (err.errors && err.errors.some((e: any) => e.code === 'session_exists')) {
        console.log('Session already exists, signing out and retrying...')
        try {
          await signOut()
          console.log('Signed out successfully, please try signing up again')
          alert('You were already signed in. Please try signing up again.')
        } catch (signOutErr) {
          console.error('Sign out error:', signOutErr)
          alert('Please clear app data and try again')
        }
        return
      }

      if (err.errors) {
        err.errors.forEach((error: any) => {
          console.error('Error detail:', error.message, '-', error.longMessage)
        })
      }
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/(tabs)')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>Enter the code sent to {emailAddress}</Text>
        <TextInput
          value={code}
          placeholder="Enter verification code"
          onChangeText={setCode}
          style={styles.input}
          keyboardType="number-pad"
        />
        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('@src/assets/icons/Main-logo-24.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Enter your email below to create your account</Text>

          <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter your email"
          onChangeText={setEmailAddress}
          style={styles.input}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={setPassword}
          style={styles.input}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          placeholder="Re-enter your password"
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />

        <Text style={styles.hint}>Must be at least 8 characters long.</Text>

        <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>

          <Text style={styles.terms}>
            By continuing, you agree to PhsarOne's Terms{'\n'}of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 60,
    alignSelf: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: '#999',
  },
  button: {
    backgroundColor: '#E44336',
    borderRadius: 50,
    padding: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  terms: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 'auto',
  },
})