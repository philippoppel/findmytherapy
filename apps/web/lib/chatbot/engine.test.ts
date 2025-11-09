import { createInitialState, processUserMessage, generateResponse } from '@/lib/chatbot/engine'

function getLastAssistantMessage(state: ReturnType<typeof processUserMessage>) {
  return state.messages.filter((msg) => msg.role === 'assistant').at(-1)
}

describe('chatbot engine safety & infos', () => {
  it('zeigt bei Krisen sofort Notfallhinweise', () => {
    let state = createInitialState()
    state = processUserMessage('Ich will nicht mehr leben', state)
    const assistant = getLastAssistantMessage(state)

    expect(assistant?.metadata?.sentiment).toBe('crisis')
    expect(assistant?.metadata?.suggestedAction).toBe('crisis_resources')
    expect(assistant?.content).toContain('Telefonseelsorge: 142')
    expect(assistant?.content).toContain('Notruf: 144')
  })

  it('liefert konkrete Hinweise zum Therapeut:innen-Verzeichnis', () => {
    let state = createInitialState()
    state = processUserMessage('Hallo', state)
    state = processUserMessage('Ich suche eine Therapeutin', state)
    const assistant = getLastAssistantMessage(state)

    expect(assistant?.content).toMatch(/Therapeut:innen|\/therapists/)
  })

  it('erklärt, wie man die Ersteinschätzung startet', () => {
    let state = createInitialState()
    state = processUserMessage('Wie mache ich die Ersteinschätzung?', state)
    const assistant = getLastAssistantMessage(state)

    expect(assistant?.content).toContain('/triage')
    expect(assistant?.metadata?.references?.[0]?.url).toBe('/triage')
  })

  it('liefert Infos zur wissenschaftlichen Validierung', () => {
    const baseState = { ...createInitialState(), userMessageCount: 2 }
    const result = generateResponse('Ist die Ersteinschätzung wissenschaftlich validiert?', baseState)

    expect(result.response).toContain('PHQ-9')
    expect(result.metadata?.references?.[0]?.url).toBe('/triage')
  })

  it('beschreibt das Plattform-Konzept bei Nachfrage', () => {
    const baseState = { ...createInitialState(), userMessageCount: 1 }
    const { metadata, response } = generateResponse('Kannst du mir euer Konzept erklären?', baseState)

    expect(response).toContain('/about')
    expect(metadata?.references?.[0]?.url).toBe('/about')
  })

  // === NEUE SICHERHEITS-KATEGORIEN (2025) ===

  it('erkennt Gewalt gegen andere und zeigt spezifische Hilfe', () => {
    let state = createInitialState()
    state = processUserMessage('Ich will jemanden töten, kann mich nicht kontrollieren', state)
    const assistant = getLastAssistantMessage(state)

    expect(assistant?.metadata?.sentiment).toBe('crisis')
    expect(assistant?.metadata?.suggestedAction).toBe('crisis_resources')
    expect(assistant?.content).toContain('01/313 30') // Psychiatrische Soforthilfe
    expect(assistant?.content).toContain('Gedanken daran, jemand anderem Schaden zuzufügen')
  })

  it('erkennt subtile Suizidalität', () => {
    let state = createInitialState()
    state = processUserMessage('Meine Familie wäre ohne mich besser dran', state)
    const assistant = getLastAssistantMessage(state)

    expect(assistant?.metadata?.sentiment).toBe('crisis')
    expect(assistant?.content).toContain('142') // Telefonseelsorge
  })

  it('erkennt Essstörungen', () => {
    let state = createInitialState()
    state = processUserMessage('Ich erbreche nach jedem Essen', state)
    const assistant = getLastAssistantMessage(state)

    expect(assistant?.metadata?.sentiment).toBe('crisis')
    expect(assistant?.metadata?.suggestedAction).toBe('crisis_resources')
    expect(assistant?.content).toContain('Essstörungen')
    expect(assistant?.content).toMatch(/0800 20 11 20|Intakt|Sowhat/) // Spezifische Hotlines
  })

  it('erkennt Substanzmissbrauch', () => {
    let state = createInitialState()
    state = processUserMessage('Ich trinke jeden Tag eine Flasche Wodka', state)
    const assistant = getLastAssistantMessage(state)

    expect(['crisis', 'concerning']).toContain(assistant?.metadata?.sentiment)
    expect(assistant?.content).toContain('Substanzmissbrauch')
    expect(assistant?.content).toMatch(/Sucht|01\/201 65|01\/544 46 40/) // Suchtberatung
  })

  // === KNOWLEDGE BASE TESTS ===

  it('erklärt PHQ-9 detailliert', () => {
    const baseState = { ...createInitialState(), userMessageCount: 2 }
    const result = generateResponse('Was ist PHQ-9?', baseState)

    expect(result.response).toContain('9 Fragen')
    expect(result.response).toContain('Depression')
    expect(result.metadata?.references?.[0]?.url).toBe('/triage')
  })

  it('erklärt GAD-7 detailliert', () => {
    const baseState = { ...createInitialState(), userMessageCount: 2 }
    const result = generateResponse('Was ist GAD-7?', baseState)

    expect(result.response).toContain('7 Fragen')
    expect(result.response).toContain('Angst')
    expect(result.metadata?.references?.[0]?.url).toBe('/triage')
  })

  it('erklärt das Matching-System', () => {
    const baseState = { ...createInitialState(), userMessageCount: 2 }
    const result = generateResponse('Wie funktioniert euer Therapeuten-Matching?', baseState)

    expect(result.response).toContain('Ersteinschätzung')
    expect(result.response).toMatch(/Filter|Matching/)
    expect(result.metadata?.references?.[0]?.url).toBe('/therapists')
  })

  it('erklärt Kosten transparent', () => {
    const baseState = { ...createInitialState(), userMessageCount: 2 }
    const result = generateResponse('Wie viel kostet die Therapie? Was sind die Preise?', baseState)

    expect(result.response).toMatch(/kostenlos|Preis|Kosten|Selbstzahler|Kasse/)
    // Allow both /pricing and /about since both contain cost info
    expect(['/pricing', '/about', '/triage']).toContain(result.metadata?.references?.[0]?.url)
  })

  it('fügt Krisenprävention-Footer bei concerning Sentiment hinzu', () => {
    let state = createInitialState()
    state = processUserMessage('Ich fühle mich total depressiv', state)
    const assistant = getLastAssistantMessage(state)

    expect(assistant?.metadata?.sentiment).toBe('concerning')
    expect(assistant?.content).toContain('Falls es akut schlimmer wird')
    expect(assistant?.content).toContain('142')
  })
})
