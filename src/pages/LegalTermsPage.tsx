import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scale,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Building2,
  Calendar,
  Shield,
  ExternalLink
} from 'lucide-react';

const LegalTermsPage: React.FC = () => {
  const legalSections = [
    {
      title: 'Base Legal',
      icon: Scale,
      items: [
        'Lei 5.768/71 - Regulamenta distribuição gratuita de prêmios',
        'Lei 13.756/18 - Modernização das regulamentações',
        'Lei 13.019/14 - Marco Regulatório das OSCs',
        'Decreto 11.907/24 - Nova estrutura do Ministério da Fazenda',
        'Portaria SPA 20.749/2020 - Normas para sorteios filantrópicos'
      ]
    },
    {
      title: 'Quem Pode Realizar Sorteios Promocionais',
      icon: Building2,
      allowed: [
        'Organizações da Sociedade Civil (OSCs)',
        'Sociedades cooperativas',
        'Organizações religiosas',
        'Entidades sem fins lucrativos'
      ],
      prohibited: [
        'Pessoas físicas',
        'Empresas comerciais',
        'Organizações com fins lucrativos'
      ]
    }
  ];

  const requirements = [
    {
      step: 1,
      title: 'Cadastro da Organização',
      items: [
        'CNPJ ativo de entidade sem fins lucrativos',
        'Estatuto Social registrado',
        'Ata de eleição da diretoria',
        'Documentação do representante legal'
      ]
    },
    {
      step: 2,
      title: 'Autorização SCPC/SPA',
      items: [
        'Solicitação através do sistema SCPC',
        'Regulamento completo do sorteio',
        'Plano de distribuição de prêmios',
        'Comprovante de propriedade dos prêmios'
      ]
    },
    {
      step: 3,
      title: 'Realização do Sorteio',
      items: [
        'Transmissão ao vivo obrigatória',
        'Auditoria independente',
        'Ata detalhada do sorteio',
        'Publicação imediata dos resultados'
      ]
    },
    {
      step: 4,
      title: 'Prestação de Contas',
      items: [
        'Prazo de 180 dias após sorteio',
        'Comprovantes de entrega dos prêmios',
        'Recibos assinados pelos ganhadores',
        'Relatório financeiro completo'
      ]
    }
  ];

  const penalties = [
    {
      type: 'Administrativas',
      icon: AlertTriangle,
      color: 'text-yellow-400',
      items: [
        'Multa de até 100% do valor dos prêmios',
        'Proibição de realizar promoções por até 2 anos',
        'Suspensão da autorização'
      ]
    },
    {
      type: 'Criminais',
      icon: XCircle,
      color: 'text-red-400',
      items: [
        'Contravenção penal (Art. 51 DL 3.688/41)',
        'Prisão simples de 6 meses a 2 anos',
        'Multa adicional'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900 pt-20">
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-full mb-6">
              <Scale className="w-10 h-10 text-primary-400" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Conformidade Legal
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              O Sort.IO opera em total conformidade com a legislação brasileira sobre sorteios promocionais e sorteios filantrópicos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Legal Framework */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Marco Legal Brasileiro
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {legalSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <section.icon className="w-6 h-6 text-primary-400" />
                  <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                </div>

                {section.items && (
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.allowed && (
                  <>
                    <div className="mb-3">
                      <h4 className="text-green-400 font-semibold mb-2">Permitido:</h4>
                      <ul className="space-y-1">
                        {section.allowed.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-red-400 font-semibold mb-2">Proibido:</h4>
                      <ul className="space-y-1">
                        {section.prohibited.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 px-4 bg-surface-800/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Processo de Conformidade
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requirements.map((req, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary-500/20 rounded-full mb-4">
                  <span className="text-primary-400 font-bold">{req.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{req.title}</h3>
                <ul className="space-y-2">
                  {req.items.map((item, i) => (
                    <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                      <span className="text-primary-400 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Penalties */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Penalidades por Descumprimento
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {penalties.map((penalty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 border border-red-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <penalty.icon className={`w-6 h-6 ${penalty.color}`} />
                  <h3 className="text-xl font-semibold text-white">
                    Sanções {penalty.type}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {penalty.items.map((item, i) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <span className={`${penalty.color} mt-1`}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 border border-primary-500/30 max-w-4xl mx-auto"
          >
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-primary-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Aviso Importante
                </h3>
                <p className="text-gray-300 mb-4">
                  Este sistema deve ser usado EXCLUSIVAMENTE por organizações sem fins lucrativos
                  devidamente autorizadas pela Secretaria de Prêmios e Apostas (SPA) do Ministério da Fazenda.
                </p>
                <p className="text-gray-300 mb-6">
                  O uso indevido pode resultar em sanções criminais e administrativas severas,
                  incluindo multas e prisão conforme previsto na Lei 5.768/71 e no Decreto-Lei 3.688/41.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Site Oficial SPA
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.planalto.gov.br/ccivil_03/leis/l5768.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Lei 5.768/71
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-gray-400 mb-6">
              Tem dúvidas sobre conformidade legal?
            </p>
            <Link to="/contact" className="btn-primary">
              Entre em Contato
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LegalTermsPage;