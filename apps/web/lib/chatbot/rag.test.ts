import { searchKnowledgeBase } from '@/lib/chatbot/rag'

describe('chatbot knowledge base retrieval', () => {
  it('findet Datenschutz-Seite für Privacy-Fragen', () => {
    const hits = searchKnowledgeBase('Wie schützt ihr meine Daten und den Datenschutz?')
    expect(hits[0]?.entry.url).toBe('/privacy')
  })

  it('liefert wissenschaftliche Infos zur Ersteinschätzung', () => {
    const hits = searchKnowledgeBase('Ist die Ersteinschätzung wissenschaftlich validiert?')
    expect(hits[0]?.entry.url).toBe('/triage')
  })

  it('liefert Infos für Therapeut:innen-Anfragen', () => {
    const hits = searchKnowledgeBase('Ich bin Therapeutin, wie kann ich mitmachen?')
    expect(hits[0]?.entry.url).toBe('/for-therapists')
  })
})
