## Purpose

**Type:** ✨ New Feature
**Summary:** Add a Chef Mascot AI Assistant using `page-mascot`, an iMessage-themed chat UI, and OpenRouter for LLM communication.
**Context:** The user wants an interactive AI food assistant triggered by clicking a 2D Chef mascot. The chat interface must resemble iMessage. The API key will be provided by the user in the Family Settings modal and stored locally, communicating with OpenRouter to answer food, recipe, and shopping questions.
**Expected Outcome:** A floating Chef Mascot that opens an iMessage-themed chat popup. The app sends a compact, read-only projection of the user's database directly to OpenRouter via client-side streaming, bypassing any Vercel backend timeouts.

## Research & Discovery
- **Mascot Integration:** The `page-mascot` library provides a `<Mascot>` component. We will download the images to `static/mascots/` and import the component.
- **API Strategy (OpenRouter):** Since the API key is user-provided and stored in `localStorage`, we can bypass the SvelteKit backend completely. We will make direct client-side streaming requests to OpenRouter (`https://openrouter.ai/api/v1/chat/completions`). This eliminates Vercel serverless timeout limits (504 errors).
- **Design:** The chat window will use iMessage aesthetics (blue bubbles for the user, gray/white for the AI, rounded corners, tight padding) while matching the broader Luminous Hearth theme constraints.

## Proposed Changes

### 1. Dependencies & Assets
#### [MODIFY] [package.json](file:///Users/mac/kitchen/package.json)
- Run `npm install page-mascot marked dompurify` to support the mascot and safe markdown rendering.
- *Note: I have already downloaded the `chef-directions.webp` and `chef-reactions.webp` assets to `static/mascots/`.*

### 2. State & Settings Management
#### [MODIFY] [src/lib/store.svelte.ts](file:///Users/mac/kitchen/src/lib/store.svelte.ts)
- Update the `settings` object inside the store to include `openRouterApiKey?: string`.

#### [MODIFY] [src/lib/components/FamilySettingsModal.svelte](file:///Users/mac/kitchen/src/lib/components/FamilySettingsModal.svelte)
- Add a new "AI Assistant Settings" section.
- Add a password-type input field bound to `db.settings.openRouterApiKey`.

### 3. Service Layer (Context Projection)
#### [NEW] [src/lib/services/aiChat.ts](file:///Users/mac/kitchen/src/lib/services/aiChat.ts)
- **Compact Context Projection:** Extract only actionable data (active fridge items, shopping list, recipe names/macros) to save tokens and prevent payload bloat.
- **Client-Side OpenRouter Streaming:** Implement a function that takes the user prompt, the projected context, and the API key, then uses `fetch()` to call OpenRouter with `{ stream: true }`. Read the chunks and yield them to the UI.

### 4. UI Components
#### [NEW] [src/lib/components/AIChatWidget.svelte](file:///Users/mac/kitchen/src/lib/components/AIChatWidget.svelte)
- **Mascot Trigger:** Render `<Mascot directions="/mascots/chef-directions.webp" reactions="/mascots/chef-reactions.webp" />` in the bottom-right corner.
- **Chat Window (iMessage Theme):**
  - When the mascot is clicked, open a pop-up chat window.
  - Implement blue bubbles (`bg-blue-500 text-white`) for user messages, and gray bubbles (`bg-gray-200 text-black`) for AI responses.
  - Apply `border-radius: 20px` to bubbles with the classic iMessage tail shape if possible, or standard highly-rounded corners.
  - Use `marked` and `dompurify` to render AI markdown safely.
  - Ensure the widget gracefully handles missing API keys by showing a prompt: "Please add your OpenRouter API Key in Settings."

#### [MODIFY] [src/routes/+layout.svelte](file:///Users/mac/kitchen/src/routes/+layout.svelte)
- Import `<AIChatWidget />` and place it at the root of the layout so the Chef mascot persists across all pages.

## Open Questions & Decisions
> [!IMPORTANT]
> **OpenRouter Model:** I will default to `google/gemini-2.5-flash` via OpenRouter for fast, cheap reasoning. Do you want to expose a dropdown in settings to select the model, or is hardcoding a default fine for now?

## Verification Plan
### Automated Tests
- `npm run check` and `npm run build` to ensure type safety and successful compilation.

### Manual Verification
1. Add an OpenRouter key in the Family Settings modal.
2. Click the Chef Mascot in the bottom right corner.
3. Observe the pop-up chat opening with an iMessage-style interface.
4. Ask "What do I need to buy?" and verify that the AI streams the response client-side.
5. Verify the prompt accurately respects the Moroccan pricing and strict food-only rules.

## Execution Recommendation
- **Environment:** Execute directly on the main branch, implementing the state changes first, followed by the UI widget and styling.
