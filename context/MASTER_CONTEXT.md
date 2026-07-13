# FLOWSTATE — Master Context

## Project Identity

**FLOWSTATE** is a relaxing yet competitive mobile game for Android and iOS.

**Core Philosophy:** *"The better you play, the more alive and beautiful the world becomes."*

## Vision

The player controls a small glowing entity moving continuously through an abstract, initially fragmented and muted world. Through simple tap, swipe, and hold interactions, the player navigates flowing paths, collects energy, activates objects, avoids disruptions, chains interactions, and restores harmony to the environment.

## Target Platforms

- Android (CONFIRMED)
- iOS (CONFIRMED)

## Core Experience

Transform chaos into harmony through simple, satisfying interactions.

## Product Principles

1. **Controls should be simple to learn and support mastery**
2. **The game should be calming but mechanically deep**
3. **Short sessions should support replayability**
4. **Environmental transformation is a core feedback mechanism**
5. **Competitive systems must not destroy the calming identity**
6. **Monetization must not be pay-to-win**
7. **The core gameplay must be satisfying without progression, cosmetics, rankings, or monetization**

## Technical Principles

1. **Gameplay must work independently of backend availability**
2. **Competitive data requires server authority**
3. **Presentation must not own game rules**
4. **Avoid premature microservices — start modular**
5. **Avoid global singleton sprawl — use explicit service boundaries**
6. **Context is documentation, not runtime configuration**
7. **Keep the MVP architecture extensible but small**
8. **Prefer clear boundaries over excessive abstraction**

## Confirmed Decisions

- Monorepo architecture
- Unity + C# for game client
- Backend: Node.js + TypeScript + Express (ASSUMED)
- Database: PostgreSQL (ASSUMED)
- Client-side routing: Scene-based + UI layer navigation
- API versioning: URL-based `/api/v1/`
- Service architecture: Modular monolith (not microservices)

## Game Identity Keywords

Calming, flowing, harmonious, transformative, satisfying, alive, beautiful, abstract, glowing, restoring
