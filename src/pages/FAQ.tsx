import { useState } from 'react'
import { IconSearch, IconBook, IconTool } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import * as faqData from '../data/faq.pt-BR.json'

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

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

  return (
    <div className="container">
      <div className="faq-header">
        <div className="faq-hero">
          <IconTool size={64} className="faq-icon" />
          <h1 className="faq-title">Dúvidas Frequentes</h1>
          <p className="faq-subtitle">
            Encontre respostas rápidas para suas dúvidas sobre trauma dentário
          </p>
        </div>

        <div className="search-section">
          <div className="search-container">
            <IconSearch size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="ebook-link">
          <Card className="ebook-card">
            <div className="ebook-content">
              <IconBook size={48} className="ebook-icon" />
              <div className="ebook-text">
                <h3 className="ebook-title">E-book Completo</h3>
                <p className="ebook-description">
                  Acesse o e-book com informações detalhadas sobre trauma dentário
                </p>
              </div>
              <Link to="/ebook">
                <Button variant="primary" size="md">
                  Ver E-book
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <div className="faq-content">
        {filteredFAQ.length === 0 ? (
          <div className="empty-state">
            <IconSearch size={64} className="empty-state-icon" />
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
