# DREMARS Vault

Web platform for architectural references + AI-powered creative editor (Vault, Linear & Nodal).

## Project Vision & Evolution
DREMARS started as my first complete web application in Python (Flask). After analyzing the real needs of architects and creators, I evolved it into a much more ambitious platform than a traditional architecture studio.

### Current Architecture

**Vault**  
A smart repository of real architectural photography, filterable by location, style, materials, and more. Photographers can upload content and earn from downloads.

**Lab (Creative Studio)**  
An AI-powered workspace divided into three specialized modes:

- **Normal Mode**  
  Moodboard + optimized prompt generation with direct integration to image generators (Grok Imagine planned). Users can upload references or pull from the Vault to create optimized renders.

- **Linear Mode**  
  Storyboard-style editor designed for the creation and curation of sequential content. It provides full control over each frame or scene, allowing precise management of prompts, results, and order. This centralizes the entire project in one tool, avoiding the need to open multiple tabs or lose track of prompts, enabling greater precision and consistency in complex sequences.

- **Nodal Mode**  
  Visual node-based editor for advanced concept mixing. Users connect multiple references and specify what elements to take from each image (style, lighting, materials, composition) to generate highly personalized final outputs.

## Technologies Used
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Authentication + Database + Storage)
- Grok Imagine (planned integration for image generation)

## Current Status
- Functional Dashboard
- Authentication system
- Explore Vault
- Moodboard per project
- Linear Mode (Storyboard)
- Nodal Mode (in development)

## Project Goal
DREMARS aims to solve the fragmented workflow of visual creators by providing a complete, specialized platform with high-quality real references and powerful AI tools that give professional control over the final result.

## What I'm Looking For
I am applying to **SpaceX AI** because I learn extremely fast and have the discipline to build real, functional systems from scratch.

This repository represents the **second major version** of DREMARS.
- The first version was built in Python (Flask) as my initial approach to web development and deployment.
- This current version, started on May 8th, is my first complete project using Next.js, featuring a much more complex and structured platform.

DREMARS aims to differentiate itself in the market by offering a complete ecosystem: a high-quality Vault of real architectural references for consumers, and powerful AI-powered creative tools (Vault, Linear, and Nodal modes) for creators — going far beyond a traditional architecture studio.

This repository shows my current progress and continuous learning journey.

## How to Run Locally
```bash
npm install
npm run dev
