import { useState, useEffect } from 'react'
import { IconSearch, IconArrowLeft } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import * as faqData from '../data/faq.pt-BR.json'

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Garantir que a página carregue no topo
    window.scrollTo(0, 0)
  }, [])

  const filteredFAQ = faqData.faq.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleSearch = () => {
    // A pesquisa já acontece automaticamente conforme digita
    console.log('Pesquisando por:', searchTerm)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="container">
      {/* Botão Voltar - Apenas seta */}
      <div className="back-arrow-container">
        <button
          onClick={() => navigate('/')}
          className="back-arrow"
          aria-label="Voltar"
        >
          <IconArrowLeft size={20} />
        </button>
      </div>

      <div className="faq-header">
        <div className="faq-hero">
          <img 
            src="/faqs.png" 
            alt="FAQs" 
            className="faq-image"
            style={{
              width: '48px',
              height: '48px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '12px'
            }}
          />
          <h1 className="faq-title">Dúvidas Frequentes</h1>
          <p className="faq-subtitle">
            Encontre respostas rápidas para suas dúvidas sobre trauma dentário
          </p>
        </div>

        <div className="search-section">
          <div className="search-container">
            <IconSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <button
              onClick={handleSearch}
              className="search-lupa"
              aria-label="Buscar"
            >
              <IconSearch size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="faq-content">
        {filteredFAQ.length === 0 ? (
          <div className="empty-state">
            <IconSearch size={48} className="empty-state-icon" />
            <h3 className="empty-state-title">Nenhuma pergunta encontrada</h3>
            <p className="empty-state-description">
              Tente usar outras palavras-chave para sua busca
            </p>
          </div>
        ) : (
          <div className="faq-list">
            {filteredFAQ.map((item) => (
              <Card key={item.id} className="faq-item">
                <div 
                  className="faq-question"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <h3 className="question-text">{item.question}</h3>
                  <span className="expand-icon">
                    {expandedId === item.id ? '−' : '+'}
                  </span>
                </div>
                
                {expandedId === item.id && (
                  <div className="faq-answer">
                    <p className="answer-text">{item.answer}</p>
                    <div className="keywords">
                      <span className="keywords-label">Palavras-chave:</span>
                      <div className="keyword-tags">
                        {item.keywords.map((keyword, index) => (
                          <span key={index} className="keyword-tag">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FAQ
