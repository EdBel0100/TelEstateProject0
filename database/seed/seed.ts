// database/seed/seed.ts
import { PrismaClient } from '../generated'
import landlords from './landlords.json'
import tenants from './tenants.json'
import tradePeople from './tradePeople.json'
import locations from './locations.json'
import buildings from './buildings.json'
import properties from './properties.json'
import tickets from './tickets.json'
import leases from './lEASE.json'
import payments from './pAYMENT.json'
import conversations from './conversations.json'
import messages from './messages.json'

const prisma = new PrismaClient()

async function main() {
  // Landlords
  for (const l of landlords) {
    await prisma.landlord.upsert({
      where: { cognitoId: l.cognitoId },
      update: {},
      create: l,
    })
  }

  // Tenants
  for (const t of tenants) {
    await prisma.tenant.upsert({
      where: { cognitoId: t.cognitoId },
      update: {},
      create: t,
    })
  }

  // TradePeople
  for (const tp of tradePeople) {
    await prisma.tradePerson.upsert({
      where: { cognitoId: tp.cognitoId },
      update: {},
      create: tp,
    })
  }

  // Locations
  for (const loc of locations) {
    await prisma.location.upsert({
      where: { id: loc.id },
      update: {},
      create: loc,
    })
  }

  // Buildings
  for (const b of buildings) {
    await prisma.building.upsert({
      where: { id: b.id },
      update: {},
      create: b,
    })
  }

  // Properties
  for (const p of properties) {
    await prisma.property.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    })
  }

  // Tickets
  for (const t of tickets) {
    await prisma.tickets.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    })
  }

  // Leases
  for (const l of leases) {
    await prisma.lEASE.upsert({
      where: { id: l.id },
      update: {},
      create: l,
    })
  }

  // Payments
  for (const p of payments) {
    await prisma.pAYMENT.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    })
  }

  // Conversations
  for (const c of conversations) {
    await prisma.conversation.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    })
  }

  // Messages
  for (const m of messages) {
    await prisma.messages.upsert({
      where: { id: m.id },
      update: {},
      create: m,
    })
  }

  console.log('✅ Database seeding complete!')
}

main()
 