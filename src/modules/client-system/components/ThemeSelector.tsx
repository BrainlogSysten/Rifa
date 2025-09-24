import React, { useState } from 'react';
import { RaffleTheme, RAFFLE_THEMES, getCategories } from '../../../constants/themes';
import { Palette, Eye, Check } from 'lucide-react';

interface ThemeSelectorProps {
  selectedTheme: RaffleTheme;
  onThemeSelect: (theme: RaffleTheme) => void;
  showPreview?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  selectedTheme, 
  onThemeSelect, 
  showPreview = true 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [showModal, setShowModal] = useState(false);

  const categories = ['Todos', ...getCategories()];
  
  const filteredThemes = selectedCategory === 'Todos' 
    ? RAFFLE_THEMES 
    : RAFFLE_THEMES.filter(theme => theme.category === selectedCategory);

  const ThemeCard = ({ theme }: { theme: RaffleTheme }) => (
    <div
      onClick={() => {
        onThemeSelect(theme);
        setShowModal(false);
      }}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:scale-105 ${
        selectedTheme.id === theme.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
    >
      <div className="relative">
        <div 
          className="h-32 rounded-lg mb-3 flex items-center justify-center text-4xl"
          style={{
            background: theme.backgroundImage || `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
          }}
        >
          {theme.preview}
        </div>
        
        {selectedTheme.id === theme.id && (
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>

      <h3 className="font-bold text-gray-900 mb-1">{theme.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{theme.category}</p>
      
      <div className="flex gap-2 mb-3">
        <div 
          className="w-6 h-6 rounded-full border border-gray-200"
          style={{ backgroundColor: theme.primaryColor }}
          title="Cor primária"
        />
        <div 
          className="w-6 h-6 rounded-full border border-gray-200"
          style={{ backgroundColor: theme.secondaryColor }}
          title="Cor secundária"
        />
        <div 
          className="w-6 h-6 rounded-full border border-gray-200"
          style={{ backgroundColor: theme.accentColor }}
          title="Cor de destaque"
        />
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Botão:</strong> {theme.ticketButtonText}</p>
        <p><strong>Compra:</strong> {theme.purchaseButtonText}</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tema da Rifa
        </label>
        
        <button
          onClick={() => setShowModal(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center gap-3"
        >
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
            style={{
              background: selectedTheme.backgroundImage || `linear-gradient(135deg, ${selectedTheme.primaryColor}, ${selectedTheme.secondaryColor})`
            }}
          >
            {selectedTheme.preview}
          </div>
          
          <div className="flex-1 text-left">
            <h4 className="font-medium text-gray-900">{selectedTheme.name}</h4>
            <p className="text-sm text-gray-600">{selectedTheme.category}</p>
          </div>
          
          <Palette className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Escolher Tema</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredThemes.map(theme => (
                  <ThemeCard key={theme.id} theme={theme} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPreview && selectedTheme && (
        <div className="mt-4 p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview do Tema
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Cores:</span>
              <div className="flex gap-1">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: selectedTheme.primaryColor }}
                />
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: selectedTheme.secondaryColor }}
                />
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: selectedTheme.accentColor }}
                />
              </div>
            </div>
            
            <div className="text-sm space-y-1">
              <p><strong>Título:</strong> "{selectedTheme.headerTitle}"</p>
              <p><strong>Botão de escolha:</strong> "{selectedTheme.ticketButtonText}"</p>
              <p><strong>Botão de compra:</strong> "{selectedTheme.purchaseButtonText}"</p>
              <p><strong>Rodapé:</strong> "{selectedTheme.footerText}"</p>
              <p><strong>Fonte:</strong> {selectedTheme.fontFamily}</p>
              <p><strong>Estilo dos botões:</strong> {
                selectedTheme.buttonStyle === 'rounded' ? 'Arredondados' :
                selectedTheme.buttonStyle === 'square' ? 'Quadrados' : 'Pílula'
              }</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;