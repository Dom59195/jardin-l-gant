import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  nom?: string
  email?: string
  telephone?: string
  prestations?: string[]
  message?: string
}

const Email = ({ nom, email, telephone, prestations, message }: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Nouvelle demande de devis de {nom || 'un client'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>Blondel Jardin</Text>
        <Heading style={h1}>Nouvelle demande de devis</Heading>
        <Text style={label}>Nom</Text><Text style={value}>{nom || '—'}</Text>
        <Text style={label}>Téléphone</Text><Text style={value}>{telephone || '—'}</Text>
        <Text style={label}>E-mail</Text><Text style={value}>{email || '—'}</Text>
        {prestations && prestations.length > 0 && (<><Text style={label}>Prestations</Text><Text style={value}>{prestations.join(' · ')}</Text></>)}
        <Hr style={hr} />
        <Text style={label}>Message</Text>
        <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{message || '—'}</Text>
        <Hr style={hr} />
        <Text style={small}>Une copie est disponible dans votre espace admin.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `Nouvelle demande de devis — ${d.nom || 'client'}`,
  displayName: 'Nouvelle demande de devis',
  to: 'cblondel26@gmail.com',
  previewData: { nom: 'Marie Dupont', email: 'marie@example.com', telephone: '06 12 34 56 78', prestations: ['Taille de haies'], message: 'Bonjour, je souhaite faire tailler ma haie.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '28px 25px', maxWidth: '560px' }
const brand = { color: '#6b8f3a', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, margin: '0 0 8px' }
const h1 = { color: '#1c2a1f', fontSize: '22px', margin: '0 0 20px' }
const label = { color: '#6b7a6e', fontSize: '12px', margin: '12px 0 2px' }
const value = { color: '#1c2a1f', fontSize: '15px', margin: 0 }
const hr = { borderColor: '#e6e2d8', margin: '20px 0' }
const small = { color: '#6b7a6e', fontSize: '12px' }
