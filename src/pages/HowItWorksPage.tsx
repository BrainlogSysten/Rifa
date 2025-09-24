import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  UserCheck,
  FileText,
  Trophy,
  DollarSign,
  Clock,
  CheckCircle,
  Award,
  Users,
  ShoppingCart,
  Ticket,
  PartyPopper,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Cadastre-se",
      description: "Crie sua conta como pessoa física (CPF) ou organização (CNPJ)",
      details: [
        "CPF: Pode comprar bilhetes",
        "CNPJ: Pode criar sorteios promocionais (apenas entidades sem fins lucrativos)"
      ]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Escolha uma Sorteio Promocional",
      description: "Navegue pelas sorteios promocionais disponíveis e escolha a que mais te interessa",
      details: [
        "Veja todos os detalhes do prêmio",
        "Confira a data do sorteio",
        "Verifique a autorização SCPC"
      ]
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "Compre Bilhetes",
      description: "Selecione seus números da sorte e realize o pagamento",
      details: [
        "Escolha números disponíveis",
        "Pague via PIX ou cartão",
        "Receba confirmação por e-mail"
      ]
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Aguarde o Sorteio",
      description: "O sorteio é realizado na data marcada com total transparência",
      details: [
        "Sorteio ao vivo (quando aplicável)",
        "Resultado imediato",
        "Notificação ao vencedor"
      ]
    }
  ];

  const organizationSteps = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Cadastro de Organização",
      description: "Registre sua entidade sem fins lucrativos",
      requirements: [
        "Estatuto Social",
        "Ata de Eleição",
        "Cartão CNPJ",
        "Comprovante de Endereço"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Aprovação e Autorização",
      description: "Aguarde aprovação e solicite autorização SCPC",
      requirements: [
        "Análise dos documentos",
        "Verificação de conformidade",
        "Emissão de autorização SCPC/SPA"
      ]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Crie sua Sorteio Promocional",
      description: "Configure todos os detalhes do seu sorteio promocional beneficente",
      requirements: [
        "Defina o prêmio",
        "Estabeleça preço dos bilhetes",
        "Escolha data do sorteio"
      ]
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Prestação de Contas",
      description: "Após o sorteio, preste contas em até 180 dias",
      requirements: [
        "Relatório financeiro",
        "Comprovantes de aplicação",
        "Documentação do beneficiário"
      ]
    }
  ];

  const faqs = [
    {
      question: "Quem pode criar sorteios promocionais?",
      answer: "Apenas entidades sem fins lucrativos (associações, institutos, ONGs) podem criar sorteios promocionais, conforme a Lei 5.768/71."
    },
    {
      question: "É seguro comprar bilhetes?",
      answer: "Sim! Todas as sorteios promocionais possuem autorização da Secretaria de Prêmios e Apostas (SPA) e seguem a legislação brasileira."
    },
    {
      question: "Como sei se ganhei?",
      answer: "Você será notificado por e-mail e SMS. O resultado também fica disponível na plataforma."
    },
    {
      question: "Qual o prazo para retirar o prêmio?",
      answer: "Geralmente 90 dias após o sorteio. Verifique o regulamento específico de cada sorteio promocional."
    },
    {
      question: "Posso cancelar minha compra?",
      answer: "Não. A compra de bilhetes é definitiva e não pode ser cancelada após o pagamento."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900 pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <HelpCircle className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-white mb-6">Como Funciona</h1>
            <p className="text-xl text-white/90">
              Entenda o passo a passo para participar das sorteios promocionais beneficentes
              de forma segura e transparente
            </p>
          </motion.div>
        </div>
      </div>

      {/* Para Compradores */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Para Compradores
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Participe de sorteios promocionais beneficentes e concorra a prêmios incríveis
            ajudando causas sociais
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-bold text-gray-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Para Organizações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Para Organizações Sem Fins Lucrativos
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Crie sorteios promocionais beneficentes para arrecadar fundos para sua causa social
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {organizationSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="card p-6 border border-secondary-500/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-secondary-500/20 rounded-full flex items-center justify-center text-secondary-400">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-bold text-gray-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                      <ArrowRight className="w-4 h-4 text-secondary-400 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Legal Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8 mb-16"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                Importante: Conformidade Legal
              </h3>
              <p className="text-gray-300 mb-4">
                O Sort.IO opera em total conformidade com a legislação brasileira sobre sorteios promocionais e sorteios:
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Lei nº 5.768/71 - Distribuição gratuita de prêmios</li>
                <li>• Lei nº 13.756/18 - Modalidades lotéricas</li>
                <li>• Portaria SPA nº 20.749/2020 - Regulamentação de sorteios</li>
                <li>• Apenas entidades sem fins lucrativos podem criar sorteios promocionais</li>
                <li>• Autorização obrigatória da SPA/SCPC para cada sorteio promocional</li>
                <li>• Prestação de contas obrigatória em 180 dias</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Perguntas Frequentes
          </h2>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-gray-400 ml-8">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Pronto para começar?
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já participam de sorteios promocionais beneficentes
            e ajudam causas sociais importantes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary">
              Criar Conta
            </Link>
            <Link to="/raffles" className="btn-secondary">
              Ver Sorteio Promocionals Disponíveis
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorksPage;