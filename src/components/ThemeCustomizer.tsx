import React, { useState } from 'react'
import {
  Palette,
  Monitor,
  Smartphone,
  Check,
  ArrowLeft,
  Share2,
  DollarSign,
  Clock,
  Users,
  Calendar,
  Grid3X3,
  ShoppingCart,
  CreditCard,
  Info,
  Ticket as TicketIcon
} from 'lucide-react'

interface ThemeCustomizerProps {
  theme: any
  onChange: (theme: any) => void
}

// 3 Templates Premium Cuidadosamente Desenvolvidos
const themeTemplates = [
  {
    id: 'premium-fire',
    name: 'Fire Premium',
    preview: '#DC2626',
    description: 'Design premium com gradiente vermelho-dourado. Ideal para rifas de produtos eletrônicos, carros e prêmios de alto valor. Transmite energia, urgência e exclusividade.',
    features: ['Gradiente impactante', 'Tipografia moderna', 'Efeitos de sombra', 'Animações suaves'],
    bestFor: 'Eletrônicos, Carros, Joias',
    theme: {
      primaryColor: '#DC2626',
      secondaryColor: '#B91C1C',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      gradientEnabled: true,
      gradientType: 'linear',
      gradientAngle: 135,
      gradientColors: ['#DC2626', '#F59E0B', '#EF4444'],
      fontFamily: 'Inter',
      headingFont: 'Poppins',
      fontSize: 'medium',
      buttonStyle: 'rounded',
      buttonEffect: 'shadow',
      animations: true,
      animationSpeed: 'normal',
      borderRadius: 12,
      spacing: 'normal'
    }
  },
  {
    id: 'luxury-royal',
    name: 'Royal Luxury',
    preview: '#6366F1',
    description: 'Elegância e sofisticação com roxo real e dourado. Perfeito para rifas premium, experiências exclusivas e produtos de luxo. Design que inspira confiança e status.',
    features: ['Cores sofisticadas', 'Fontes elegantes', 'Efeito glow', 'Espaçamento generoso'],
    bestFor: 'Experiências VIP, Produtos de Luxo, Viagens',
    theme: {
      primaryColor: '#6366F1',
      secondaryColor: '#4F46E5',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      gradientEnabled: true,
      gradientType: 'linear',
      gradientAngle: 120,
      gradientColors: ['#6366F1', '#8B5CF6', '#EC4899'],
      fontFamily: 'Poppins',
      headingFont: 'Playfair Display',
      fontSize: 'medium',
      buttonStyle: 'pill',
      buttonEffect: 'glow',
      animations: true,
      animationSpeed: 'normal',
      borderRadius: 16,
      spacing: 'spacious'
    }
  },
  {
    id: 'clean-professional',
    name: 'Clean Professional',
    preview: '#059669',
    description: 'Design limpo e profissional com verde confiança. Ideal para rifas corporativas, produtos sustentáveis e campanhas sérias. Transmite credibilidade e transparência.',
    features: ['Design minimalista', 'Alta legibilidade', 'Cores equilibradas', 'Foco no conteúdo'],
    bestFor: 'Rifas Corporativas, Produtos Sustentáveis, Causas Sociais',
    theme: {
      primaryColor: '#059669',
      secondaryColor: '#047857',
      accentColor: '#0891B2',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      gradientEnabled: true,
      gradientType: 'linear',
      gradientAngle: 90,
      gradientColors: ['#059669', '#0891B2'],
      fontFamily: 'Inter',
      headingFont: 'Inter',
      fontSize: 'medium',
      buttonStyle: 'rounded',
      buttonEffect: 'shadow',
      animations: true,
      animationSpeed: 'normal',
      borderRadius: 8,
      spacing: 'normal'
    }
  }
]

export default function ThemeCustomizer({ theme, onChange }: ThemeCustomizerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('premium-fire')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = themeTemplates.find(t => t.id === templateId)
    if (template) {
      onChange(template.theme)
    }
  }

  const currentTheme = themeTemplates.find(t => t.id === selectedTemplate)?.theme || themeTemplates[0].theme

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Escolha o Tema Perfeito para sua Rifa
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          3 temas premium cuidadosamente desenvolvidos para diferentes tipos de rifas.
          Cada um foi pensado para maximizar conversões e transmitir a personalidade ideal do seu negócio.
        </p>
      </div>

      {/* Grid de Templates - Layout melhorado para 3 items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {themeTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => handleTemplateSelect(template.id)}
            className={`
              relative p-6 rounded-xl border-2 transition-all hover:scale-105 text-left
              ${selectedTemplate === template.id
                ? 'border-primary-500 bg-primary-50 shadow-xl'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            {/* Preview Circle */}
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 shadow-lg"
              style={{
                background: template.theme.gradientEnabled
                  ? `linear-gradient(${template.theme.gradientAngle}deg, ${template.theme.gradientColors.join(', ')})`
                  : template.preview
              }}
            />

            <h4 className="font-bold text-lg text-gray-900 mb-2 text-center">
              {template.name}
            </h4>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {template.description}
            </p>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">IDEAL PARA:</p>
              <p className="text-xs text-primary-600 font-medium">{template.bestFor}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-700">RECURSOS:</p>
              {template.features.map((feature, index) => (
                <p key={index} className="text-xs text-gray-600">• {feature}</p>
              ))}
            </div>

            {selectedTemplate === template.id && (
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Preview Section */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Preview da Página da Rifa</h4>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={`
          border rounded-lg overflow-hidden transition-all bg-gray-50
          ${previewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}
        `}>
          {/* Header */}
          <div
            className="relative h-48"
            style={{
              background: currentTheme.gradientEnabled
                ? `linear-gradient(${currentTheme.gradientAngle}deg, ${currentTheme.gradientColors.join(', ')})`
                : currentTheme.primaryColor
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 container mx-auto h-full flex flex-col justify-between p-4">
              <div className="flex justify-between items-start">
                <button className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </button>
                <button className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                  Compartilhar
                </button>
              </div>
              <div>
                <h1
                  className="text-3xl font-bold text-white mb-2"
                  style={{ fontFamily: currentTheme.headingFont }}
                >
                  iPhone 15 Pro Max 256GB
                </h1>
                <p className="text-white/80">Sorteio em 25/12/2024</p>
              </div>
            </div>
          </div>

          {/* Container Principal */}
          <div className="container mx-auto px-4 py-6" style={{ backgroundColor: currentTheme.backgroundColor }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Esquerda */}
              <div className="lg:col-span-2 space-y-4">
                {/* Card de Imagem */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderRadius: `${currentTheme.borderRadius}px` }}>
                  <div className="aspect-video relative bg-gray-100 flex items-center justify-center">
                    <TicketIcon className="w-20 h-20 text-gray-300" />
                  </div>
                </div>

                {/* Card de Descrição */}
                <div className="bg-white rounded-xl shadow-sm p-6" style={{ borderRadius: `${currentTheme.borderRadius}px` }}>
                  <h2
                    className="text-2xl font-bold mb-4"
                    style={{
                      fontFamily: currentTheme.headingFont,
                      color: currentTheme.textColor
                    }}
                  >
                    Descrição
                  </h2>
                  <p
                    className={`
                      ${currentTheme.fontSize === 'small' ? 'text-sm' : ''}
                      ${currentTheme.fontSize === 'medium' ? 'text-base' : ''}
                      ${currentTheme.fontSize === 'large' ? 'text-lg' : ''}
                    `}
                    style={{ color: currentTheme.textColor }}
                  >
                    Concorra ao mais novo iPhone 15 Pro Max 256GB! • Tela Super Retina XDR • Chip A17 Pro • Sistema de câmera Pro
                  </p>
                </div>
              </div>

              {/* Coluna Direita - Card de Compra */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6" style={{ borderRadius: `${currentTheme.borderRadius}px` }}>
                  <h1
                    className="text-2xl font-bold mb-4"
                    style={{
                      fontFamily: currentTheme.headingFont,
                      color: currentTheme.textColor
                    }}
                  >
                    iPhone 15 Pro Max
                  </h1>

                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-success-100 text-success-700">
                      Rifa Ativa
                    </span>
                  </div>

                  {/* Informações */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Valor do bilhete</span>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: currentTheme.primaryColor }}
                      >
                        R$ 10,00
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Participantes</span>
                      </div>
                      <span className="font-semibold">45 / 100</span>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progresso</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: '45%',
                          background: currentTheme.gradientEnabled
                            ? `linear-gradient(90deg, ${currentTheme.gradientColors[0]}, ${currentTheme.gradientColors[1]})`
                            : currentTheme.primaryColor
                        }}
                      />
                    </div>
                  </div>

                  {/* Seleção de Bilhetes */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <button
                        type="button"
                        className={`
                          flex items-center justify-center gap-2 px-4 py-2 transition-colors
                          ${currentTheme.buttonStyle === 'rounded' ? 'rounded-lg' : ''}
                          ${currentTheme.buttonStyle === 'square' ? 'rounded-none' : ''}
                          ${currentTheme.buttonStyle === 'pill' ? 'rounded-full' : ''}
                        `}
                        style={{
                          backgroundColor: `${currentTheme.secondaryColor}20`,
                          color: currentTheme.secondaryColor
                        }}
                      >
                        Aleatório
                      </button>
                      <button
                        type="button"
                        className={`
                          flex items-center justify-center gap-2 px-4 py-2 transition-colors
                          ${currentTheme.buttonStyle === 'rounded' ? 'rounded-lg' : ''}
                          ${currentTheme.buttonStyle === 'square' ? 'rounded-none' : ''}
                          ${currentTheme.buttonStyle === 'pill' ? 'rounded-full' : ''}
                        `}
                        style={{
                          backgroundColor: `${currentTheme.primaryColor}20`,
                          color: currentTheme.primaryColor
                        }}
                      >
                        Escolher
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total</span>
                      <span
                        className="text-2xl font-bold"
                        style={{ color: currentTheme.primaryColor }}
                      >
                        R$ 10,00
                      </span>
                    </div>
                  </div>

                  {/* Botão Principal */}
                  <button
                    type="button"
                    className={`
                      w-full py-4 px-6 text-white font-bold text-lg transition-all flex items-center justify-center gap-2
                      ${currentTheme.buttonStyle === 'rounded' ? 'rounded-lg' : ''}
                      ${currentTheme.buttonStyle === 'square' ? 'rounded-none' : ''}
                      ${currentTheme.buttonStyle === 'pill' ? 'rounded-full' : ''}
                      ${currentTheme.buttonEffect === 'shadow' ? 'shadow-lg' : ''}
                      ${currentTheme.buttonEffect === 'glow' ? 'shadow-xl' : ''}
                      ${currentTheme.buttonEffect === 'scale' ? 'hover:scale-105' : ''}
                      ${currentTheme.animations ? 'transition-all duration-300' : ''}
                    `}
                    style={{
                      backgroundColor: currentTheme.primaryColor,
                      boxShadow: currentTheme.buttonEffect === 'glow'
                        ? `0 0 30px ${currentTheme.primaryColor}60`
                        : undefined
                    }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Comprar Bilhete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações do Tema Selecionado */}
      {currentTheme && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">
            Tema Atual: {themeTemplates.find(t => t.id === selectedTemplate)?.name}
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            {themeTemplates.find(t => t.id === selectedTemplate)?.description}
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-white rounded">
              Fonte: {currentTheme.fontFamily}
            </span>
            <span className="px-2 py-1 bg-white rounded">
              Botões: {currentTheme.buttonStyle === 'rounded' ? 'Arredondados' : currentTheme.buttonStyle === 'square' ? 'Quadrados' : 'Redondos'}
            </span>
            <span className="px-2 py-1 bg-white rounded">
              Gradiente: {currentTheme.gradientEnabled ? 'Sim' : 'Não'}
            </span>
            <span className="px-2 py-1 bg-white rounded">
              Animações: {currentTheme.animations ? 'Sim' : 'Não'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}